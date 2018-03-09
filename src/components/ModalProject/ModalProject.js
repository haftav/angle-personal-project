import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import './ModalProject.css'

class ModalProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {}
        }

    this.handleClick = this.handleClick.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
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
                project: newProps.project
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
    render() {
        const { toggleModal, active, update } = this.props;
        const { name, type, description, price, image } = this.props.project
        return (
            <div ref={node => this.node = node}
                className={active ? 'modal modal-active' : 'modal'}>
 <div>
                        <h1>Edit Info</h1>
                        <h2>Name</h2>
                        <input  placeholder={name}
                                value={this.state.project.name}
                                onChange={(e) => this.updateProject(e.target.value, 'name')}/>
                        <h2>Description</h2>
                        <input placeholder={description}
                                value={this.state.project.description}
                                onChange={(e) => this.updateProject(e.target.value, 'description')}/> 
                        <h2>Image</h2>     
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