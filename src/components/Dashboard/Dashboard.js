import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        axios.get('/api/user').then(res => {
            console.log(res.data);
        })
    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <Link to="/profile"><button>Profile</button></Link>
            </div>
        )
    }
}