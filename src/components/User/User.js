import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './User.css';
import ProfileProjectThumbnail from '../ProfileProjectThumbnail/ProfileProjectThumbnail';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            user: {}
        }

    }

    componentDidMount() {
        axios.get(`/api/user/${this.props.match.params.id}`).then(res => {
            this.setState({
                user: res.data
            })
        })
        axios.get(`/api/projects/user/${this.props.match.params.id}`).then(res => {
            this.setState({
                projects: res.data
            })
        })
    }



    render() {
        const { first_name, last_name, user_name, description, artist_type, image, id } = this.state.user;
        const projects = this.state.projects.map((el, idx) => {
            let { name, type, description, image, id } = el;
            return (
                <ProfileProjectThumbnail name={name}
                                        type={type}
                                        description={description}
                                        image={image}
                                        id={id} />
            )
        })
        return (
            <div>
                <Header />
                <Link to="/dashboard"><button>Dashboard</button></Link>
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
                        <div className='profile-projects'>
                            {projects}
                        </div>
                    </div>
                    <div className='profile-contact'>
                        <h1>CONTACT</h1>
                    </div>
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

export default connect(mapStateToProps, actions)(User);