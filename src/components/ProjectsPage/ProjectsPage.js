import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../ducks/users';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import './ProjectsPage.css';

class ProjectsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            statusOption: 'pending',
            loading: true
        }
    }

    componentDidMount() {
        axios.get(`/api/collabs/?status=${this.state.statusOption}`).then(res => {
            console.log(res.data);
            this.setState({
                projects: res.data,
                loading: false
            })
        })
    }

    handleStatusChange(val) {
        console.log(val);
        // this.toggleFeedLoading();
        axios.get(`/api/collabs/?status=${val}`).then(res => {
            console.log(res.data);
            this.setState({
                projects: res.data,
                statusOption: val
            })
        })
    }

    render() {
        var imageStyles = {
            width: "280px",
            height: "150px",
            background: "lightblue"
        }
        const projects = this.state.projects.map((el, idx) => {
            let { name, type, description,
                price, image, id, first_name,
                last_name, user_image, user_id, status, bidding_deadline, project_deadline } = el;
            let imageAdded = false;
            // if (/https:\/\/res.cloudinary.com\//.test(image)) {
            //     image = image.split('/')[7];
            //     imageAdded = true;
            // }
            if (status === 'pending') {
                return (
                    <Link className='projects-project-thumbnail' to={`/project/${id}`}>
                        <div>
                            <h1>{name}</h1>
                            <p>You opened this project up for bidding.</p>
                        </div>
                        <div style={{ backgroundImage: `url('${image}')` }}>
                            <div class="layer">
                                <p>Bidding Deadline: {bidding_deadline}</p>
                            </div>
                        </div>
                    </Link>
                )
            } else if (status === 'collab') {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <div>
                                <h1>{name}</h1>
                                <p>You are collaborating on this project with {first_name} {last_name}.</p>
                            </div>
                            <div style={{ backgroundImage: `url('${image}')` }}>
                                <div class="layer">
                                    <p>Project Deadline: {project_deadline}</p>
                                </div>
                            </div>
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <div>
                                <h1>{name}</h1>
                                <p>{first_name} {last_name} is collaborating on this project with you.</p>
                            </div>
                            <div style={{ backgroundImage: `url('${image}')` }}>
                                <div class="layer">
                                    <p>Project Deadline: {project_deadline}</p>
                                </div>
                            </div>
                        </Link>
                    )
                }
            }
            else {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/project/${id}`}>
                            <div>
                                <h1>{name}</h1>
                                <p>You completed this project with {first_name} {last_name}.</p>
                            </div>
                            <div style={{ backgroundImage: `url('${image}')` }}>
                                <div class="layer">
                                    <p>Completed!</p>
                                </div>
                            </div>
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/project/${id}`}>
                            <div>
                                <h1>{name}</h1>
                                <p>You helped {first_name} {last_name} complete this project.</p>
                            </div>
                            <div style={{ backgroundImage: `url('${image}')` }}>
                                <div class="layer">
                                    <p>Completed!</p>
                                </div>
                            </div>
                        </Link>
                    )
                }
            }
        })
        return (
            <div>
                <Header userid={this.props.match.params.id} />
                <div className='projects-page'>
                    {
                        this.state.loading ?
                            <h1>Loading</h1>
                            :
                            <div>
                                <h1>Projects</h1>
                                <div className='filter-buttons'>
                                    <p>Project Status</p>
                                    <input type='radio'
                                        name='status'
                                        id='statusChoice1'
                                        value='pending'
                                        checked={this.state.statusOption === 'pending'}
                                        onChange={(e) => this.handleStatusChange(e.target.value)} />
                                    <label htmlFor='statusChoice1'><span className='radio'>Bidding Open</span></label>
                                    <input type='radio'
                                        name='status'
                                        id='statusChoice2'
                                        value='collab'
                                        checked={this.state.statusOption === 'collab'}
                                        onChange={(e) => this.handleStatusChange(e.target.value)} />
                                    <label htmlFor='statusChoice2'><span className='radio'>Collaboration</span></label>
                                    <input type='radio'
                                        name='status'
                                        id='statusChoice3'
                                        value='completed'
                                        checked={this.state.statusOption === 'completed'}
                                        onChange={(e) => this.handleStatusChange(e.target.value)} />
                                    <label htmlFor='statusChoice3'><span className='radio'>Completed</span></label>
                                </div>
                                {projects}
                            </div>
                    }
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

export default connect(mapStateToProps, actions)(ProjectsPage);