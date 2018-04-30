import './Header.css'
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './bigwhite.png'

export default function Header({ userid, toggleMenu, menuActive }) {
    return (
        <div className='header'>
            <div className='header-left'>
                <Link className='header-home' to="/dashboard">
                    <img src={logo} alt="" />
                </Link>
                <Link className='create-button' to='/create'>
                    <i class="fa fa-plus"></i>
                    &nbsp;
                    CREATE
                </Link>
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
                <a href={process.env.REACT_APP_LOGOUT}>
                    <i class="fa fa-sign-out"></i>
                    Log Out
                    </a>
            </div>
            <div className='hamburger' onClick={toggleMenu}>
                I is hamburger
            </div>
            <div className={menuActive ? 'pop-down-menu pop-down-menu-active' : 'pop-down-menu'}>
                <Link className='home-button' to='/dashboard'>
                    Dashboard
                </Link>
                <Link to='/create'>
                    Create
                </Link>
                <Link to={`/profile/${userid}`}>
                    Profile
                </Link>
                <Link to={`/projects/${userid}`}>
                    Projects
                </Link>
                <a href={process.env.REACT_APP_LOGOUT}>
                    Log Out
                    </a>
            </div>
        </div>
    )
}