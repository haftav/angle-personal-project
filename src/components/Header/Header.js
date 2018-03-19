import './Header.css'
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './bigwhite.png'

export default function Header({ userid }) {
    return (
        <div className='header'>
            <div className='header-left'>
                <Link className='header-home' to="/dashboard">
                    <img src={logo} alt="" />
                </Link>
                <input />
            </div>
            <div className='header-right'>
                <Link className='home-button' to='/dashboard'>
                    <i class="fa fa-home"></i>
                    Dashboard
                </Link>
                <Link to={`/profile/${userid}`}>
                    <i class="fa fa-user-circle"></i>
                    Profile
                </Link>
                <Link to={`/projects/${userid}`}>
                    <i class="fa fa-book"></i>
                    Projects
                </Link>
                <a href='#'>
                <i class="fa fa-sign-out"></i>
                    Log Out
                    </a>
            </div>
        </div>
    )
}