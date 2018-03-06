import React, { Component } from 'react';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h1>Profile {this.props.match.params.id}</h1>
            </div>
        )
    }
}