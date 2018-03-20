import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../ducks/users';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import './ProjectsPage.css';

class ProjectsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        axios.get('/api/collabs').then(res => {
            console.log(res.data);
            this.setState({
                projects: res.data
            })
        })
    }

    render() {
        var imageStyles = {
            width: "280px",
            height: "150px",
            background: "lightblue"
        }
        const projects = this.state.projects.map((el, idx) => {
            let { name, type, description,
                price, image, id, first_name,
                last_name, user_image, user_id, status } = el;
            let imageAdded = false;
            if (/https:\/\/res.cloudinary.com\//.test(image)) {
                image = image.split('/')[7];
                imageAdded = true;
            }
            if (status === 'pending') {
                return (
                    <Link className='projects-project-thumbnail' to={`/project/${id}`}>
                        <h1>{name}</h1>
                        <h1>You opened this project for bidding.</h1>
                        {
                            imageAdded ?
                                <Image publicId={image}
                                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                    className='projects-project-image'>
                                    <Transformation width="280" height="150" crop="fill" />
                                </Image>
                                :
                                <img className='projects-project-image' src='http://www.publicdomainpictures.net/pictures/130000/velka/aqua-blue-gradient-background.jpg' alt={name} />
                        }

                    </Link>
                )
            } else if (status === 'collab') {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You are collaborating on this project with {first_name} {last_name}.</h1>
                            {
                                imageAdded ?
                                    <Image publicId={image}
                                        cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                        className='projects-project-image'>
                                        <Transformation width="280" height="150" crop="fill" />
                                    </Image>
                                    :
                                    <img className='projects-project-image' src='http://www.publicdomainpictures.net/pictures/130000/velka/aqua-blue-gradient-background.jpg' alt={name} />
                            }
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>{first_name} {last_name} is collaborating on this project with you.</h1>
                            {
                                imageAdded ?
                                    <Image publicId={image}
                                        cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                        className='projects-project-image'>
                                        <Transformation width="280" height="150" crop="fill" />
                                    </Image>
                                    :
                                    <img className='projects-project-image' src='http://www.publicdomainpictures.net/pictures/130000/velka/aqua-blue-gradient-background.jpg' alt={name} />
                            }
                        </Link>
                    )
                }
            }
            else {
                if (user_id === this.props.user.id) {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You completed this project with {first_name} {last_name}.</h1>
                            {
                                imageAdded ?
                                    <Image publicId={image}
                                        cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                        className='projects-project-image'>
                                        <Transformation width="280" height="150" crop="fill" />
                                    </Image>
                                    :
                                    <img className='projects-project-image' src='http://www.publicdomainpictures.net/pictures/130000/velka/aqua-blue-gradient-background.jpg' alt={name} />
                            }
                        </Link>
                    )
                } else {
                    return (
                        <Link className='projects-project-thumbnail' to={`/collab/${id}`}>
                            <h1>{name}</h1>
                            <h1>You helped {first_name} {last_name} complete this project.</h1>
                            {
                                imageAdded ?
                                    <Image publicId={image}
                                        cloudName={process.env.REACT_APP_CLOUDINARY_CLOUDNAME}
                                        className='projects-project-image'>
                                        <Transformation width="280" height="150" crop="fill" />
                                    </Image>
                                    :
                                    <img className='projects-project-image' src='http://www.publicdomainpictures.net/pictures/130000/velka/aqua-blue-gradient-background.jpg' alt={name} />
                            }                        </Link>
                    )
                }
            }
        })
        return (
            <div>
                <Header userid={this.props.match.params.id} />
                <h1>User Projects</h1>
                {projects}
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

export default connect(mapStateToProps, actions)(ProjectsPage);