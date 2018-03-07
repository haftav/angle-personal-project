import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {}
        }
    }

    componentDidMount() {
        axios.get(`/api/projects/${this.props.match.params.id}`).then(res => {
            this.setState({
                project: res.data
            })
        })
    }

    render() {
        const { name, type, price, description,
            image, status, user_id, user_name,
            first_name, last_name, artist_type } = this.state.project;
        return (
            <div>
                <Header />
                <Link to='/dashboard'><button>Dashboard</button></Link>
                <div>
                    <h1>{user_name}</h1>
                    <h2>{first_name}</h2>
                    <h2>{last_name}</h2>
                    <h2>{artist_type}</h2>
                </div>
                <div>
                    <h1>{name}</h1>
                    <h2>{type}</h2>
                    <p>{description}</p>
                    <h2>{price}</h2>
                    <img src={image} alt="project-image" />
                    <h3>{status}</h3>
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

export default connect(mapStateToProps, actions)(Project);