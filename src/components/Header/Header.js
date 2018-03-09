import './Header.css'
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className='header'>
            <Link className='header-home 'to="/dashboard">
                    Dashboard
            </Link>
            <Link className='header-profile' to='/profile'>Profile</Link>
        </div>
    )
}