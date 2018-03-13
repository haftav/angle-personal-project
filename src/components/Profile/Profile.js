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

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            projects: [],
            connections: []
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

        axios.get(`/api/connections/user/${this.props.user.id}`).then(res => {
            this.setState({
                connections: res.data
            })
        })

    }


    modalClick() {
        this.setState({
            modalActive: !this.state.modalActive
        })
    }

    render() {
        const connections = this.state.connections.map((el, idx) => {
            let { first_name, last_name, image, user_id } = el
            return (
                <Link to={`/user/${user_id}`}>
                    <h1>{first_name} {last_name}</h1>
                </Link>
            )
        })
        const { first_name, last_name, user_name, description, artist_type, image, id } = this.props.user;
        const projects = this.state.projects.map((el, idx) => {
            let { name, type, description, image, id } = el;
            return (
                    <ProfileProjectThumbnail name={name}
                        type={type}
                        description={description}
                        image={image}
                        id={id}/>
            )
        })
        return (
            <div>
                <Header userid={this.props.user.id}/>
                <div className='profile-submenu'>
                    <Link to='/profile'>Profile</Link>
                    <Link to={`/profile/reviews/${this.props.user.id || 1}`}>Reviews</Link>
                    <Link to={`/profile/connections/${this.props.user.id || 1}`}>Connections</Link>
                    <Link to='/profile/requests'>Requests</Link>
                </div>
                <div className='profile'>
                    <div className='profile-user-content'>
                        <img src={image}
                            alt={`user/${id}`}
                            className='profile-image' />
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
                    <Route exact path='/profile' component={Portfolio} />
                    <Route path='/profile/reviews/:id' component={Reviews} />
                    <Route path='/profile/connections/:id' component={Connections} />
                    <Route path='/profile/requests' component={Requests} />
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