import axios from 'axios';

const initialState = {
    user: {},
    loading: false
}

const GET_USER = 'GET_USER';
const UPDATE_USER = 'UPDATE_USER';

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER + '_PENDING':
            return Object.assign({}, state, { loading: true })
        case GET_USER + '_FULFILLED':
            console.log(action.payload);
            return Object.assign({}, state, { user: action.payload, loading: false })
        case UPDATE_USER + '_FULFILLED':
            console.log(action.payload)
            return Object.assign({}, state, { user: action.payload })
        default:
            return state;
    }
}

export function getUser() {
    let userData = axios.get('/api/user').then(res => {
        return res.data;
    }).catch(err => this.props.history.push('http://localhost:3000/#/'))
    return {
        type: GET_USER,
        payload: userData
    }
}


export function updateUser(user) {
    const { first_name, last_name, description, artist_type, image_data } = user
    if (image_data instanceof FormData) {
        var userData = axios.post(process.env.REACT_APP_CLOUDINARY_URL, image_data, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        }).then(res => {
            const data = res.data;
            let image = data.secure_url // You should store this URL for future references in your app
            return axios.put('/api/user', { first_name, last_name, description, artist_type, image }).then(res => {
                return res.data;
            })
        })
    } else {
        var userData = axios.put('/api/user', { first_name, last_name, description, artist_type }).then(res => {
            return res.data;
        })
    }

    return {
        type: UPDATE_USER,
        payload: userData
    }
}