import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileProjectThumbnail.css';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

export default function ProfileProjectThumbnail({ name, type, description, image, id, position }) {

    //name, type, description, image
    return (
        <div className='profile-project-thumbnail'>
            <Link to={`/project/${id}`}>
                <div className='profile-project-thumbnail-image'
                    style={{ backgroundImage: `url('${image}')` }}>

                </div>
                <h1>{name}</h1>
                <p>{position}</p>
            </Link>
        </div>
    )
}