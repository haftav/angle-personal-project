import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileProjectThumbnail.css';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

export default function ProfileProjectThumbnail({ name, type, description, image, id, position }) {

    //name, type, description, image
    return (
        <div className='profile-project-thumbnail'>
            <Link to={`/project/${id}`}>
                <Image publicId={image}
                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME} >
                    <Transformation width="200" height="165" crop="fill" />
                </Image>
                <h2>{position}</h2>
                <h1>{name}</h1>
            </Link>
        </div>
    )
}