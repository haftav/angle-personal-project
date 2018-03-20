import React, { Component } from 'react';
import './Login.css';
import logo from './whitelogo.png'

export default class Login extends Component {
    render() {
        return (
            <div className='login'>
                <div className='login-header'>
                    <img src={logo} alt="logo" />
                </div>
                <section className='login-main'>
                    <h1>Connect with other film and music entrepreneurs to reach your potential.</h1>
                    <a href={process.env.REACT_APP_LOGIN}><button className="login-button">JOIN THE ANGLE NETWORK</button></a>
                    <div className='login-main-info'>
                        <h1>There's more than one side to every story.</h1>
                    </div>
                </section>
                <section className='login-middle'>
                    <div className='login-middle-top'>
                    </div>
                    <div className='login-middle-middle'>

                    </div>
                    <div className='login-middle-bottom'>

                    </div>

                </section>
            </div>
        )
    }
}