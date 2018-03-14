import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../ducks/users';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';

class ProjectsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        axios.get('/api/collabs').then(res => {
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
                last_name, user_image, user_id, status } = el;
            if (status === 'pending') {
                return (
                    <Link className='projects-project-thumbnail' to={`/project/${id}`}>
                        <h1>{name}</h1>
                        <h1>You opened this project for bidding.</h1>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ" alt={name} />
                    </Link>
                )
            } else if (status === 'collab') {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You are collaborating on this project with {first_name} {last_name}.</h1>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ" alt={name} />
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>{first_name} {last_name} is collaborating on this project with you.</h1>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ" alt={name} />
                        </Link>
                    )
                }
            }
            else {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You completed this project with {first_name} {last_name}.</h1>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ" alt={name} />
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You helped {first_name} {last_name} complete this project.</h1>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ" alt={name} />
                        </Link>
                    )
                }
            }
        })
        return (
            <div>
                <Header userid={this.props.match.params.id} />
                <h1>User Projects</h1>
                {projects}
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