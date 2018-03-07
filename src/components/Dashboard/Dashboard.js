import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ProjectThumbnail from '../ProjectThumbnail/ProjectThumbnail';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        this.props.getUser();
        axios.get('/api/projects').then(res => {
            console.log(res.data);
            this.setState({
                projects: res.data
            })
        })
    }

    render() {
        const projects = this.state.projects.map((el, idx) => {
            const { name, type, description, 
                    price, image, id, first_name,
                    last_name, user_image, user_id } = el;
            return (
                <Link to={`/project/${id}`}>
                    <ProjectThumbnail name={name}
                        type={type}
                        description={description}
                        price={price}
                        image={image}
                        first_name={first_name}
                        last_name={last_name}
                        user_image={user_image} />
                </Link>
            )
        })
        return (
            <div>
                <Header />
                <Link to='/profile'><button>Profile</button></Link>
                <Link to='/create'><button>START YOUR PROJECT</button></Link>
                <div className='dashboard'>
                    <input placeholder='search' />
                    <div className='dashboard-feed'>
                        {projects}
                    </div>
                    <div className='dashboard-network'>

                    </div>
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

export default connect(mapStateToProps, actions)(Dashboard);