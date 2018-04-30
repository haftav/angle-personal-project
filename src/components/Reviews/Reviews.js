import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import ReviewInput from '../ReviewInput/ReviewInput';
import axios from 'axios';
import './Reviews.css';
import _ from 'underscore';

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            canAdd: false,
            reviewText: '',
            editID: null,
            loading: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitReview = this.submitReview.bind(this);
        this.editReview = this.editReview.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
    }

    componentDidMount() {
        this.props.getUser();
        axios.get(`/api/reviews/${this.props.match.params.id}`).then(res => {
            this.setState({
                reviews: res.data,
                loading: false
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

    componentWillReceiveProps(newProps) {
        if (!_.isEqual(this.props, newProps)) {
            this.setState({
                loading: true
            })
            axios.get(`/api/reviews/${newProps.match.params.id}`).then(res => {
                this.setState({
                    reviews: res.data,
                    loading: false
                })
            })
            if (this.props.user.id != newProps.match.params.id) {
                axios.get(`/api/reviews/check/${newProps.match.params.id}`).then(res => {
                    if (res.data === true) {
                        this.setState({
                            canAdd: true
                        })
                    }
                })

            }
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

        axios.post('/api/reviews/add', info).then(res => {
            this.setState({
                reviews: res.data,
                reviewText: '',
                canAdd: false
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
        let date = new Date();
        date = date.toISOString().split('T')[0];
        info.description = this.state.reviewText;
        info.post_date = date;
        info.user_id = this.props.match.params.id;
        axios.put('/api/reviews/edit', info).then(res => {
            this.setState({
                reviews: res.data,
                reviewText: '',
                editID: null
            })
        })
    }

    deleteReview(id) {
        axios.delete(`/api/reviews/delete/${id}/${this.props.match.params.id}`).then(res => {
            this.setState({
                reviews: res.data,
                canAdd: true
            })
        })
    }


    render() {
        const reviews = this.state.reviews.map((el, idx) => {
            let { description, post_date, first_name, last_name, image, id, reviewer_id } = el;
            post_date = post_date.split('T')[0]
            if (this.props.user.id == reviewer_id) {
                if (this.state.editID == id) {
                    return (
                        <div className='review-edit'>
                            <div className='review-image' style={{ backgroundImage: `url('${image}')` }}>

                            </div>
                            <div className='review-user'>
                                <h1>{first_name} {last_name}</h1>
                                <h3>{post_date}</h3>
                                <textarea onChange={(e) => this.handleChange(e.target.value)}
                                    value={this.state.reviewText}></textarea>
                            </div>
                            <div className='review-buttons'>
                                <button onClick={() => this.editReview({ id })}>Submit</button>
                                <button onClick={() => this.toggleEdit(id, description)}>Cancel</button>
                            </div>
                        </div>
                    )
                }
                return (
                    <div className='review'>
                        <div className='review-image' style={{ backgroundImage: `url('${image}')` }}>

                        </div>
                        <div className='review-user'>
                            <h1>{first_name} {last_name}</h1>
                            <h3>{post_date}</h3>
                            <p>{description}</p>
                        </div>
                        <div className='review-buttons'>
                            <button onClick={() => this.toggleEdit(id, description)}>Edit</button>
                            <button onClick={() => this.deleteReview(id)}>Delete</button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className='review'>
                        <div className='review-image' style={{ backgroundImage: `url('${image}')` }}>

                        </div>
                        <div className='review-user'>
                            <h1>{first_name} {last_name}</h1>
                            <h3>{post_date}</h3>
                            <p>{description}</p>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div className='portfolio'>
                <h1>REVIEWS</h1>
                {
                    this.state.loading ?
                        <div className='reviews-loading'></div>
                        :
                        this.state.canAdd ?
                            <div>
                                <ReviewInput submit={this.submitReview}
                                    handleChange={this.handleChange}
                                    user={this.props.user} />
                                    {
                                        reviews
                                    }
                            </div>
                            :
                            this.props.user.id == this.props.match.params.id ?
                                reviews.length > 0 ?
                                    <div>

                                        <h1>Your reviews</h1>
                                        { reviews }
                                    </div>
                                    :
                                    <h1>No reviews to display.</h1>
                                :
                                reviews.length > 0 ?
                                reviews
                                :
                                <h1>No reviews to display.</h1>
                }
                {

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