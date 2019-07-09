import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import * as eng from './providers/engine';

import Dashboard from './pages/dashboard';
import People from './pages/people';
import Groups from './pages/groups';
import Assign from './pages/assign';

export default class Esoko extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '', status: ''
        };
    }
    params = this.props.match.params;

    render() {
        eng.setStorageJson('route', this.params);
        const action = this.params.action ? this.params.action : 'index';
        if(action === 'logout') {
            eng.alertMsgSet('success', 'You are now logged out');
            eng.delStorage('userData');
            eng.delStorage('userToken');
            eng.redirect('./login');
        }else{
            return (
                <div id="wrapper">
                    <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="./">Esoko PMS UI</a>
                        </div>
                        <a className="navbar-brand pull-right" href="./logout"><i className="fa fa-fw fa-power-off"></i> Logout</a>
                        <div className="collapse navbar-collapse navbar-ex1-collapse">
                            <ul className="nav navbar-nav side-nav">
                                <li className={action === 'index' ? 'active' : ''}>
                                    <a href="/"><i className="fa fa-fw fa-desktop"></i> Dashboard</a>
                                </li>
                                <li className={action === 'people' ? 'active' : ''}>
                                    <a href="/people"><i className="fa fa-fw fa-users"></i> People</a>
                                </li>
                                <li className={action === 'groups' ? 'active' : ''}>
                                    <a href="/groups"><i className="fa fa-fw fa-list"></i> Groups</a>
                                </li>
                                <li className={action === 'assign' ? 'active' : ''}>
                                    <a href="/assign"><i className="fa fa-fw fa-link"></i> People / Groups</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
    
                    <div id="page-wrapper" style={{ minHeight: '1200px' }}>
                        <div className="container-fluid">
                            <Route exact path="/" component={Dashboard} />
                            <Route exact path="/people" component={People} />
                            <Route exact path="/groups" component={Groups} />
                            <Route exact path="/assign" component={Assign} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}