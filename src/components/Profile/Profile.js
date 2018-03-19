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
            projects: []
        }

        this.modalClick = this.modalClick.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
        console.log('userid: ', this.props.user.id)
        axios.get(`/api/projects/user/${this.props.user.id}`).then(res => {
            this.setState({
                projects: res.data
            })
        })

    }

    componentWillReceiveProps(newProps) {

        if (!_.isEqual(this.props.user, newProps.user)) {
            this.props.getUser();
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

        if (/https:\/\/res.cloudinary.com\//.test(image)) {
            image = image.split('/')[7];
            imageAdded = true;
        }

        return (
            <div>
                <Header userid={this.props.user.id} />
                <div className='profile-submenu'>
                    <Link to={`/profile/${this.props.user.id || 1}`}>Profile</Link>
                    <Link to={`/profile/${this.props.user.id || 1}/reviews`}>Reviews</Link>
                    <Link to={`/profile/${this.props.user.id || 1}/connections`}>Connections</Link>
                    <Link to={`/profile/${this.props.user.id}/requests`}>Requests</Link>
                </div>
                <div className='profile'>
                    <div className='profile-user-content'>
                        {
                            imageAdded
                                ?
                                <Image publicId={image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                    className='profile-image'>
                                    <Transformation width="280" height="150" crop="fill" />
                                </Image>
                                :
                                <img src={image}
                                    alt={`user/${id}`}
                                    className='profile-image' />
                        }

                        <div className='profile-description'>
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
                </div>
                <Switch>
                    <Route exact path='/profile/:id' render={() =>
                        <Portfolio user={this.props.user} type='profile' user_projects={projects} />} />
                    <Route path='/profile/:id/reviews' component={Reviews} />
                    <Route path='/profile/:id/connections' component={Connections} />
                    <Route path='/profile/:id/requests' component={Requests} />
                </Switch>
                <ModalContainer toggleModal={this.modalClick}
                    active={this.state.modalActive}
                    info='edit' />
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