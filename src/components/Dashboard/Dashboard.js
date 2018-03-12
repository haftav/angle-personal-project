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
                last_name, user_image, user_id, bidding_deadline } = el;
            return (
                <Link to={`/project/${id}`}>
                    <ProjectThumbnail name={name}
                        type={type}
                        description={description}
                        price={price}
                        image={image}
                        first_name={first_name}
                        last_name={last_name}
                        user_image={user_image}
                        bidding_deadline={bidding_deadline}
                        project_id={id} />
                </Link>
            )
        })
        return (
            <div>
                <Header />
                <div className='dashboard-top'>
                    <img src={this.props.user.image || 'http://cdnak1.psbin.com/img/mw=160/mh=210/cr=n/d=1xms5/zrooq397hijjktlc.jpg'} alt="" />
                    <h1>WELCOME BACK, {this.props.user.first_name || 'TAV'}!</h1>
                    <div className='filter-buttons'>
                        <input type='radio' name='status' id='statusChoice1' value='all'/>
                        <label for='statusChoice1'>All</label>
                        <input type='radio' name='status' id='statusChoice2' value='pending'/>
                        <label for='statusChoice2'>Bidding Open</label>
                        <input type='radio' name='status' id='statusChoice3' value='completed'/>
                        <label for='statusChoice3'>Completed</label>
                    </div>
                    <Link className='create-button' to='/create'>
                        <button>+ START PROJECT</button>
                    </Link>
                </div>
                <div className='dashboard'>
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