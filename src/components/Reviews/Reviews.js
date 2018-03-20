import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import axios from 'axios';

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            canAdd: false
        }
    }

    componentDidMount() {
        console.log(this.props.user.id);
        console.log(this.props.match.params.id);
        if (this.props.user.id != this.props.match.params.id) {
            axios.get(`/api/reviews/check/${this.props.match.params.id}`).then(res => {
                if (res.data === true) {
                    this.setState({
                        canAdd: true
                    })
                } 
            })

        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <h1>Reviews</h1>
                {
                    this.state.canAdd ?
                    <h1>You can add a review</h1>
                    :
                    this.props.user.id == this.props.match.params.id ?
                    <h1>Here are your reviews.</h1>
                    :
                    <h1>You may not add a review.</h1>
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

export default connect(mapStateToProps, actions)(Reviews);