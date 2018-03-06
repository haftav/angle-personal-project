import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        this.props.getUser();
    }

    render() {
        const { first_name, last_name, user_name, description, artist_type, image, id } = this.props.user;
        return (
            <div>
                <h1>Profile {id}</h1>
                <img src={image} alt={`user/${id}`} />
                <h1>{user_name}</h1>
                <h2>{first_name} {last_name}</h2>
                <h2>{artist_type}</h2>
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

export default connect(mapStateToProps, actions)(Profile);