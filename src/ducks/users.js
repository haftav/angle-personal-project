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
            return Object.assign({}, state, { user: action.payload})
        default:
            return state;
    }
}

export function getUser() {
    let userData = axios.get('/api/user').then(res => {
        return res.data;
    })
    return {
        type: GET_USER,
        payload: userData
    }
}


export function updateUser(user) {
    const { user_name, first_name, last_name, description, artist_type } = user
    let userData = axios.put('/api/user', { user_name, first_name, last_name, description, artist_type }).then(res => {
        return res.data;
    })

    return {
        type: UPDATE_USER,
        payload: userData
    }
}