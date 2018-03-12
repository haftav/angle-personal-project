import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';

class Collab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                collab_user: {}
            }
        }
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

    render() {
        const { name, description, type, image,
                first_name, last_name, price, user_image, collab_user } = this.state.project;
        const collab_first = collab_user.first_name,
                collab_last = collab_user.last_name, 
                collab_image = collab_user.image;
        return (
            <div>
                <h1>{name}</h1>
                <h2>Collab between {first_name} {last_name} and {collab_first} {collab_last}</h2>
                <p>{description}</p>
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

export default connect (mapStateToProps, actions)(Collab);