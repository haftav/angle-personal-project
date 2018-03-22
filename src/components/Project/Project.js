import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';
import Header from '../Header/Header';
import ModalContainer from '../ModalContainer/ModalContainer';
import Bid from '../Bid/Bid';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './Project.css';

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
        let bids = this.state.project.bids;
        if (project.image_data instanceof FormData) {
            axios.post(process.env.REACT_APP_CLOUDINARY_URL, project.image_data, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            }).then(res1 => {
                const data = res1.data;
                let image = data.secure_url;
                project.image = image;
                axios.put(`/api/projects/${this.state.project.id}`, project).then(res2 => {
                    console.log(res2.data);
                    this.setState({
                        project: Object.assign({}, res2.data, { bids: bids })
                    })
                })
            })
        } else {
            axios.put(`/api/projects/${this.state.project.id}`, project).then(res => {
                this.setState({
                    project: Object.assign({}, res.data, { bids: bids })
                })
            })
        }
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
        console.log(endtime);
        let end = new Date(endtime.replace(/-/g, '\/'));
        let newDate = new Date()
        var t = Date.parse(end) - Date.parse(newDate);
        console.log(t);
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
            bidding_deadline, project_deadline, finished_url } = this.state.project;
        if (price) {
            price = price.substr(1)
        }
        let time, days, hours, minutes;
        if (bidding_deadline) {
            bidding_deadline = bidding_deadline.split('T')[0]
            let countdown = this.getTimeRemaining(bidding_deadline);
            time = countdown.total;
            days = countdown.days;
            hours = countdown.hours;
            minutes = countdown.minutes;
            console.log('days: ', days, 'hours: ', hours, 'minutes: ', minutes, 'time: ', time)
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
                <div className='project'>
                    <div className='project-image' style={{ backgroundImage: `url('${image}')` }}>

                    </div>
                    <h1 className='project-name'>{name}</h1>
                    <div className='project-creator'>
                        <h1>
                            <span>
                                <Link to={this.props.user.id === user_id ? `/profile/${user_id}` : `/user/${user_id}`}>
                                    {first_name} {last_name}
                                </Link>
                                &nbsp;is looking for a {type}.
                        </span>
                        </h1>
                    </div>
                    {status === 'completed' ?
                        null
                        :
                        time > 0 ?
                            bidding_deadline ? (
                                days >= 1 ?
                                    <div className='project-deadline'>
                                        <h3><span><i className="fa fa-calendar project-calendar-icon"></i></span> {days} {days === 1 ? 'DAY' : 'DAYS'} REMAINING</h3>
                                        <h3>Bidding Deadline: {bidding_deadline}</h3>
                                    </div>
                                    :
                                    hours >= 1 ?
                                        <div className='project-deadline'>
                                            <i className="fa fa-calendar project-calendar-icon"></i>
                                            <h3>{hours} {hours === 1 ? 'HOUR' : 'HOURS'} REMAINING</h3>
                                            <h3>Bidding Deadline: {bidding_deadline}</h3>
                                        </div>
                                        :
                                        <div className='project-deadline'>
                                            <i className="fa fa-calendar project-calendar-icon"></i>
                                            <h3>{minutes} {minutes === 1 ? 'MINUTE' : 'MINUTES'} REMAINING</h3>
                                            <h3>Bidding Deadline: {bidding_deadline}</h3>
                                        </div>
                            )
                                :
                                null
                            :
                            <div className='project-deadline'>
                                <h3>BIDDING CLOSED</h3>
                            </div>
                    }
                    <div className='project-description'>
                        <p >{description}</p>
                    </div>
                    {
                        status === 'completed' ?
                            null :
                            <div className='project-price'>
                                <h2><i class="fa fa-usd project-dollar-icon"></i> {price}</h2>
                            </div>
                    }
                    {
                        status === 'completed' ?
                            null
                            :
                            time > 0 ?
                                <h3 className='project-end-deadline'>Project Deadline: {project_deadline}</h3>
                                :
                                null
                    }
                    {
                        status === 'completed' ?
                            <div className='project-complete'>
                                <h1>Finished Project</h1>
                                <ReactPlayer url={finished_url}
                                    className='project-complete-media'
                                    playing={false}
                                    width='500px'
                                    height='300px' />
                            </div>
                            :
                            <div>
                                {this.props.user.id === user_id
                                    ?
                                    <div>
                                        <button className='project-button' onClick={this.modalClick}>Edit</button>
                                        <button className='project-button' onClick={this.deleteClick}>Delete</button>
                                    </div>
                                    : time > 0 ?
                                        bid_placed ?
                                            <button className='project-button' onClick={this.removeBid}>Remove Bid</button>
                                            :
                                            <button className='project-button' onClick={this.addBid}>Add Bid</button>
                                        :
                                        null
                                }

                            </div>
                    }
                    {
                        status === 'completed' ?
                            null
                            :
                            <div className='project-bids'>
                                <h1>BIDS</h1>
                                {bids}
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