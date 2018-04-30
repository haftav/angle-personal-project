import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Profile.css';
import ProfileProjectThumbnail from '../ProfileProjectThumbnail/ProfileProjectThumbnail';
import Requests from '../Requests/Requests';
import Portfolio from '../Portfolio/Portfolio';
import Connections from '../Connections/Connections';
import Reviews from '../Reviews/Reviews';

import _ from 'underscore';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            projects: [],
            userInfo: {},
            loading: true
        }

        this.modalClick = this.modalClick.bind(this);
    }

    componentDidMount() {
        this.props.getUser().then(res => {
            if (!res.value) {
                this.props.history.push('/');
            } else {
                if (this.props.user.id != this.props.match.params.id) {
                    this.props.history.push(`/profile/${this.props.user.id}`);
                } else {
                    axios.get(`/api/projects/user/${this.props.user.id}`).then(res => {
                        this.setState({
                            projects: res.data,
                            loading: false
                        })
                    })
                    axios.get(`/api/stats/${this.props.match.params.id}`).then(res => {
                        this.setState({
                            userInfo: Object.assign({}, this.state.userInfo, res.data)
                        })
                    })
                }
            }
        });
    }

    componentWillReceiveProps(newProps) {
        if (!_.isEqual(this.props.user, newProps.user)) {
            this.props.getUser()
        } else if (!_.isEqual(this.props, newProps)) {
            if (this.props.user.id != newProps.match.params.id) {
                this.props.history.push(`/profile/${this.props.user.id}`);
            } else {
                axios.get(`/api/projects/user/${this.props.user.id}`).then(res => {
                    this.setState({
                        projects: res.data,
                        loading: false
                    })
                })
                axios.get(`/api/stats/${this.props.match.params.id}`).then(res => {
                    this.setState({
                        userInfo: Object.assign({}, this.state.userInfo, res.data)
                    })
                })
            }
        } 
        
    }


    modalClick() {
        this.setState({
            modalActive: !this.state.modalActive
        })
    }

    render() {

        var { first_name, last_name, user_name, description, artist_type, image, id } = this.props.user;
        let imageAdded = false;
        const projects = this.state.projects.map((el, idx) => {
            let { name, type, description, image, id, collab_id } = el;
            return (
                <ProfileProjectThumbnail name={name}
                    type={type}
                    description={description}
                    image={image}
                    id={id}
                    position={collab_id === this.props.user.id ? 'Collaborator' : 'Creator'}
                />
            )
        })

        let { project_count, connection_count, review_count } = this.state.userInfo

        return (

            <div>
                <Header userid={this.props.user.id} />
                {
                    this.state.loading ?
                        <div className='profile-loading'></div>
                        :
                        <div>

                            <div className='profile-submenu'>

                                <Link to={`/profile/${this.props.user.id || 1}`}>PROFILE HOME</Link>
                                <Link to={`/profile/${this.props.user.id || 1}/reviews`}>REVIEWS</Link>
                                <Link to={`/profile/${this.props.user.id || 1}/connections`}>CONNECTIONS</Link>
                                <Link to={`/profile/${this.props.user.id}/requests`}>REQUESTS</Link>
                            </div>
                            <div className='profile'>
                                <div className='profile-user-content'>
                                    <div className='profile-user-image' style={{ backgroundImage: `url('${image}')` }}>

                                    </div>

                                    <div className='profile-description'>
                                        <h2>{first_name || 'first'} {last_name || 'last'}</h2>
                                        <h2>{artist_type === 'Both' ? 'Filmmaker/Musician' : artist_type || 'specialty'}</h2>
                                        <p>{description || 'description description description description etc.'}</p>
                                        <button onClick={this.modalClick}>Edit Info</button>
                                    </div>
                                    <div className='profile-stats'>
                                        <div>
                                            {this.state.userInfo.project_count} {project_count === "1" ? 'Project' : 'Projects'}
                                        </div>
                                        <div>
                                            {this.state.userInfo.review_count} {review_count === "1" ? 'Review' : 'Reviews'}
                                        </div>
                                        <div>
                                            {this.state.userInfo.connection_count} {connection_count === "1" ? 'Connection' : 'Connections'}
                                        </div>
                                    </div>
                                </div>
                                <ModalContainer toggleModal={this.modalClick}
                                    active={this.state.modalActive}
                                    info='edit' />
                            </div>
                            <Switch>
                                <Route exact path='/profile/:id' render={() =>
                                    <Portfolio user={this.props.user} type='profile' user_projects={projects} />} />
                                <Route path='/profile/:id/reviews' component={Reviews} />
                                <Route path='/profile/:id/connections' component={Connections} />
                                <Route path='/profile/:id/requests' component={Requests} />
                            </Switch>
                        </div>
                }

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


