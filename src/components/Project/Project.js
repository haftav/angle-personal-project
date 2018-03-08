import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import { Link } from 'react-router-dom';

class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {},
            modalActive: false,
            deleteActive: false
        }

        this.modalClick = this.modalClick.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/projects/${this.props.match.params.id}`).then(res => {
            this.setState({
                project: res.data
            })
        })
    }

    modalClick() {
        this.setState({
            modalActive: !this.state.modalActive
        })
    }

    deleteClick() {
        this.setState({
            deleteActive: !this.state.deleteActive
        })
    }

    updateProject(project) {
        console.log(this.state.project.id)
        axios.put(`/api/projects/${this.state.project.id}`, project).then(res => {
            this.setState({
                project: res.data
            })
        })
    }

    deleteProject(project) {
        console.log('id: ', project.id)
        axios.delete(`/api/projects/${project.id}`).then(res => {
            this.props.history.push('/dashboard');
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
                    <Link to={this.props.user.id === user_id ? '/profile' : `/user/${user_id}`}>
                        <h2>{first_name}</h2>
                        <h2>{last_name}</h2>
                    </Link>
                    <h2>{artist_type}</h2>
                </div>
                <div>
                    <h1>{name}</h1>
                    <h2>{type}</h2>
                    <p>{description}</p>
                    <h2>{price}</h2>
                    <img src={image} alt="project-image" />
                    <h3>{status}</h3>
                    {this.props.user.id === user_id 
                    ? 
                    <div>
                        <button onClick={this.modalClick}>Edit</button> 
                        <button onClick={this.deleteClick}>Delete</button>
                    </div>               
                    : null }
                </div>
                <ModalContainer toggleModal={this.modalClick}
                    active={this.state.modalActive}
                    info='project' 
                    update={this.updateProject}
                    project={this.state.project}/>
                <ModalContainer toggleModal={this.deleteClick}
                    active={this.state.deleteActive}
                    info='delete'
                    update={this.deleteProject} 
                    project={this.state.project}/>

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