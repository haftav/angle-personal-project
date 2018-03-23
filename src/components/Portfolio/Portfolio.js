import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import './Portfolio.css';

export default class Portfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vimeo: '',
            soundcloud: '',
            user: {},
            vimeo_projects: [],
            video_buttons: null,
            button_index: 1,
            active: 'angle'
        }

        this.handleChange = this.handleChange.bind(this);
        this.getMediaProfile = this.getMediaProfile.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.getData = this.getData.bind(this);
        this.changeVideoPage = this.changeVideoPage.bind(this);
    }

    getData(props) {
        if (props.user.vimeo_profile) {
            if (props.user.artist_type === 'Both' || props.user.artist_type === 'Filmmaker') {
                let vimeo_user = props.user.vimeo_profile
                axios.get(`https://api.vimeo.com/users/${vimeo_user}/videos?access_token=${process.env.REACT_APP_VIMEO_TOKEN}&fields=uri`).then(res => {
                    let projects = res.data.data.map((el, idx) => {
                        return el.uri.split('/')[2]
                    })
                    this.setState({
                        user: props.user,
                        vimeo_projects: projects,
                        video_buttons: Math.ceil(projects.length / 4)
                    })
                })
            } else {
                this.setState({
                    user: props.user
                })
            }
        } else {
            this.setState({
                user: props.user
            })
        }
    }

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.getData(newProps);
        }
    }

    handleChange(val, type) {
        this.setState({
            [type]: val
        })
    }

    changeTab(val) {
        this.setState({
            active: val
        })
    }

    getMediaProfile(type) {
        if (type === 'vimeo') {
            let vimeo_profile = this.state.vimeo.match(/user(\d+)/)[1];
            axios.put('/api/user/media', { vimeo_profile, type }).then(res => {
                this.setState({
                    user: res.data,
                    vimeo: ''
                })
            })
        } else {
            let soundcloud_profile = this.state.soundcloud;
            axios.put('/api/user/media', { soundcloud_profile, type }).then(res => {
                this.setState({
                    user: res.data,
                    soundcloud: ''
                })
            })
        }
    }

    changeVideoPage(val) {
        this.setState({
            button_index: val
        })
    }

    render() {
        console.log(this.state)
        const { artist_type } = this.props.user;
        const { vimeo_profile, soundcloud_profile } = this.state.user;
        let vimeo_projects = this.state.vimeo_projects.map((el, idx) => {
            return (
                <ReactPlayer url={`https://vimeo.com/${el}`}
                    playing={false}
                    width='400px'
                    height='225px' />
            )
        })

        let buttons = [];
        for (let i=0; i < this.state.video_buttons; i++) {
            buttons.push((
                <button onClick={() => this.changeVideoPage(i + 1)} key={`video-button-${i + 1}`}>{i + 1}</button>
            ))
        }
        vimeo_projects = vimeo_projects.slice(((this.state.button_index - 1) * 4), this.state.button_index * 4);
        return (
            <div className='portfolio'>
                <h1>PORTFOLIO</h1>
                {
                    artist_type === 'Both' ?
                        <div className='portfolio-media-tabs'>
                            <p onClick={() => this.changeTab('angle')} className={this.state.active === 'angle' ? 'portfolio-tab-active' : ''}>Angle Projects</p>
                            <p onClick={() => this.changeTab('videos')} className={this.state.active === 'videos' ? 'portfolio-tab-active' : ''}>Videos</p>
                            <p onClick={() => this.changeTab('music')} className={this.state.active === 'music' ? 'portfolio-tab-active' : ''}>Music</p>
                        </div>
                        :
                        artist_type === 'Filmmaker' ?
                            <div className='portfolio-media-tabs'>
                                <p onClick={() => this.changeTab('angle')} className={this.state.active === 'angle' ? 'portfolio-tab-active' : ''}>Angle Projects</p>
                                <p onClick={() => this.changeTab('videos')} className={this.state.active === 'videos' ? 'portfolio-tab-active' : ''}>Videos</p>
                            </div>
                            :
                            <div className='portfolio-media-tabs'>
                                <p onClick={() => this.changeTab('angle')} className={this.state.active === 'angle' ? 'portfolio-tab-active' : ''}>Angle Projects</p>
                                <p onClick={() => this.changeTab('music')} className={this.state.active === 'music' ? 'portfolio-tab-active' : ''}>Music</p>
                            </div>
                }
                {
                    this.state.active === 'angle' ?
                        <div className='portfolio-angle'>
                            <div>
                                {this.props.user_projects}
                            </div>
                        </div>
                        :
                        this.state.active === 'videos' ?
                            <div className='portfolio-videos'>
                                {
                                    vimeo_profile ?
                                    <div>
                                        <div >
                                            {vimeo_projects}
                                        </div>
                                            {
                                                this.state.video_buttons > 1 ?
                                                <div>
                                                    {buttons}
                                                </div>
                                                :
                                                null
                                            }
                                    </div>
                                        :
                                        this.props.type === 'profile' ?
                                            <div>
                                                <h3>To show your vimeo videos, enter your vimeo profile URL here.</h3>
                                                <input placeholder='Vimeo URL' onChange={(e) => this.handleChange(e.target.value, 'vimeo')} />
                                                <button onClick={() => this.getMediaProfile('vimeo')}>Submit</button>
                                            </div>
                                            :
                                            <h3>This user has not connected their Vimeo profile.</h3>
                                }
                            </div>

                            :
                            <div className='portfolio-music'>
                                {
                                    soundcloud_profile ?
                                        <ReactPlayer url={this.props.user.soundcloud_profile}
                                            config={{
                                                soundcloud: {
                                                    options: { visual: false }
                                                }
                                            }}
                                            playing={false}
                                            width='80%'
                                            height='400px' />
                                        :
                                        this.props.type === 'profile' ?
                                            <div>
                                                <h3>To show your soundcloud sounds, enter your soundcloud profile URL here.</h3>
                                                <input placeholder='Soundcloud URL' onChange={(e) => this.handleChange(e.target.value, 'soundcloud')} />
                                                <button onClick={() => this.getMediaProfile('soundcloud')}>Submit</button>
                                            </div>
                                            :
                                            <h3>This user has not connected their Soundcloud profile.</h3>
                                }
                            </div>
                }



                {/* <ReactPlayer url='https://vimeo.com/163858592'
                    playing={false}
                    width='350px'
                    height='225px' />
                <ReactPlayer url='https://soundcloud.com/tav-daddy'
                    playing={false}
                    width='350px'
                    height='225px' /> */}
            </div>
        )
    }
}