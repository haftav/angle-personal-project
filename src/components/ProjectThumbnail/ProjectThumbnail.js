import React from 'react';
import './ProjectThumbnail.css'

export default function ProjectThumbnail({ name, type, description,
    price, image, first_name,
    last_name, user_image }) {
    return (
        <div className='project-thumbnail'>
            <div className='project-thumbnail-content'>
                <img className='project-thumbnail-userimage' src={user_image} alt={first_name} />
                <div className='project-thumbnail-name'>
                    <h2>{first_name} {last_name} is looking for a {type.toLowerCase()}</h2>
                </div>
                <img className='project-thumbnail-projectimage' src={image} alt={name} />
                <div className='project-thumbnail-description'>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                {/* <h2>{price}</h2> */}
            </div>
        </div>
    )
}