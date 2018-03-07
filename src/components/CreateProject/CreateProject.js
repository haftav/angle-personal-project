import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {}
        }

        this.updateProject = this.updateProject.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
    }

    updateProject(val, type) {
        this.setState({ project: Object.assign({}, this.state.project, { [type]: val }) })
    }

    createProject() {
        const { name, type, price, description, image } = this.state.project;
        const user_id = this.props.user.id;
        axios.post('/api/projects', { user_id, name, type, price, description, image}).then(res => {
            this.props.history.push('/dashboard')
        })
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <Header />
                <h1>CREATE YOUR PROJECT</h1>
                <h2>Name</h2>
                <input onChange={(e) => this.updateProject(e.target.value, 'name')}/>
                <h2>Looking For</h2>
                <select onChange={(e) => this.updateProject(e.target.value, 'type')}>
                    <option>Select an option</option>
                    <option>Filmmaker</option>
                    <option>Musician</option>
                </select>
                <h2>Description</h2>
                <input onChange={(e) => this.updateProject(e.target.value, 'description')}/>
                {/* <h2>Deadline</h2>
                <input onChange={(e) => this.updateProject(e.target.value, 'deadline')}/> */}
                <h2>Payment</h2>
                <select onChange={(e) => this.updateProject(e.target.value, 'price')}>
                    <option>Select an option</option>
                    <option>$25.00</option>
                    <option>$50.00</option>
                    <option>$100.00</option>
                    <option>$250.00</option>
                </select>
                <h2>Image</h2>
                <input onChange={(e) => this.updateProject(e.target.value, 'image')}/>
                <button onClick={this.createProject}>Submit</button>
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