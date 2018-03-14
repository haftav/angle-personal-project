import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { updateUser, getUser } from '../../ducks/users';
import './ModalInfo.css'

class ModalInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }

    this.handleClick = this.handleClick.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
        this.props.getUser();
        this.setState({
            user: this.props.user
        })
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    updateUser(val, type) {
        this.setState({ user: Object.assign({}, this.state.user, { [type]: val }) })
    }

    handleUpdate() {
        const { user_name, first_name, last_name, description, artist_type } = this.state.user;
        if (user_name && first_name && last_name && description && artist_type) {
            this.props.updateUser(this.state.user);
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
        console.log(this.state.user.artist_type);
        const { toggleModal, active } = this.props;
        return (
            <div ref={node => this.node = node}
                className={active ? 'modal modal-active' : 'modal'}>
 <div>
                        <h1>Edit Info</h1>
                        <h3>First Name</h3>
                        <input placeholder={this.state.user.first_name}
                                onChange={(e) => this.updateUser(e.target.value, 'first_name')}/>
                        <h3>Last Name</h3>
                        <input placeholder={this.state.user.last_name}
                                onChange={(e) => this.updateUser(e.target.value, 'last_name')}/>
                        <h3>Description</h3>
                        <textarea onChange={(e) => this.updateUser(e.target.value, 'description')}></textarea>
                        <h3>Artist Type</h3>
                        <select onChange={(e) => this.updateUser(e.target.value, 'artist_type')}>
                            <option selected={this.props.user.artist_type === 'Both' ? 'selected' : ''}value='Both'>Both</option>
                            <option selected={this.props.user.artist_type === 'Filmmaker' ? 'selected' : ''} value='Filmmaker'>Filmmaker</option>
                            <option selected={this.props.user.artist_type === 'Musician' ? 'selected' : ''} value='Musician'>Musician</option>
                        </select>
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
    updateUser,
    getUser
}

export default connect(mapStateToProps, actions)(ModalInfo)