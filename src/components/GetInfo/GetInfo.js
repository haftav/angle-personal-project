import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser, updateUser } from '../../ducks/users';
import Dropzone from 'react-dropzone';

class GetInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                image_data: {}
            }
        }

        this.updateUser = this.updateUser.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
        this.setState({
            user: Object.assign({}, this.state.user, { artist_type: 'Both', image_data: {} })
        })
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user.info === 'true') {
            this.props.history.push('/dashboard')
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
        const { user_name, first_name, last_name, description, artist_type } = this.state.user;
        if (user_name && first_name && last_name && description && artist_type) {
            this.props.updateUser(this.state.user);
        } else {
            alert('Please fill in the required information.')
        }
    }


    render() {
        console.log(this.state);
        return (
            <div>
                {/* {
                    this.props.loading ?
                    <h1>Loading</h1>
                    : */}
                <div>
                    <h1>Get Info</h1>
                    <h3>Please fill in some more info about yourself.</h3>
                    <h3>Username</h3>
                    <input placeholder={this.state.user.user_name}
                        onChange={(e) => this.updateUser(e.target.value, 'user_name')} />
                    <h3>First Name</h3>
                    <input placeholder={this.state.user.first_name}
                        onChange={(e) => this.updateUser(e.target.value, 'first_name')} />
                    <h3>Last Name</h3>
                    <input placeholder={this.state.user.last_name}
                        onChange={(e) => this.updateUser(e.target.value, 'last_name')} />
                    <h3>Description</h3>
                    <textarea onChange={(e) => this.updateUser(e.target.value, 'description')}></textarea>
                    <h3>Artist Type</h3>
                    <select onChange={(e) => this.updateUser(e.target.value, 'artist_type')}>
                        <option selected='selected' value='Both'>Both</option>
                        <option value='Filmmaker'>Filmmaker</option>
                        <option value='Musician'>Musician</option>
                    </select>
                    <Dropzone
                        onDrop={this.handleDrop}
                        accept="image/*" >
                        <p>Drop your files or click here to upload</p>
                    </Dropzone>
                    <button onClick={this.handleUpdate}>Submit</button>
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