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
            project: {
                bids: []
            },
            modalActive: false,
            deleteActive: false
        }

        this.modalClick = this.modalClick.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.addBid = this.addBid.bind(this);
        this.removeBid = this.removeBid.bind(this);
    }

    componentDidMount() {

        const project_id = this.props.match.params.id;
        axios.get(`/api/projects/${project_id}`).then(res => {
            console.log('DATA: ', res.data);
            this.setState({
                project: res.data
            })
        })
        // axios.get(`/api/bids/${project_id}`).then(res => {
        //     this.setState({
        //         bids: res.data,
        //     })
        // })
        // axios.get(`/api/bids/check/${project_id}`).then(res => {
        //     console.log(res.data);
        //     this.setState({
        //         bid_placed: res.data
        //     })
        // })
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
        axios.put(`/api/projects/${this.state.project.id}`, project).then(res => {
            this.setState({
                project: res.data
            })
        })
    }

    deleteProject(project) {
        axios.delete(`/api/projects/${project.id}`).then(res => {
            this.props.history.push('/dashboard');
        })
    }

    addBid() {
        const project_id = this.state.project.id
        const bidder_id = this.props.user.id;
        axios.post('/api/bids/add', { project_id, bidder_id }).then(res => {
            //get back all bids associated with project
            let bids = res.data;
            this.setState({
                project: Object.assign({}, this.state.project, { bids: bids })
            })
        })
    }

    removeBid() {
        const project_id = this.props.match.params.id;
        axios.delete(`/api/bids/${project_id}`).then(res => {
            let bids = res.data;
            this.setState({
                project: Object.assign({}, this.state.project, { bids: bids })
            })
        })
    }

    render() {
        console.log(this.state.project);
        const { name, type, price, description,
            image, status, user_id, user_name,
            first_name, last_name, artist_type} = this.state.project;
        const bids = this.state.project.bids.map((el, idx) => {
            let {first_name, last_name, image, votes} = el;
            return (
                <div>
                    <img src={image} alt={first_name} />
                    <h2>{first_name} {last_name}</h2>
                    <h3>Votes: {votes}</h3>

                </div>
            )
        })
        console.log('bids: ', bids)
        let bid_placed = false;
        let bid_index = this.state.project.bids.findIndex(bid =>  {
            return bid.bidder_id === this.props.user.id
        })
        if (bid_index !== -1) {
            bid_placed = true;
        }
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
                    : bid_placed ? 
                    <button onClick={this.removeBid}>Remove Bid</button>
                    :
                    <button onClick={this.addBid}>Add Bid</button> 
                    }
                </div>
                <div>
                    <h1>BIDS</h1>
                    {bids}
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