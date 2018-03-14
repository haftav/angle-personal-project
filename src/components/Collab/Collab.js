import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';

class Collab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                collab_user: {}
            }
        }

        this.completeProject = this.completeProject.bind(this);
    }

    componentDidMount() {
        const project_id = this.props.match.params.id;
        axios.get(`/api/projects/collab/${project_id}`).then(res => {
            console.log(res.data);
            this.setState({
                project: res.data
            })
        })
    }

    completeProject() {
        const project_id = this.props.match.params.id;
        axios.put(`/api/projects/completed/${project_id}`, {}).then(res => {
            console.log(res.data);
        })
    }

    render() {
        const { name, description, type, image,
            first_name, last_name, price, user_image, collab_user,
            finished_url, collab_id } = this.state.project;
        const collab_first = collab_user.first_name,
            collab_last = collab_user.last_name,
            collab_image = collab_user.image;
        return (
            <div>
                <Header userid={this.props.user.id} />
                <h1>{name}</h1>
                <h2>Collab between {first_name} {last_name} and {collab_first} {collab_last}</h2>
                <p>{description}</p>
                {
                    this.props.user.id === collab_id ?
                        <div>
                            <h3>Enter the link to the finished project below.</h3>
                            <input placeholder='Project URL' />
                            <button>Submit</button>
                        </div>
                        :
                        finished_url ?
                            <button onClick={this.completeProject}>Finish Project</button>
                            :
                            <h3>Your collaborator has not yet finished the project.</h3>
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

export default connect(mapStateToProps, actions)(Collab);