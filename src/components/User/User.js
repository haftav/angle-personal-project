import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './User.css';
import ProfileProjectThumbnail from '../ProfileProjectThumbnail/ProfileProjectThumbnail';
import Portfolio from '../Portfolio/Portfolio';
import Connections from '../Connections/Connections';
import Reviews from '../Reviews/Reviews';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            user: {},
            connection_status: '',
            request_status: '',
            connections: []
        }

        this.getInfo = this.getInfo.bind(this);
        this.addConnection = this.addConnection.bind(this);
        this.addFriend = this.addFriend.bind(this);
    }

    getInfo(id) {

        axios.get(`/api/user/${id}`).then(res => {
            this.setState({
                user: res.data
            })
        })
        axios.get(`/api/projects/user/${id}`).then(res => {
            this.setState({
                projects: res.data
            })
        })
        axios.get(`/api/connections/user/${id}`).then(res => {
            this.setState({
                connections: res.data
            })
        })

        axios.get(`/api/connections/status/to/${id}`).then(res => {
            if (res.data) {
                this.setState({
                    connection_status: res.data.status
                })
            } else {
                this.setState({
                    connection_status: ''
                })
            }
        })

        axios.get(`/api/connections/status/from/${id}`).then(res => {
            if (res.data.status === 'pending') {
                console.log('requesting');
                this.setState({
                    request_status: 'requesting'
                })
            } else {
                this.setState({
                    request_status: ''
                })
            }
        })
    }

    componentDidMount() {
        this.getInfo(this.props.match.params.id)
    }

    componentWillReceiveProps(newProps) {
        this.getInfo(newProps.match.params.id);
    }

    addConnection() {
        let friend_id_1 = this.props.user.id;
        let friend_id_2 = this.props.match.params.id;
        axios.post('/api/connections/pending', { friend_id_1, friend_id_2 }).then(res => {
            this.setState({
                connection_status: res.data.status
            })
        })
    }

    addFriend() {
        let userid = this.props.user.id;
        let id = this.props.match.params.id;
        axios.post('/api/connections/user/accepted', { userid, id }).then(res => {
            this.setState({
                connection_status: res.data.status,
                request_status: ''
            })
        })
    }

    render() {
        console.log('connection: ', this.state.connection_status);
        console.log('request', this.state.request_status);
        const connections = this.state.connections.map((el, idx) => {
            let { first_name, last_name, image, user_id } = el
            return (
                <Link to={user_id === this.props.user.id ? '/profile' : `/user/${user_id}`}>
                    <h1>{first_name} {last_name}</h1>
                </Link>
            )
        })

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
                <div className='profile-submenu'>
                    <Link to={`/user/${this.props.match.params.id}`}>Profile</Link>
                    <Link to={`/user/reviews/${this.props.match.params.id}`}>Reviews</Link>
                    <Link to={`/user/connections/${this.props.match.params.id}`}>Connections</Link>
                </div>
                {this.state.request_status === 'requesting' ?
                    <div>
                        <p>
                            {first_name} has requested to connect.
                        </p>
                        <button onClick={this.addFriend}>Connect</button>
                    </div>
                    :
                    !this.state.connection_status ? <button onClick={this.addConnection}>ADD CONNECTION</button> :
                        this.state.connection_status === 'pending' ? <p>Connection Pending</p> :
                            <p>Connected!</p>
                }
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
                    </div>
                </div>
                <Switch>
                    <Route exact path='/user/:id' component={Portfolio} />
                    <Route path='/user/reviews/:id' component={Reviews} />
                    <Route path='/user/connections/:id' component={Connections} />
                </Switch>

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