import React, { Component } from 'react';
import './Requests.css';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import axios from 'axios';
import { getUser } from '../../ducks/users';

class Requests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: []
        }

        this.addConnection = this.addConnection.bind(this);
    }

    componentDidMount() {
        axios.get('/api/connections/pending').then(res => {
            this.setState({
                requests: res.data
            })
        })
    }

    addConnection(id, connection_id) {
        let userid = this.props.user.id;
        axios.post('/api/connections', { userid, id, connection_id }).then(res => {
            this.setState({
                requests: res.data
            })
        })
    }

    render() {
        console.log(this.state.requests);
        const requests = this.state.requests.map((el, idx) => {
            let { first_name, last_name, image, user_id, connection_id } = el;
            return (
                <div>
                    <img src={image} alt={first_name} />
                    <h1>{first_name} {last_name}</h1>
                    <button onClick={this.addConnection(user_id, connection_id)}>Add Connection</button>
                </div>
            )
        })
        return (
            <div>
                <Header />
                <h1>Requests</h1>
                { requests }
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