import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import date from '../../helper/Date';
import './Collab.css';

class Collab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                collab_user: {}
            },
            finished_url: '',
            messages: [],
            userID: null
        }

        this.completeProject = this.completeProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitProject = this.submitProject.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.setUserId = this.setUserId.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
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
                messages: res.data
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
            user_id: this.props.user.id
        })

        this.refs.message.value = '';
    }

    render() {
        console.log(this.state);
        const { name, description, type, image,
            first_name, last_name, price, user_image, collab_user,
            finished_url, collab_id, status } = this.state.project;

        const collab_first = collab_user.first_name,
            collab_last = collab_user.last_name,
            collab_image = collab_user.image;

        const messages = this.state.messages.map((el, idx) => {
            const styles = el.user_id === this.props.user.id ?
                { textAlign: "right", backgroundColor: "white" }
                :
                { textAlign: "left", backgroundColor: "#F5F5F5" }
            return (
                <p style={styles}>{el.name} {el.message} {el.post_time}</p>
            )
        })
        return (
            <div>
                <Header userid={this.props.user.id} />
                <h1>{name}</h1>
                <h2>Collab between {first_name} {last_name} and {collab_first} {collab_last}</h2>
                <p>{description}</p>
                {
                    this.props.user.id === collab_id ?
                        <div>
                            {
                                status === 'completed' ?
                                    <h3>This project has been completed.</h3>
                                    :
                                    <div>
                                        <h3>Enter the link to the finished project below.</h3>
                                        <input placeholder='Project URL'
                                            value={this.setState.finished_url}
                                            onChange={(e) => this.handleChange(e.target.value)} />
                                        <button onClick={this.submitProject}>Submit</button>
                                    </div>
                            }

                            {
                                finished_url ?
                                    <ReactPlayer url={finished_url}
                                        playing={false}
                                        width='500px'
                                        height='300px' />
                                    :
                                    null
                            }
                        </div>
                        :
                        finished_url ?
                            <div>
                                <ReactPlayer url={finished_url}
                                    playing={false}
                                    width='500px'
                                    height='300px' />
                                <button onClick={this.completeProject}>Finish Project</button>
                            </div>
                            :
                            <h3>Your collaborator has not yet finished the project.</h3>
                }
                <div className='collab-chat'>
                    <div className='chat-messages-container'>
                        {messages}
                    </div>
                    <div className='collab-chat-input'>
                        <input ref='message' />
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