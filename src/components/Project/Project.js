import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import Bid from '../Bid/Bid';
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
        this.chooseBid = this.chooseBid.bind(this);

        this.getTimeRemaining = this.getTimeRemaining.bind(this);
    }

    componentDidMount() {

        const project_id = this.props.match.params.id;
        axios.get(`/api/projects/${project_id}`).then(res => {
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

    chooseBid(project_id, bidder_id) {
        console.log('I got clicked: ', project_id, bidder_id);
        // I want to update my project status to 'collab' and update collab_id to bidder_id
        axios.put(`/api/projects/collab/${project_id}`, { bidder_id }).then(res => {
            this.props.history.push(`/collab/${project_id}`);
        })
    }

    getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    render() {
        console.log(this.state.project);
        let { name, type, price, description,
            image, status, user_id, user_name,
            first_name, last_name, artist_type,
            bidding_deadline, project_deadline } = this.state.project;
        let days, hours, minutes;
        if (bidding_deadline) {
            bidding_deadline = bidding_deadline.split('T')[0]
            let countdown = this.getTimeRemaining(bidding_deadline);
            days = countdown.days;
            hours = countdown.hours;
            minutes = countdown.minutes;
        }
        if (project_deadline) {
            project_deadline = project_deadline.split('T')[0]
        }
        const bids = this.state.project.bids.map((el, idx) => {
            let { first_name, last_name, image, votes, bidder_id, project_id } = el;
            return (
                <Bid image={image}
                    first_name={first_name}
                    last_name={last_name}
                    votes={votes}
                    bidder_id={bidder_id}
                    user_id={user_id}
                    project_id={project_id}
                    chooseBid={this.chooseBid} />
            )
        })
        let bid_placed = false;
        let bid_index = this.state.project.bids.findIndex(bid => {
            return bid.bidder_id === this.props.user.id
        })
        if (bid_index !== -1) {
            bid_placed = true;
        }
        return (
            <div>
                <Header userid={this.props.user.id} />
                <div>
                    <Link to={this.props.user.id === user_id ? `/profile/${user_id}` : `/user/${user_id}`}>
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
                    {
                        status === 'completed' ?
                            null
                            :
                            <div>
                                <h3>Bidding Deadline: {bidding_deadline}</h3>
                                {
                                    bidding_deadline ? (
                                        days > 1 ?
                                            <h3>Days remaining: {days}</h3>
                                            :
                                            hours > 1 ?
                                                <h3>Hours remaining: {hours}</h3>
                                                :
                                                <h3>Minutes remaining: {minutes}</h3>
                                    )
                                        :
                                        null
                                }

                                <h3>Project Deadline: {project_deadline}</h3>
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
                                <div>
                                    <h1>BIDS</h1>
                                    {bids}
                                </div>
                            </div>
                    }

                </div>

                <ModalContainer toggleModal={this.modalClick}
                    active={this.state.modalActive}
                    info='project'
                    update={this.updateProject}
                    project={this.state.project} />
                <ModalContainer toggleModal={this.deleteClick}
                    active={this.state.deleteActive}
                    info='delete'
                    update={this.deleteProject}
                    project={this.state.project} />

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