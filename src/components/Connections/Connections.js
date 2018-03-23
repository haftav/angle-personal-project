import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import _ from 'underscore';

class Connections extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connections: []
        }
    }

    componentDidMount() {
        this.props.getUser();
        axios.get(`/api/connections/user/${this.props.match.params.id}`).then(res => {
            this.setState({
                connections: res.data
            })
        })
    }

    componentWillReceiveProps(newProps) {
        if (!_.isEqual(this.props, newProps)) {
            axios.get(`/api/connections/user/${newProps.match.params.id}`).then(res => {
                this.setState({
                    connections: res.data
                })
            }) 
        }
    }


    render() {
        console.log(this.props);
        const connections = this.state.connections.map((el, idx) => {
            let { first_name, last_name, image, user_id } = el
            return (
                <Link to={user_id === this.props.user.id ? `/profile/${this.props.user.id}` : `/user/${user_id}`}>
                    <h1>{first_name} {last_name}</h1>
                </Link>
            )
        })
        return (
            <div>
                <h1>Connections</h1>
                { connections }
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