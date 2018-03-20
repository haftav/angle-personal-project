import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import ReviewInput from '../ReviewInput/ReviewInput';
import axios from 'axios';

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            canAdd: false,
            reviewText: '',
            editID: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitReview = this.submitReview.bind(this);
        this.editReview = this.editReview.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    componentDidMount() {
        console.log(this.props.user.id);
        console.log(this.props.match.params.id);
        axios.get(`/api/reviews/${this.props.match.params.id}`).then(res => {
            this.setState({
                reviews: res.data
            })
        })
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

    handleChange(val) {
        this.setState({
            reviewText: val
        })
    }

    submitReview(info) {
        let date = new Date();
        date = date.toISOString().split('T')[0];
        info.description = this.state.reviewText;
        info.user_id = Number(this.props.match.params.id);
        info.post_date = date;

        console.log('clicked')
        console.log(info);
        axios.post('/api/reviews/add', info).then(res => {
            this.setState({
                reviews: res.data,
                reviewText: ''
            })
        })
    }

    toggleEdit(id, description) {
        if (!this.state.editID) {
            this.setState({
                editID: id,
                reviewText: description
            })
        } else {
            this.setState({
                editID: null,
                reviewText: ''
            })
        }
    }

    editReview(info) {

    }


    render() {
        console.log(this.state);
        const reviews = this.state.reviews.map((el, idx) => {
            const { description, date, first_name, last_name, image, id, reviewer_id } = el;
            if (this.props.user.id == reviewer_id) {
                if (this.state.editID == id) {
                    return (
                        <div className='review-edit'>
                            <h1>{first_name} {last_name}</h1>
                            <h3>{date}</h3>
                            <textarea onChange={(e) => this.handleChange(e.target.value)} 
                                        value={this.state.reviewText}></textarea>
                            <button>Submit</button>
                            <button onClick={() => this.toggleEdit(id, description)}>Cancel</button>
                        </div>
                    )
                }
                return (
                    <div className='review'>
                        <h1>{first_name} {last_name}</h1>
                        <h3>{date}</h3>
                        <p>{description}</p>
                        <button onClick={() => this.toggleEdit(id, description)}>Edit</button>
                        <button>Delete</button>
                    </div>
                )
            } else {
                return (
                    <div className='review'>
                        <h1>{first_name} {last_name}</h1>
                        <h3>{date}</h3>
                        <p>{description}</p>
                    </div>
                )
            }
        })
        return (
            <div>
                <h1>Reviews</h1>
                {
                    this.state.canAdd ?
                        <div>
                            <h1>You can add a review</h1>
                            <ReviewInput submit={this.submitReview}
                                handleChange={this.handleChange}
                                user={this.props.user} />
                        </div>
                        :
                        this.props.user.id == this.props.match.params.id ?
                            <h1>Here are your reviews.</h1>
                            :
                            <h1>You may not add a review.</h1>
                }
                {reviews}
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