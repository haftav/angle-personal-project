import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                project_deadline: ''
            },
            completion_time: 7,
            image_data: {}
        }

        this.updateProject = this.updateProject.bind(this);
        this.createProject = this.createProject.bind(this);
        this.updateBiddingDeadline = this.updateBiddingDeadline.bind(this);
        this.updateCompletionTime = this.updateCompletionTime.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
    }

    handleDrop(files) {

        console.log(files[0])

        console.log(process.env);

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("tags", `angle`);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET); // Replace the preset name with your own
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_KEY); // Replace API key with your own Cloudinary key
        formData.append("timestamp", (Date.now() / 1000) | 0);


        this.setState({
            image_data: formData
        })

    }

    updateProject(val, type) {
        this.setState({ project: Object.assign({}, this.state.project, { [type]: val }) })
    }

    updateBiddingDeadline(val) {
        let project_deadline = new Date(val)
        project_deadline.setDate(project_deadline.getDate() + this.state.completion_time);
        project_deadline = project_deadline.toISOString().split('T')[0];
        this.setState({
            project: Object.assign({}, this.state.project, {
                'bidding_deadline': val,
                'project_deadline': project_deadline
            })
        })
    }

    updateCompletionTime(val) {
        let project_deadline = '';
        val = Number(val);
        if (this.state.project.bidding_deadline) {
            project_deadline = new Date(this.state.project.bidding_deadline)
            project_deadline.setDate(project_deadline.getDate() + val);
            project_deadline = project_deadline.toISOString().split('T')[0];
        }
        this.setState({
            completion_time: val,
            project: Object.assign({}, this.state.project, { 'project_deadline': project_deadline })
        })
    }

    createProject() {
        let { name, type, price, description, image, bidding_deadline, project_deadline } = this.state.project;
        if (name && type && price && description && bidding_deadline && project_deadline) {
            const user_id = this.props.user.id;
            if (this.state.image_data instanceof FormData) {
                axios.post(process.env.REACT_APP_CLOUDINARY_URL, this.state.image_data, {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                }).then(res => {
                    const data = res.data;
                    image = data.secure_url // You should store this URL for future references in your app
                    axios.post('/api/projects', { user_id, name, type, price, description, image, bidding_deadline, project_deadline }).then(res => {
                        this.props.history.push('/dashboard')
                    })
                })

        } else {
            image = ''
            axios.post('/api/projects', { user_id, name, type, price, description, image, bidding_deadline, project_deadline }).then(res => {
                this.props.history.push('/dashboard')
            })
        }
    } else {
    alert('Please fill out all fields.');
}
    }

render() {
    console.log(this.state.image_data instanceof FormData)
    let today = new Date();
    today.setDate(today.getDate() + 1)
    today = today.toISOString().split('T')[0];
    let deadline = this.state.project.bidding_deadline ? new Date(this.state.project.bidding_deadline) : null;
    if (deadline) {
        deadline.setDate(deadline.getDate() + this.state.completion_time);
        deadline = deadline.toISOString().split('T')[0];
    }
    return (
        <div>
            <Header />
            <h1>CREATE YOUR PROJECT</h1>
            <h2>Name</h2>
            <input onChange={(e) => this.updateProject(e.target.value, 'name')} />
            <h2>Looking For</h2>
            <select onChange={(e) => this.updateProject(e.target.value, 'type')}>
                <option>Select an option</option>
                <option>Filmmaker</option>
                <option>Musician</option>
            </select>
            <h2>Description</h2>
            <input onChange={(e) => this.updateProject(e.target.value, 'description')} />
            {/* <h2>Deadline</h2>
                <input onChange={(e) => this.updateProject(e.target.value, 'deadline')}/> */}
            <h2>Bidding Deadline</h2>
            <input type='date' min={today} onChange={(e) => this.updateBiddingDeadline(e.target.value)} />
            <h2>Weeks to Complete</h2>
            <select onChange={(e) => this.updateCompletionTime(e.target.value)}>
                <option value='7'>1 Week</option>
                <option value='14'>2 Weeks</option>
                <option value='21'>3 Weeks</option>
                <option value='28'>4 Weeks</option>
            </select>
            <h2>Payment</h2>
            <select onChange={(e) => this.updateProject(e.target.value, 'price')}>
                <option>Select an option</option>
                <option>$25.00</option>
                <option>$50.00</option>
                <option>$100.00</option>
                <option>$250.00</option>
            </select>
            <h2>Image</h2>
            <Dropzone
                onDrop={this.handleDrop}
                multiple
                accept="image/*" >
                <p>Drop your files or click here to upload</p>
            </Dropzone>
            <button onClick={this.createProject}>Submit</button>

            <h1>Deadline</h1>
            {deadline}

        </div>
    )
}
}

function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    }
}

let actions = {
    getUser
}

export default connect(mapStateToProps, actions)(CreateProject);