import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import '../ModalContainer/ModalStyle.css';
import Dropzone from 'react-dropzone';

class ModalProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                image_data: {}
            }
        }

        this.handleClick = this.handleClick.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
        this.props.getUser();
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.setState({
                project: Object.assign({}, newProps.project, { image_data: {} })
            })
        }
    }

    updateProject(val, type) {
        this.setState({ project: Object.assign({}, this.state.project, { [type]: val }) })
    }

    handleUpdate() {
        const { name, description } = this.state.project;
        if (name && description) {
            this.props.update(this.state.project);
            this.props.toggleModal();
        } else {
            alert('Please fill in the required information.')
        }
    }

    handleClick(e) {
        if (this.props.active) {
            if (!this.node.contains(e.target)) {
                this.props.toggleModal();
            }
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
            project: Object.assign({}, this.state.project, { image_data: formData })
        })

    }

    render() {
        console.log(this.state.project);
        const { toggleModal, active, update } = this.props;
        const { name, type, description, price, image } = this.props.project
        return (
            <div ref={node => this.node = node}
                className={active ? 'modal modal-active' : 'modal'}>
                <div>
                    <h1>Edit Info</h1>
                    <h2>Name</h2>
                    <input 
                        maxlength='75'
                        placeholder={name}
                        value={this.state.project.name}
                        onChange={(e) => this.updateProject(e.target.value, 'name')} />
                    <h2>Description</h2>
                    <textarea 
                        maxlength='700'
                        placeholder={description}
                        value={this.state.project.description}
                        onChange={(e) => this.updateProject(e.target.value, 'description')} >
                    </textarea>
                    <h2>Image</h2>
                    <Dropzone
                        className='dropzone'
                        onDrop={this.handleDrop}
                        accept="image/*" >
                        <p>Drop your files or click here to upload</p>
                    </Dropzone>
                    <button onClick={this.handleUpdate}>Submit</button>
                    <div className='x-button' onClick={toggleModal}>X</div>
                </div>
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

export default connect(mapStateToProps, actions)(ModalProject)