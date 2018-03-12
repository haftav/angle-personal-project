import './Header.css'
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './bigwhite.png'

export default function Header() {
    return (
        <div className='header'>
            <div className='header-left'>
                <Link className='header-home' to="/dashboard">
                    <img src={logo} alt="" />
                </Link>
                <input />
            </div>
            <div className='header-right'>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/profile'>Profile</Link>
                <a href='#'>Projects</a>
                <a href='#'>Log Out</a>
            </div>
        </div>
    )
}