import React, { Component } from 'react';
import axios from 'axios';
import './ProjectThumbnail.css'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

export default class ProjectThumbnail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bids: []
        }

        this.getTimeRemaining = this.getTimeRemaining.bind(this);
    }

    componentDidMount() {

    }

    getTimeRemaining(endtime) {
        let end = new Date(endtime.replace(/-/g, '\/'));
        // end.setHours(end.getHours() + 6)
        let newDate = new Date()
        var t = Date.parse(end) - Date.parse(newDate);
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    render() {
        let { name, type, description,
            price, image, first_name,
            last_name, user_image, project_id, bidding_deadline } = this.props
        let userImageAdded = false;
        let days, hours, minutes, time;
        if (bidding_deadline) {
            bidding_deadline = new Date(bidding_deadline)
            bidding_deadline = bidding_deadline.toISOString().split('T')[0];
            let countdown = this.getTimeRemaining(bidding_deadline);
            days = countdown.days;
            hours = countdown.hours;
            minutes = countdown.minutes;
            time = countdown.total;
        }

        if (/https:\/\/res.cloudinary.com\//.test(user_image)) {
            user_image = user_image.split('/')[7];
            userImageAdded = true;
        }

        image = image.split('/')[7];
        return (
            this.props.status === 'pending' ?
                <div className='project-thumbnail'>
                    <div className='project-thumbnail-content'>
                        {
                            userImageAdded ?
                                <Image publicId={user_image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                    className='project-thumbnail-userimage'>
                                    <Transformation width="100" height="100" crop="fill" />
                                </Image>
                                :
                                <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                        }
                        <div className='project-thumbnail-name'>
                            <h2><strong>{first_name} {last_name}</strong> is looking for a <strong>{type.toLowerCase()}</strong></h2>
                            <hr />
                        </div>
                        <div className='project-bidding-deadline'>
                            {
                                bidding_deadline ?
                                    <div>
                                        {
                                            time <= 0 ? <p>Bidding Closed.</p>
                                                :
                                                days >= 1 ?
                                                    <p>{days} {days === 1 ? 'day' : 'days'} remaining</p>
                                                    :
                                                    hours >= 1 ?
                                                        <p>{hours} {hours === 1 ? 'hour' : 'hours'} remaining</p>
                                                        :
                                                        <p>{minutes} {minutes === 1 ? 'minute' : 'minutes'} remaining</p>
                                        }
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        {
                            image ?
                                <Image publicId={image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                    className='project-thumbnail-projectimage'>
                                    <Transformation width="200" height="125" crop="fill" />
                                </Image>
                                :
                                <img className='project-thumbnail-projectimage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ' alt={name} />

                        }
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
                        {
                            userImageAdded ?
                                <Image publicId={user_image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                    className='project-thumbnail-userimage'>
                                    <Transformation width="100" height="100" crop="fill" />
                                </Image>
                                :
                                <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                        }
                        <div className='project-thumbnail-name'>
                            <h2><strong>{first_name} {last_name}</strong> and <strong>{this.props.collab_first} {this.props.collab_last}</strong> completed a project.</h2>
                            <hr />
                        </div>

                        <img className='project-thumbnail-projectimage' src={image ? image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAwiRlHwczue4fP90IgImSVnJOUQaj7LG51N31Ar2aI252sEpBQ'} alt={name} />
                        <div className='project-thumbnail-description'>
                            <h1>{name}</h1>
                        </div>
                        {/* <h2>{price}</h2> */}
                    </div>
                </div>
        )
    }
}