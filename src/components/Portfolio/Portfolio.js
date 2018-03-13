import React, { Component } from 'react';
import ReactPlayer from 'react-player';

export default class Portfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        axios.get(`https://api.vimeo.com/users/${}/videos?access_token=${}&fields=uri`)
    }
    render() {
        return (
            <div>
                <h1>Portfolio</h1>
                <ReactPlayer url='https://vimeo.com/163858592'
                    playing={false}
                    width='350px'
                    height='225px' />
                <ReactPlayer url='https://soundcloud.com/transatlantyk-records/tamten-nieznajoma'
                    playing={false}
                    width='350px'
                    height='225px' />
            </div>
        )
    }
}