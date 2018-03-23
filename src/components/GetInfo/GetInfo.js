import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser, updateUser } from '../../ducks/users';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import _ from 'underscore';
import logo from './whitelogo.png'

class GetInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                image_data: {}
            },
            loading: true
        }

        this.updateUser = this.updateUser.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }


    componentDidMount() {
        axios.get('/api/user/info').then(res => {
            if (res.data) {
                this.props.history.push('/dashboard')
            } else {
                this.props.getUser();
            }
        })
    }

    componentWillReceiveProps(newProps) {
        if (!_.isEqual(this.props, newProps)) {
            axios.get('/api/user/info').then(res => {
                if (res.data) {
                    this.props.history.push('/dashboard')
                } else {
                    this.setState({
                        user: Object.assign({}, newProps.user, { artist_type: 'Both', image_data: {} }),
                        loading: false
                    })
                }
            })
        }
    }

    handleDrop(files) {

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("tags", `angle`);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET); // Replace the preset name with your own
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_KEY); // Replace API key with your own Cloudinary key
        formData.append("timestamp", (Date.now() / 1000) | 0);

        this.setState({
            user: Object.assign({}, this.state.user, { image_data: formData })
        })

    }

    updateUser(val, type) {
        this.setState({ user: Object.assign({}, this.state.user, { [type]: val }) })
    }

    handleUpdate() {
        const { first_name, last_name, description, artist_type } = this.state.user;
        if (first_name && last_name && description && artist_type) {
            this.props.updateUser(this.state.user);
        } else {
            alert('Please fill in the required information.')
        }
    }


    render() {
        console.log(this.state);
        return (
            this.state.loading ?
                <h1>Loading</h1>
                :
                <div>
                    {/* {
                    this.props.loading ?
                    <h1>Loading</h1>
                    : */}
                    <div className='login-header'>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className='create-project' style={{marginTop: "0px", height: "calc(100vh - 95px"}}>
                        <h1 style={{marginBottom: "25px"}}>Please fill in some more info about yourself.</h1>
                        <h2>First Name</h2>
                        <input placeholder={this.state.user.first_name}
                            onChange={(e) => this.updateUser(e.target.value, 'first_name')} />
                        <h2>Last Name</h2>
                        <input placeholder={this.state.user.last_name}
                            onChange={(e) => this.updateUser(e.target.value, 'last_name')} />
                        <h2>Description</h2>
                        <textarea onChange={(e) => this.updateUser(e.target.value, 'description')}></textarea>
                        <h2>Artist Type</h2>
                        <select onChange={(e) => this.updateUser(e.target.value, 'artist_type')}
                                style={{marginBottom: "10px"}}>
                            <option selected='selected' value='Both'>Both</option>
                            <option value='Filmmaker'>Filmmaker</option>
                            <option value='Musician'>Musician</option>
                        </select>
                        <h2>Image</h2>
                        <Dropzone
                            className='dropzone'
                            onDrop={this.handleDrop}
                            accept="image/*" >
                            <p>Drop your files or click here to upload</p>
                        </Dropzone>
                        <button onClick={this.handleUpdate} style={{marginBottom: "15px"}}>Submit</button>
                    </div>
                    {/* // } */}
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { user, loading } = state;
    return {
        user,
        loading
    }
}

let actions = {
    getUser,
    updateUser
}

export default connect(mapStateToProps, actions)(GetInfo);