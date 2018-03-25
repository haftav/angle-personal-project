import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import _ from 'underscore';
import '../Bid/Bid.css';
import '../Connections/Connections.css';

class Connections extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connections: [],
            loading: true
        }
    }

    componentDidMount() {
        this.props.getUser();
        axios.get(`/api/connections/user/${this.props.match.params.id}`).then(res => {
            this.setState({
                connections: res.data,
                loading: false
            })
        })
    }

    componentWillReceiveProps(newProps) {
        if (!_.isEqual(this.props, newProps)) {
            axios.get(`/api/connections/user/${newProps.match.params.id}`).then(res => {
                this.setState({
                    connections: res.data,
                })
            })
        }
    }


    render() {
        console.log(this.props);
        const connections = this.state.connections.map((el, idx) => {
            let { first_name, last_name, image, user_id, artist_type } = el
            return (
                <Link className='connection' to={user_id === this.props.user.id ? `/profile/${this.props.user.id}` : `/user/${user_id}`}>
                    <div className='connection-image' style={{ backgroundImage: `url(${image})` }}>

                    </div>
                    <div className='connection-info'>
                        <h1>{first_name} {last_name}</h1>
                        <p>{artist_type === 'Both' ? 'Filmmaker/Musician' : artist_type}</p>
                    </div>
                </Link>
            )
        })
        return (
            <div className='portfolio'>
                <h1>CONNECTIONS</h1>
                {
                    this.state.loading ?
                        <div className='connections-loading'></div>
                        :
                        <div className='connections-container'>
                            {
                                connections.length > 0 ?
                                    connections
                                    :
                                    <h1>No connections to display.</h1>
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

export default connect(mapStateToProps, actions)(Connections)