import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../components/Login/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import Profile from '../components/Profile/Profile';
import GetInfo from '../components/GetInfo/GetInfo';
import CreateProject from '../components/CreateProject/CreateProject';
import Project from '../components/Project/Project';

export default (
    <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/profile' component={Profile} />
        <Route path='/info' component={GetInfo} />
        <Route path='/create' component={CreateProject} />
        <Route path='/project/:id' component={Project} />
    </Switch>

)