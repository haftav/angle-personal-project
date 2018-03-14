import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser, updateUser } from '../../ducks/users';

class GetInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }

        this.updateUser = this.updateUser.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
        // console.log(this.props.user.info === 'true')
        this.setState({
            user: Object.assign({}, this.state.user, { artist_type: 'Both' })
        })
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user.info === 'true') {
            this.props.history.push('/dashboard')
        }
    }

    updateUser(val, type) {
        this.setState({ user: Object.assign({}, this.state.user, { [type]: val }) })
    }

    handleUpdate() {
        const { user_name, first_name, last_name, description, artist_type } = this.state.user;
        if (user_name && first_name && last_name && description && artist_type) {
            this.props.updateUser(this.state.user);
        } else {
            alert('Please fill in the required information.')
        }
    }


    render() {
        console.log(this.state);
        return (
            <div>
                {/* {
                    this.props.loading ?
                    <h1>Loading</h1>
                    : */}
                    <div>
                        <h1>Get Info</h1>
                        <h3>Please fill in some more info about yourself.</h3>
                        <h3>Username</h3>
                        <input placeholder={this.state.user.user_name}
                                onChange={(e) => this.updateUser(e.target.value, 'user_name')}/>
                        <h3>First Name</h3>
                        <input placeholder={this.state.user.first_name}
                                onChange={(e) => this.updateUser(e.target.value, 'first_name')}/>
                        <h3>Last Name</h3>
                        <input placeholder={this.state.user.last_name}
                                onChange={(e) => this.updateUser(e.target.value, 'last_name')}/>
                        <h3>Description</h3>
                        <textarea onChange={(e) => this.updateUser(e.target.value, 'description')}></textarea>
                        <h3>Artist Type</h3>
                        <select onChange={(e) => this.updateUser(e.target.value, 'artist_type')}>
                            <option selected='selected' value='Both'>Both</option>
                            <option value='Filmmaker'>Filmmaker</option>
                            <option value='Musician'>Musician</option>
                        </select>
                        <button onClick={this.handleUpdate}>Submit</button>
                    </div>
                {/* // } */}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { user, loading } = state;
    return {
        user,
        loading
    }
}

let actions = {
    getUser,
    updateUser
}

export default connect(mapStateToProps, actions)(GetInfo);