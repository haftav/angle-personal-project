import React, { Component } from 'react';
import Infinite from 'react-infinite';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ProjectThumbnail from '../ProjectThumbnail/ProjectThumbnail';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            articles: [],
            connections: [],
            statusOption: 'all',
            typeOption: 'all'
        }

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
        axios.get('/api/projects').then(res => {
            this.setState({
                projects: res.data
            })
        })
        axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=${process.env.REACT_APP_NEWS_TOKEN}`).then(res => {
            let articles = res.data.articles.slice(0, 5);
            this.setState({
                articles: articles
            })
        })



    }

    componentWillReceiveProps(newProps) {
        axios.get(`/api/connections/user/${newProps.user.id}`).then(res => {
            this.setState({
                connections: res.data
            })
        })
    }

    handleStatusChange(val) {
        axios.get(`/api/projects?status=${val}&type=${this.state.typeOption}`).then(res => {
            this.setState({
                projects: res.data,
                statusOption: val
            })
        })
    }

    handleTypeChange(val) {
        axios.get(`/api/projects?status=${this.state.statusOption}&type=${val}`).then(res => {
            this.setState({
                projects: res.data,
                typeOption: val
            })
        })
    }

    render() {
        const projects = this.state.projects.map((el, idx) => {
            const { name, type, description,
                price, image, id, first_name,
                last_name, user_image, user_id,
                bidding_deadline, status } = el;
            if (status === 'completed') {
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
                            project_id={id}
                            status='completed'
                            collab_first={el.collab_user.first_name}
                            collab_last={el.collab_user.last_name} />
                    </Link>
                )
            } else {
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
                            project_id={id}
                            status='pending' />
                    </Link>
                )
            }
        })

        const articles = this.state.articles.map((el, idx) => {
            let { title, url, urlToImage } = el;
            return (
                <div>
                    <a href={url} target="_blank">
                        <p>{title}</p>
                    </a>
                </div>
            )
        })

        const connections = this.state.connections.map((el, idx) => {
            let { first_name, last_name, image, user_id } = el
            return (
                <Link to={`/user/${user_id}`}>
                    <h1>{first_name} {last_name}</h1>
                </Link>
            )
        })

        let image = this.props.user.image;
        let imageAdded = false;

        if (/https:\/\/res.cloudinary.com\//.test(image)) {
            image = image.split('/')[7];
            imageAdded = true;
        }

        return (
            <div>
                <Header userid={this.props.user.id} />
                <div className='dashboard-all'>

                    <div className='dashboard-top'>
                        {
                            imageAdded ?
                                <Image publicId={image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}>
                                    <Transformation width="100" height="100" crop="fill" />
                                </Image>
                                :
                                <img src={this.props.user.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} alt="" />
                        }
                        <h1>WELCOME BACK, {this.props.user.first_name || 'TAV'}!</h1>
                        <div className='filter-buttons'>
                            <h2>Project Status</h2>
                            <input type='radio'
                                name='status'
                                id='statusChoice1'
                                value='all'
                                checked={this.state.statusOption === 'all'}
                                onChange={(e) => this.handleStatusChange(e.target.value)} />
                            <label htmlFor='statusChoice1'>All</label>
                            <input type='radio'
                                name='status'
                                id='statusChoice2'
                                value='pending'
                                checked={this.state.statusOption === 'pending'}
                                onChange={(e) => this.handleStatusChange(e.target.value)} />
                            <label htmlFor='statusChoice2'>Bidding Open</label>
                            <input type='radio'
                                name='status'
                                id='statusChoice3'
                                value='completed'
                                checked={this.state.statusOption === 'completed'}
                                onChange={(e) => this.handleStatusChange(e.target.value)} />
                            <label htmlFor='statusChoice3'>Completed</label>
                            <h2>Type</h2>
                            <select id='typeChoice' onChange={(e) => this.handleTypeChange(e.target.value)}>
                                <option value='all'>All</option>
                                <option value='Filmmaker'>Film</option>
                                <option value='Musician'>Music</option>
                            </select>
                        </div>

                        <Link className='create-button' to='/create'>
                            <button>+ START PROJECT</button>
                        </Link>
                    </div>
                    <div className='dashboard'>
                        <div className='dashboard-feed'>
                            <Infinite elementHeight={220}
                                containerHeight={700}>
                            {projects}
                            </Infinite>
                        </div>
                        <div className='dashboard-network'>
                            {connections}
                            <hr />
                            {articles}
                        </div>
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