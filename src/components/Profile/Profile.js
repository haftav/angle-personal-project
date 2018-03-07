import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import axios from 'axios';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
        }

        this.modalClick = this.modalClick.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
    }


    modalClick() {
        this.setState({
            modalActive: !this.state.modalActive
        })
    }

    render() {
        const { first_name, last_name, user_name, description, artist_type, image, id } = this.props.user;
        return (
            <div>
                <Header />
                <div className='profile'>
                    <div className='profile-user-content'>
                        <img src={image}
                            alt={`user/${id}`}
                            className='profile-image' />
                        <div className='profile-description'>
                            <h1>{user_name || 'username'}</h1>
                            <h2>{first_name || 'first'} {last_name || 'last'}</h2>
                            <h2>{artist_type || 'specialty'}</h2>
                            <p>{description || 'description description description description etc.'}</p>
                            <button onClick={this.modalClick}>Edit Info</button>
                        </div>
                        <div className='profile-stats'>
                            <div>
                                Projects
                        </div>
                            <div>
                                Reviews
                        </div>
                            <div>
                                Connections
                        </div>
                        </div>
                    </div>
                    <div className='profile-contact'>
                    </div>
                </div>

                <ModalContainer toggleModal={this.modalClick}
                    active={this.state.modalActive} />
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

export default connect(mapStateToProps, actions)(Profile);