import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileProjectThumbnail ({ name, type, description, image, id }) {

    //name, type, description, image
    return (
        <div>
            <Link to={`/project/${id}`}>
            <img src={image} alt={name} />
            <h1>{name}</h1>
            <h2>{type}</h2>
            <p>{description}</p>
            </Link>
        </div>
    )
}