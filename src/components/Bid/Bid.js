import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';

function Bid(props) {

    const { image, first_name, last_name, votes, 
        user_id, bidder_id, project_id, chooseBid } = props

    return (
        <div>
            <img src={image} alt={first_name} />
            <h2>{first_name} {last_name}</h2>
            <h3>Votes: {votes}</h3>
            {props.user.id === user_id ? 
            <button onClick={() => chooseBid(project_id, bidder_id)}>Choose Bid</button> 
            : null}
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