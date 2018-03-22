import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import '../ModalContainer/ModalStyle.css';

class ModalDelete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {}
        }

        this.handleClick = this.handleClick.bind(this);
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


    handleUpdate() {
            this.props.update(this.state.project);
            this.props.toggleModal();

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
                className={active ? 'modal modal-delete modal-active' : 'modal modal-delete'}>
                <div>
                    <h1>Are you sure you want to delete this project?</h1>
                    <h2>This cannot be undone.</h2>

                    <button onClick={this.handleUpdate}>Delete Project</button>
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

export default connect(mapStateToProps, actions)(ModalDelete)