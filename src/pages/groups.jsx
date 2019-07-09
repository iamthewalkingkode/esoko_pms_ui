import React, { Component } from 'react';
import * as eng from '../providers/engine';

export default class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '', name: '', msg: '', status: '',
            data: [], loading: true
        };
    }

    componentDidMount() {
        this.loadGroups();
    }

    __loading = () => {
        if (this.state.loading === true) {
            return <tr><td colSpan="15" align="center">loading data ...</td></tr>
        }
    }
    __empty = () => {
        if (this.state.loading === false && this.state.data.length === 0) {
            return <tr><td colSpan="15" align="center">No records found</td></tr>
        }
    }

    loadGroups() {
        this.setState({ loading: true });
        eng.postData('groups').then((res) => {
            if (typeof res === 'object') {
                this.setState({ loading: false });
                if (res.status === 200) {
                    this.setState({ data: res.result });
                }
            }
        });
    }
    

    formChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    modal = (id) => {
        this.setState({ id: id });
        window.$('#grp_' + id).modal('show');
    }

    __save = (e) => {
        e.preventDefault();
        const { id, name } = this.state;
        let div = '#grp_' + id;
        if (name) {
            window.$(div).find('input').attr('disabled', true);
            window.$(div + ' #submit').attr('disabled', true).html('<i className="fa fa-spin fa-spinner"></i>  submiting ...');
            eng.postData('groups/save', { id: id, name: this.state.name }).then((res) => {
                window.$(div).find('input').attr('disabled', false);
                window.$(div + ' #submit').attr('disabled', false).html('&nbsp;&nbsp;&nbsp; Save &nbsp;&nbsp;&nbsp;');
                if (typeof res === 'object') {
                    if (res.status === 200) {
                        this.loadGroups();
                        this.setState({ status: 'success', msg: res.result });
                        window.$(div).modal('hide');
                    } else {
                        this.setState({ status: 'warning', msg: res.result });
                    }
                } else {
                    this.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
                }
            });
        } else {
            window.$(div).modal('hide');
        }
    }

    __update = (e) => {
        e.preventDefault();
        const { id, name } = this.state;
        let div = '#grp_' + id;
        if (name) {
            window.$(div).find('input').attr('disabled', true);
            window.$(div + ' #submit').attr('disabled', true).html('<i className="fa fa-spin fa-spinner"></i>  submiting ...');
            eng.postData('groups/update', { id: id, name: this.state.name }).then((res) => {
                window.$(div).find('input').attr('disabled', false);
                window.$(div + ' #submit').attr('disabled', false).html('&nbsp;&nbsp;&nbsp; Update &nbsp;&nbsp;&nbsp;');
                if (typeof res === 'object') {
                    if (res.status === 200) {
                        this.loadGroups();
                        this.setState({ status: 'success', msg: res.result });
                        window.$(div).modal('hide');
                    } else {
                        this.setState({ status: 'warning', msg: res.result });
                    }
                } else {
                    this.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
                }
            });
        } else {
            window.$(div).modal('hide');
        }
    }

    render() {
        const { data, msg, status } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-12">
                        <p className="page-header" style={{border:'0px'}}></p>
                        <ol className="breadcrumb">
                            <li>
                                <i className="fa fa-desktop"></i> <a href="/">Dashboard</a>
                            </li>
                            <li className="active">
                                Manage groups
                            </li>
                        </ol>
                    </div>
                </div>
                {eng.alertMsg(status, msg)}
                <div className="row">
                    <div className="col-lg-12">
                    <button className="btn btn-xs btn-primary" onClick={() => this.modal('add')}><i className="fa fa-plus"></i> Create group</button>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.__loading()}
                                    {this.__empty()}
                                    {
                                        data.map(grp => {
                                            return <tr key={grp._id}>
                                                <td>{grp.name}</td>
                                                <td width="10%">
                                                    <button className="btn btn-xs btn-info" onClick={() => this.modal(grp._id)}><i className="fa fa-edit"></i> Edit</button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {
                    data.map(grp => {
                        return <div key={grp._id} id={'grp_' + grp._id} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lsgs">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title mt-0" id="myModalLabel">Edit group</h5>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Group name</label>
                                            <input name="name" type="text" className="form-control" onChange={this.formChange} defaultValue={grp.name} />
                                            <input name="id" type="hidden" value={grp._id} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-default pull-left" data-dismiss="modal">&nbsp;&nbsp;&nbsp; Close &nbsp;&nbsp;&nbsp;</button>
                                        <button id="submit" className="btn btn-primary pull-right" onClick={this.__update}>&nbsp;&nbsp;&nbsp; Update &nbsp;&nbsp;&nbsp;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }

                <div id="grp_add" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lsgs">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">Create group</h5>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Group name</label>
                                    <input name="name" type="text" className="form-control" onChange={this.formChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default pull-left" data-dismiss="modal">&nbsp;&nbsp;&nbsp; Close &nbsp;&nbsp;&nbsp;</button>
                                <button id="submit" className="btn btn-primary pull-right" onClick={this.__save}>&nbsp;&nbsp;&nbsp; Save &nbsp;&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}