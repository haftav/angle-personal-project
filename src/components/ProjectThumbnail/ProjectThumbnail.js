import React, { Component } from 'react';
import axios from 'axios';
import './ProjectThumbnail.css'

export default class ProjectThumbnail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bids: []
        }
    }

    componentDidMount() {

    }

    render() {
        let { name, type, description,
            price, image, first_name,
            last_name, user_image, project_id, bidding_deadline } = this.props
        if (bidding_deadline) {
            bidding_deadline = new Date(bidding_deadline)
            bidding_deadline = bidding_deadline.toISOString().split('T')[0];
        }
        console.log(!!bidding_deadline);
        return (
            this.props.status === 'pending' ?
                <div className='project-thumbnail'>
                    <div className='project-thumbnail-content'>
                        <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                        <div className='project-thumbnail-name'>
                            <h2><strong>{first_name} {last_name}</strong> is looking for a {type.toLowerCase()}</h2>
                            <hr />
                        </div>
                        <div className='project-bidding-deadline'>
                            {
                                bidding_deadline ?
                                    <div>
                                        <h4>Bidding Deadline:</h4>
                                        <p>{bidding_deadline}</p>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <img className='project-thumbnail-projectimage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ' alt={name} />
                        <div className='project-thumbnail-description'>
                            <h1>{name}</h1>
                            <p>{description}</p>
                        </div>
                        {/* <h2>{price}</h2> */}
                    </div>
                </div>
                :
                <div className='project-thumbnail'>
                    <div className='project-thumbnail-content'>
                        <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                        <div className='project-thumbnail-name'>
                            <h2><strong>{first_name} {last_name}</strong> and <strong>{this.props.collab_first} {this.props.collab_last} completed a project.</strong></h2>
                            <hr />
                        </div>

                        <img className='project-thumbnail-projectimage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ' alt={name} />
                        <div className='project-thumbnail-description'>
                            <h1>{name}</h1>
                        </div>
                        {/* <h2>{price}</h2> */}
                    </div>
                </div>
        )
    }
}