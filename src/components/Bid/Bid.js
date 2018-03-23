import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import './Bid.css';
import { Link } from 'react-router-dom';


function Bid(props) {

    const { image, first_name, last_name, votes,
        user_id, bidder_id, project_id, chooseBid, artist_type } = props

    return (
        <div className='bid'>
            <div className='bid-image' style={{ backgroundImage: `url(${image})` }}>

            </div>
            <div className='bid-info'>

                <Link to={props.user.id === bidder_id ? `/profile/${bidder_id}` : `/user/${bidder_id}`}><h2>{first_name} {last_name}</h2></Link>
                {props.user.id === user_id ?
                    <button onClick={() => chooseBid(project_id, bidder_id)}>Choose Bid</button>
                    : 
                    <p>{artist_type === 'Both' ? 'Filmmaker/Musician' : artist_type}</p>
                }
            </div>
        </div>
    )
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

export default connect(mapStateToProps, actions)(Bid);