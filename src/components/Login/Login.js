import React, { Component } from 'react';
import './Login.css';

export default class Login extends Component {
    render() {
        console.log(process.env.REACT_APP_LOGIN);
        return (
            <div className='login'>
                <div className='login-header'>
                    <div className='logo'>ANGLE</div>
                    <div className='angle-motto'>THERE'S MORE THAN ONE SIDE TO EVERY STORY</div>
                </div>
                <section className='login-main'>
                    <h1>Connect with other film and music entrepreneurs to reach your potential</h1>
                    <p>We believe there should be more than one side to every story. Help others complete their creative projects and help yourself in the process. It's a win-win situation.</p>
                    <a href='http://localhost:3005/api/auth'><button className="login-button">Join the Angle Network</button></a>
                    <div className='login-main-info'>
                        <div>
                            <h3>CONNECT.</h3>
                            <p>POST YOUR PROJECT ON ANGLE, AND RECEIVE A MESSAGE FROM A CREATIVE WILLING TO HELP.</p>
                        </div>
                        <div>
                            <h3>COLLABORATE.</h3>
                            <p>WITH THE HELP OF YOUR NEW PARTNER, COMPLETE YOUR PROJECT ON TIME AND FOR FREE.</p>
                        </div>
                        <div>
                            <h3>SHARE.</h3>
                            <p>SHOW OFF YOUR COMPLETED PROJECT TO YOUR CLIENT AND THE REST OF THE ANGLE COMMUNITY</p>
                        </div>
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