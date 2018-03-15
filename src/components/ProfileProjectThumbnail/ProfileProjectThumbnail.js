import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileProjectThumbnail ({ name, type, description, image, id, position }) {

    //name, type, description, image
    return (
        <div className='profile-project-thumbnail'>
            <Link to={`/project/${id}`}>
            <img src={image} alt={name} />
            <h2>{position}</h2>
            <h1>{name}</h1>
            </Link>
        </div>
    )
}