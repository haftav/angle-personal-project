import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';
import Header from '../Header/Header';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        this.props.getUser();
    }

    render() {
        return (
            <div>
                <Header />
                <h1>Dashboard</h1>
                <Link to='/profile'><button>Profile</button></Link>
                <div className='grid'>
                    <div className='grid-1'>
                        Hello
                    </div>  
                    <div className='grid-2'>
                        World
                    </div>
                    <div className='grid-3'>
                        Thing
                    </div>
                </div>
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

export default connect(mapStateToProps, actions)(Dashboard);