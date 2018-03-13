import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../components/Login/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import Profile from '../components/Profile/Profile';
import GetInfo from '../components/GetInfo/GetInfo';
import CreateProject from '../components/CreateProject/CreateProject';
import Project from '../components/Project/Project';
import User from '../components/User/User';
import Requests from '../components/Requests/Requests';
import Collab from '../components/Collab/Collab';
import ProjectsPage from '../components/ProjectsPage/ProjectsPage';

export default (
    <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/profile' component={Profile} />
        <Route path='/user/:id' component={User} />
        <Route path='/info' component={GetInfo} />
        <Route path='/create' component={CreateProject} />
        <Route exact path='/project/:id' component={Project} />
        <Route path='/projects' component={ProjectsPage} />
        <Route path = '/collab/:id' component={Collab} />
        <Route path='/requests' component={Requests} />
    </Switch>

)