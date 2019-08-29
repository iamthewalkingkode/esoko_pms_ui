import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as eng from '../providers/engine';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '', status: '',
            username: '', password: ''
        };
    }

    formChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    __submit = (e) => {
        e.preventDefault();
        window.$('form').find('input').attr('disabled', true);
        window.$('button').attr('disabled', true).html('<i class="fa fa-spin fa-spinner"></i>  submiting ...');
        eng.postData('auth', this.state).then((res) => {
            window.$('form').find('input').attr('disabled', false);
            window.$('button').attr('disabled', false).html('&nbsp;&nbsp;&nbsp; Register &nbsp;&nbsp;&nbsp;');
            if (typeof res === 'object') {
                if (res.status === 200) {
                    eng.setStorage('userToken', res.token);
                    eng.setStorageJson('userData', res.result);
                    eng.alertMsgSet('success', 'You are now logged in');
                    eng.redirect('/');
                } else {
                    this.setState({ status: 'warning', msg: res.result });
                }
            } else {
                this.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
            }
        });
    }

    render() {
        const { status, msg } = this.state;
        return (
            <React.Fragment>
                <div id="wrapper">
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-3">
                            <div style={{ background: '#fff', padding: '20px', marginTop: '40%', borderRadius: '4px', textAlign: 'center' }}>
                                {eng.alertMsg(status, msg)}
                                <img src="assets/favicon.png" alt="Esoko PMS UI" width="50px" />
                                <p><h4>Esoko PMS UI</h4></p>
                                <p className="text-muted"><i>Login with your credentials to access this awesome App</i></p>
                                <p>&nbsp;</p> <p>&nbsp;</p>
                                <form method="post" action="#" autoComplete="off">
                                    <div className="form-group">
                                        {/* <label>Username</label> */}
                                        <input name="username" className="form-control form-control-lg" placeholder="Type your username here" onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        {/* <label>Username</label> */}
                                        <input name="password" type="password" className="form-control form-control-lg" placeholder="Type your password here" onChange={this.formChange} />
                                    </div>
                                    <p>&nbsp;</p>
                                    <div className="form-group">
                                        {/* <label>Password</label> */}
                                        <button className="btn btn-primary" onClick={this.__submit}>&nbsp;&nbsp;&nbsp; Login &nbsp;&nbsp;&nbsp;</button>
                                    </div>
                                </form>
                            </div>
                            <p>&nbsp;</p>
                            <p className="text-center"> <Link style={{color:'#fff'}} to="/register">Don't have an account? Create an now.</Link> </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}