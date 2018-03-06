import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../components/Login/Login';

export default (
    <Switch>
        <Route path='/' component={Login} />
    </Switch>

)