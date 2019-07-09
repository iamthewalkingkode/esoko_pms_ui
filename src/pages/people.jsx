import React, { Component } from 'react';
import moment from 'moment';
import * as eng from '../providers/engine';

export default class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '', name: '', msg: '', status: '',
            data: [], groups:[], loading: true
        };
    }

    componentDidMount() {
        window.$('.datepickers').datepicker({
            showAnim: 'clip',
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy-mm-dd',
            dateFormat: 'yy-mm-dd'
        });
        this.loadPeople();
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

    loadPeople() {
        this.setState({ loading: true });
        eng.postData('people').then((res) => {
            if (typeof res === 'object') {
                this.setState({ loading: false });
                if (res.status === 200) {
                    this.setState({ data: res.result });
                } else {
                    this.setState({ data: [] });
                }
            }
        });
    }

    formChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    modal = (id) => {
        this.setState({ id: id });
        window.$('#pep_' + id).modal('show');
    }

    assignModal = () => {
        window.$('#ass').modal('show');
    }

    __save = (e) => {
        e.preventDefault();
        const { id } = this.state;
        let div = '#pep_' + id;
        window.$(div).find('input').attr('disabled', true);
        window.$(div + ' #submit').attr('disabled', true).html('<i className="fa fa-spin fa-spinner"></i>  submiting ...');
        eng.postData('people/save', this.state).then((res) => {
            window.$(div).find('input').attr('disabled', false);
            window.$(div + ' #submit').attr('disabled', false).html('&nbsp;&nbsp;&nbsp; Save &nbsp;&nbsp;&nbsp;');
            if (typeof res === 'object') {
                if (res.status === 200) {
                    this.loadPeople();
                    this.setState({ status: 'success', msg: res.result });
                    window.$(div + ' form').trigger('reset');
                    window.$(div).modal('hide');
                } else {
                    this.setState({ status: 'warning', msg: res.result });
                }
            } else {
                this.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
            }
        });
    }

    __update = (e) => {
        e.preventDefault();
        const { id } = this.state;
        let div = '#pep_' + id;
        window.$(div).find('input').attr('disabled', true);
        window.$(div + ' #submit').attr('disabled', true).html('<i className="fa fa-spin fa-spinner"></i>  submiting ...');
        eng.postData('people/update', this.state).then((res) => {
            window.$(div).find('input').attr('disabled', false);
            window.$(div + ' #submit').attr('disabled', false).html('&nbsp;&nbsp;&nbsp; Update &nbsp;&nbsp;&nbsp;');
            if (typeof res === 'object') {
                if (res.status === 200) {
                    this.loadPeople();
                    this.setState({ status: 'success', msg: res.result });
                    window.$(div).modal('hide');
                } else {
                    this.setState({ status: 'warning', msg: res.result });
                }
            } else {
                this.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
            }
        });
    }

    __delete = (id) => {
        let self = this;
        window.swal({
            title: 'Warning',
            text: 'Action is irreversible',
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Yes, Delete!',
            closeOnConfirm: true
        }, function () {
            eng.postData('people/delete', { id: id }).then((res) => {
                if (typeof res === 'object') {
                    if (res.status === 200) {
                        self.loadPeople();
                        self.setState({ status: 'success', msg: res.result });
                    } else {
                        self.setState({ status: 'warning', msg: res.result });
                    }
                } else {
                    self.setState({ status: 'danger', msg: 'OMG!! Something bad happened' });
                }
            });
        });
    }

    render() {
        const { data, msg, status, groups } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-12">
                        <p className="page-header" style={{ border: '0px' }}></p>
                        <ol className="breadcrumb">
                            <li>
                                <i className="fa fa-desktop"></i> <a href="/">Dashboard</a>
                            </li>
                            <li className="active">
                                Manage people
                            </li>
                        </ol>
                    </div>
                </div>
                {eng.alertMsg(status, msg)}
                <div className="row">
                    <div className="col-lg-12">
                        <button className="btn btn-xs btn-primary" onClick={() => this.modal('add')}><i className="fa fa-plus"></i> Create people</button>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th colSpan="2">Full name</th>
                                        <th>Age</th>
                                        <th>Details</th>
                                        <th>Comments</th>
                                        <th>Date added</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.__loading()}
                                    {this.__empty()}
                                    {
                                        data.map(pep => {
                                            return <tr key={pep._id}>
                                                <td width="5%"><img src={'assets/' + pep.profile_pic} alt={pep.full_name} className="img-thumbnail" /></td>
                                                <td>{pep.full_name}</td>
                                                <td>{pep.age} yrs old</td>
                                                <td>
                                                Email: {pep.email} <br/>
                                                Phone no.: 0{pep.phone_no} <br/>
                                                Address: {pep.address} <br/>
                                                Occupation: {pep.occupation} <br/>
                                                Hobbies: {pep.hobbies}<br/>
                                                </td>
                                                <td>{pep.comments}</td>
                                                <td>{moment(pep.crdate).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                <td width="10%">
                                                    <button className="btn btn-xs btn-info" onClick={() => this.modal(pep._id)}><i className="fa fa-edit"></i> Edit</button>
                                                    <button className="btn btn-xs btn-danger" onClick={() => this.__delete(pep._id)}><i className="fa fa-times"></i> Delete</button>
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
                    data.map(pep => {
                        return <div key={pep._id} id={'pep_' + pep._id} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lsgs">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title mt-0" id="myModalLabel">Edit group</h5>
                                    </div>
                                    <div className="modal-body">
                                        {eng.alertMsg(status, msg)}
                                        <form method="post" autoComplete="off" className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>First name</label>
                                                    <input name="first_name" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.first_name} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Last name</label>
                                                    <input name="last_name" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.last_name} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Date of birth</label>
                                                    <input name="date_of_birth" type="text" className="form-control datepicker" onChange={this.formChange} defaultValue={moment(pep.date_of_birth).format('YYYY-MM-DD')} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Email address</label>
                                                    <input name="email" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.email} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Phone no.</label>
                                                    <input name="phone_no" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.phone_no} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Home address</label>
                                                    <input name="address" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.address} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Occupation</label>
                                                    <input name="occupation" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.occupation} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Hobbies</label>
                                                    <input name="hobbies" type="text" className="form-control" onChange={this.formChange} defaultValue={pep.hobbies} />
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>Comments</label>
                                                    <textarea name="comments" rows="6" className="form-control" onChange={this.formChange} defaultValue={pep.comments}></textarea>
                                                </div>
                                            </div>
                                        </form>
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

                <div id="pep_add" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lsgs">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">Create people</h5>
                            </div>
                            <div className="modal-body">
                                {eng.alertMsg(status, msg)}
                                <form method="post" autoComplete="off" className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>First name</label>
                                            <input name="first_name" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Last name</label>
                                            <input name="last_name" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Date of birth</label>
                                            <input name="date_of_birth" type="text" className="form-control datepicker" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input name="email" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Phone no.</label>
                                            <input name="phone_no" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Home address</label>
                                            <input name="address" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Occupation</label>
                                            <input name="occupation" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Hobbies</label>
                                            <input name="hobbies" type="text" className="form-control" onChange={this.formChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Comments</label>
                                            <textarea name="comments" rows="6" className="form-control" onChange={this.formChange} ></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">&nbsp;&nbsp;&nbsp; Close &nbsp;&nbsp;&nbsp;</button>
                                <button id="submit" className="btn btn-primary pull-right" onClick={this.__save}>&nbsp;&nbsp;&nbsp; Save &nbsp;&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="ass" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lsgs">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">Assign group</h5>
                            </div>
                            <div className="modal-body">
                                {eng.alertMsg(status, msg)}
                                <form method="post" autoComplete="off" className="row">
                                    {
                                        groups.map(grp => {
                                            return <div className="form-group"><label key={grp._id}><input type="radio" value={grp._id} name="group" /> {grp.name}</label></div>
                                        })
                                    }
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">&nbsp;&nbsp;&nbsp; Close &nbsp;&nbsp;&nbsp;</button>
                                <button id="submit" className="btn btn-primary pull-right" onClick={this.__saveAssign}>&nbsp;&nbsp;&nbsp; Save &nbsp;&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}