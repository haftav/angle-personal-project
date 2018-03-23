import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import date from '../../helper/Date';
import './Collab.css';
import { Link } from 'react-router-dom';

class Collab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                collab_user: {}
            },
            finished_url: '',
            messages: [],
            userID: null,
            scroll: false
        }

        this.completeProject = this.completeProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitProject = this.submitProject.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.setUserId = this.setUserId.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.socket = io('/');
        this.socket.emit('join room', { room: this.props.match.params.id })
        this.socket.on('welcome', this.setUserId)
        this.socket.on('message dispatched', this.updateMessages);
        const project_id = this.props.match.params.id;
        axios.get(`/api/projects/collab/${project_id}`).then(res => {
            console.log(res.data);
            this.setState({
                project: res.data
            })
        })
        axios.get(`/api/messages/${this.props.match.params.id}`).then(res => {
            this.setState({
                messages: res.data,
                scroll: true
            })
        })
    }

    setUserId(user) {
        this.setState(user)
    }

    updateMessages(message) {
        const updateMessages = this.state.messages.slice();
        updateMessages.push(message);
        this.setState({
            messages: updateMessages
        })
        this.scrollToBottom();
    }

    completeProject() {
        const project_id = this.props.match.params.id;
        axios.put(`/api/projects/completed/${project_id}`, {}).then(res => {
            this.props.history.push(`/project/${project_id}`)
        })
    }

    handleChange(val) {
        this.setState({
            finished_url: val
        })
    }

    submitProject() {
        const { finished_url } = this.state;
        axios.put(`/api/projects/submit/${this.props.match.params.id}`, { finished_url }).then(res => {
            console.log(res.data);
            this.setState({
                project: res.data,
                finished_url: ''
            })
        })
    }

    sendMessage() {
        let post_time = date();
        this.socket.emit('message sent', {
            message: this.refs.message.value,
            name: this.props.user.first_name,
            room: this.props.match.params.id,
            post_time: post_time,
            user_id: this.props.user.id,
            user_image: this.props.user.image
        })

        this.refs.message.value = '';
    }

    scrollToBottom() {
        console.log(this.container.scrollTop);
        console.log(this.container.scrollHeight);
        this.container.scrollTop = this.container.scrollHeight;
    }

    render() {
        // this.state.scroll = true ? this.scrollToBottom() : null
        console.log(this.state);
        const { name, description, type, image, user_id,
            first_name, last_name, price, user_image, collab_user,
            finished_url, collab_id, status, project_deadline } = this.state.project;

        const collab_first = collab_user.first_name,
            collab_last = collab_user.last_name,
            collab_image = collab_user.image;

        const messages = this.state.messages.map((el, idx) => {
            const styles = el.user_id === this.props.user.id ?
                { alignSelf: "flex-end", alignItems: "flex-end" }
                :
                { alignSelf: "flex-start", alignItems: "flex-start" };
            return (
                <div className='chat-message' style={styles}>

                    <div className='chat-message-info'
                        style={el.user_id === this.props.user.id ?
                            {

                                flexDirection: "row-reverse"
                            }
                            :
                            {

                                flexDirection: "row"
                            }}>
                        <div className='chat-message-image' style={el.user_id === this.props.user.id ?
                            {
                                backgroundImage: `url('${el.user_image}')`,
                                alignSelf: "flex-end"
                            } :
                            {
                                backgroundImage: `url('${el.user_image}')`,
                                alignSelf: "flex-start"
                            }}>
                        </div>
                        <div className='chat-message-info-text' style={el.user_id === this.props.user.id ?
                            { backgroundColor: "white" } : { backgroundColor: "#F5F5F5" }}>
                            <p>{el.message}</p>
                            <p >{el.name} {el.post_time}</p>
                        </div>
                    </div>
                </div >
            )
        })
        return (
            <div>
                <Header userid={this.props.user.id} />
                <div className='project'>
                    <div style={{ minHeight: "calc(100vh - 55px)" }}>

                        <div className='project-image' style={{ backgroundImage: `url('${image}')` }}>

                        </div>
                        <h1 className='project-name'>{name}</h1>
                        <div className='project-creator' style={{ width: "90%" }}>
                            <h1>Collab between&nbsp;
                        <Link to={this.props.user.id === user_id ? `/profile/${user_id}` : `/user/${user_id}`}>
                                    {first_name} {last_name}
                                </Link>
                                &nbsp;and&nbsp;
                        <Link to={this.props.user.id === collab_id ? `/profile/${collab_id}` : `/user/${collab_id}`}>
                                    {collab_first} {collab_last}
                                </Link></h1>
                        </div>
                        <div className='project-description'>
                            <p>{description}</p>
                        </div>
                        <div className='project-deadline'>
                            <h3 style={{paddingTop: "35px"}}>Deadline: {project_deadline}</h3>
                        </div>
                    </div>
                    {
                        this.props.user.id === collab_id ?
                            <div className='project-complete'>
                                {
                                    status === 'completed' ?
                                        <h1 style={{ width: "90%", fontSize: "22px" }}>This project has been completed.</h1>
                                        :
                                        <div >
                                            <h1 style={{ width: "90%", fontSize: "22px" }}>Enter the link to the finished project below.</h1>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "25px" }}>
                                                <input placeholder='Project URL'
                                                    className='submit-project-input'
                                                    value={this.setState.finished_url}
                                                    onChange={(e) => this.handleChange(e.target.value)} />
                                                <button className='submit-project-button' onClick={this.submitProject}>Submit</button>
                                            </div>
                                        </div>
                                }

                                {
                                    finished_url ?
                                        <div className='project-complete'>
                                            <h1>Your Submission</h1>
                                            <ReactPlayer url={finished_url}
                                                className='project-complete-media'
                                                playing={false}
                                                width='500px'
                                                height='300px' />
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            :
                            finished_url ?
                                <div className='project-complete'>
                                    <h1>{collab_first}'s Submission</h1>
                                    <ReactPlayer url={finished_url}
                                        className='project-complete-media'
                                        playing={false}
                                        width='500px'
                                        height='300px' />
                                    <button className='submit-project-button' 
                                    style={{marginBottom: "15px"}} 
                                    onClick={this.completeProject}>Finish Project</button>
                                </div>
                                :
                                <div className='project-complete'>
                                    <h1 style={{ width: "90%", fontSize: "22px" }}>Your collaborator has not yet finished the project.</h1>
                                </div>
                    }
                </div>
                <h1 className='chat-title'>Chat with {this.props.user.id === user_id ? collab_first : first_name}!</h1>
                <div className='collab-chat' >
                    <div className='chat-messages-container'
                        ref={el => this.container = el}>
                        {messages}
                    </div>
                    <div className='collab-chat-input'>
                        <input maxlength='200' ref='message' />
                        <button onClick={this.sendMessage}>Send</button>
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

export default connect(mapStateToProps, actions)(Collab);