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
        const { name, type, description,
            price, image, first_name,
            last_name, user_image, project_id } = this.props
        return (
            <div className='project-thumbnail'>
                <div className='project-thumbnail-content'>
                    <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                    <div className='project-thumbnail-name'>
                        <h2>{first_name} {last_name} is looking for a {type.toLowerCase()}</h2>
                        <hr />
                    </div>
                    <img className='project-thumbnail-projectimage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ' alt={name} />
                    <div className='project-thumbnail-description'>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>
                    {/* <h2>{price}</h2> */}
                </div>
            </div>
        )
    }
}