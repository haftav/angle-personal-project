import React, { Component } from 'react';
import Infinite from 'react-infinite';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ProjectThumbnail from '../ProjectThumbnail/ProjectThumbnail';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import InfiniteAnyHeight from 'react-infinite-any-height';
import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            articles: [],
            connections: [],
            statusOption: 'all',
            typeOption: 'all',
            loading: true,
            feedLoading: false,
            userInfo: {}
        }

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.toggleFeedLoading = this.toggleFeedLoading.bind(this);
        this.getRandomArrayElements = this.getRandomArrayElements.bind(this);
    }

    componentDidMount() {
        this.props.getUser().then(res => {
            if (!res.value) {
                this.props.history.push('/')
            } else {
                axios.get('/api/projects').then(res => {
                    this.setState({
                        projects: res.data,
                        loading: false
                    })
                })
                axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=${process.env.REACT_APP_NEWS_TOKEN}`).then(res => {
                    let articles = res.data.articles.slice(0, 5);
                    this.setState({
                        articles: articles
                    })
                })
            }
        });
    }

    toggleFeedLoading() {
        this.setState({
            feedLoading: true
        })
    }

    componentWillReceiveProps(newProps) {
        axios.get(`/api/connections/user/${newProps.user.id}`).then(res => {
            this.setState({
                connections: res.data
            })
        })
        axios.get(`/api/stats/${newProps.user.id}`).then(res => {
            this.setState({
                userInfo: Object.assign({}, this.state.userInfo, res.data)
            })
        })
    }

    handleStatusChange(val) {
        this.toggleFeedLoading();
        axios.get(`/api/projects?status=${val}&type=${this.state.typeOption}`).then(res => {
            this.setState({
                projects: res.data,
                statusOption: val,
                feedLoading: false
            })
        })
    }

    handleTypeChange(val) {
        this.toggleFeedLoading();
        axios.get(`/api/projects?status=${this.state.statusOption}&type=${val}`).then(res => {
            this.setState({
                projects: res.data,
                typeOption: val,
                feedLoading: false
            })
        })
    }

    getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }


    render() {
        console.log(this.state.projects);
        const projects = this.state.projects.map((el, idx) => {
            const { name, type, description,
                price, image, id, first_name,
                last_name, user_image, user_id,
                bidding_deadline, status, bid_count } = el;
            if (status === 'completed') {
                return (
                    <Link to={`/project/${id}`}
                        style={{height: "175px"}}>
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
                            bid_count={bid_count}
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

        let connections = this.state.connections.map((el, idx) => {
            let imageAdded = false;
            let { first_name, last_name, image, user_id } = el
            if (/https:\/\/res.cloudinary.com\//.test(image)) {
                image = image.split('/')[7];
                imageAdded = true;
            }
            return (
                <Link className='dashboard-connection-link' to={`/user/${user_id}`}>
                    {
                        imageAdded ?
                            <Image publicId={image}
                                cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                title={first_name + " " + last_name}>
                                <Transformation width="40" height="40" crop="fill" />
                            </Image>
                            :
                            <img src={image} alt="" title={first_name + " " + last_name} />
                    }
                </Link>
            )
        })

        if (connections.length > 9) {
            connections = this.getRandomArrayElements(connections, 9);
        }

        let { first_name, last_name, image, artist_type } = this.props.user;
        let { review_count, project_count, connection_count } = this.state.userInfo;
        let imageAdded = false;

        if (/https:\/\/res.cloudinary.com\//.test(image)) {
            image = image.split('/')[7];
            imageAdded = true;
        }

        return (

            <div>
                <Header userid={this.props.user.id} />
                {
                    this.state.loading ?
                        <div className='loading-animation'></div>
                        :
                        <div className='dashboard-all'>

                            <div className='dashboard-top'>
                                <div className='dashboard-top-left'>

                                </div>
                                <div className='dashboard-top-middle'>
                                    <h1>Welcome Back, {this.props.user.first_name || 'Tav'}!</h1>
                                    <div className='filter-buttons'>
                                        <p>Project Status</p>
                                        <input type='radio'
                                            name='status'
                                            id='statusChoice1'
                                            value='all'
                                            checked={this.state.statusOption === 'all'}
                                            onChange={(e) => this.handleStatusChange(e.target.value)} />
                                        <label htmlFor='statusChoice1'><span className='radio'>All</span></label>
                                        <input type='radio'
                                            name='status'
                                            id='statusChoice2'
                                            value='pending'
                                            checked={this.state.statusOption === 'pending'}
                                            onChange={(e) => this.handleStatusChange(e.target.value)} />
                                        <label htmlFor='statusChoice2'><span className='radio'>Bidding Open</span></label>
                                        <input type='radio'
                                            name='status'
                                            id='statusChoice3'
                                            value='completed'
                                            checked={this.state.statusOption === 'completed'}
                                            onChange={(e) => this.handleStatusChange(e.target.value)} />
                                        <label htmlFor='statusChoice3'><span className='radio'>Completed</span></label>
                                        <p>Type</p>
                                        <select id='typeChoice' onChange={(e) => this.handleTypeChange(e.target.value)}>
                                            <option value='all'>All</option>
                                            <option value='Filmmaker'>Film</option>
                                            <option value='Musician'>Music</option>
                                        </select>
                                    </div>

                                </div>

                                {/* 
                                <Link className='create-button' to='/create'>
                                    <button>+ START PROJECT</button>
                                </Link> */}
                                <div className='create-button'>

                                </div>
                            </div>
                            <div className={this.state.loading ? '' : 'dashboard-top-image'}>
                                <div>
                                    {
                                        imageAdded ?
                                            <Image publicId={image}
                                                cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}>
                                                <Transformation width="80" height="80" crop="fill" />
                                            </Image>
                                            :
                                            <img src={this.props.user.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} alt="" />
                                    }
                                    <div>
                                        <h1>{first_name || "Tav"} {last_name || "Hafner"}</h1>
                                        <p>{artist_type === 'Both' ? 'Filmmaker/Musician' : artist_type || "Filmmaker"}</p>
                                    </div>
                                </div>
                                <div className='dashboard-user-stats'>
                                    <Link to={`/profile/${this.props.user.id}`}><p>{project_count} {project_count === "1" ? 'Project' : 'Projects'}</p></Link>
                                    <Link to={`/profile/${this.props.user.id}/connections`}><p>{connection_count} {connection_count === "1" ? 'Connection' : 'Connections'}</p></Link>
                                    <Link to={`/profile/${this.props.user.id}/reviews`}><p>{review_count} {review_count === "1" ? 'Review' : 'Reviews'}</p></Link>
                                </div>
                            </div>
                            <div className='dashboard'>
                                <div className='dashboard-feed'>
                                    {
                                        this.state.feedLoading ?
                                            <div className='feed-loading-animation'></div>
                                            :
                                            <div className='dashboard-links'>
                                                {projects}
                                            </div>

                                    }
                                </div>
                                <div className='dashboard-network'>
                                    <h3>NETWORK</h3>
                                    <hr />
                                    <div className='dashboard-network-connections'>
                                        <div className='dashboard-network-connections-container'>
                                            {connections}
                                        </div>
                                    </div>
                                    <h3>RECENT HEADLINES</h3>
                                    <hr />
                                    {articles}
                                </div>
                            </div>
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

export default connect(mapStateToProps, actions)(Dashboard);