import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../components/Login/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import Profile from '../components/Profile/Profile';
import GetInfo from '../components/GetInfo/GetInfo';
export default (
    <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/info' component={GetInfo} />
    </Switch>

)