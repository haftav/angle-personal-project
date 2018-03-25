import React, { Component } from 'react';
import './Requests.css';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import axios from 'axios';
import { getUser } from '../../ducks/users';
import { request } from 'http';
import { Link } from 'react-router-dom'

class Requests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: [],
            loading: true
        }

        this.addConnection = this.addConnection.bind(this);
    }

    componentDidMount() {
        axios.get('/api/connections/pending').then(res => {
            this.setState({
                requests: res.data,
                loading: false
            })
        })
    }

    addConnection(id, connection_id) {
        let userid = this.props.user.id;
        axios.post('/api/connections/accepted', { userid, id, connection_id }).then(res => {
            this.setState({
                requests: res.data,
            })
        })
    }

    render() {
        console.log(this.state.requests);
        const requests = this.state.requests.map((el, idx) => {
            let { first_name, last_name, image, user_id, connection_id } = el;
            return (
                <div className='request'>

                    <div className='request-image' style={{ backgroundImage: `url(${image})` }}>

                    </div>
                    <div className='request-info'>
                        <Link to={user_id === this.props.user.id ? `/profile/${this.props.user.id}` : `/user/${user_id}`}>
                            <h1>{first_name} {last_name}</h1>
                        </Link>
                        <button onClick={() => this.addConnection(user_id, connection_id)}>Add Connection</button>
                    </div>
                </div>
            )
        })
        return (
            <div className='portfolio'>
                <h1>Requests</h1>
                {
                    this.state.loading ?
                        <div className='requests-loading'></div>
                        :
                        <div className='requests-container'>
                            {
                                requests[0] ?
                                    requests
                                    :
                                    <h1>You have no requests at this time.</h1>
                            }
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

export default connect(mapStateToProps, actions)(Requests);