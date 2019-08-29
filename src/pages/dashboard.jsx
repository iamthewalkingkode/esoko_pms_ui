import React, { Component } from 'react';
import * as eng from '../providers/engine';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: 0, groups: 0
        };
    }

    componentDidMount() {
        eng.postData('groups').then((res) => {
            if (typeof res === 'object') {
                if (res.status === 200) {
                    this.setState({ groups: res.result.length });
                }
            }
        });
        eng.postData('people').then((res) => {
            if (typeof res === 'object') {
                if (res.status === 200) {
                    this.setState({ people: res.result.length });
                }
            }
        });
    }

    render() {
        const { people, groups, msg, status } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-12">
                        <p className="page-header" style={{border:'0px'}}></p>
                        <ol className="breadcrumb">
                            <li className="active">
                                <i className="fa fa-desktop"></i> Dashboard
                            </li>
                        </ol>
                    </div>
                </div>
                {eng.alertMsg(status, msg)}
                <div className="row">
                    <div className="col-sm-3">
                        <div style={{borderRadius:'4px', border:'1px solid #eee', padding:'35px'}}>
                            <h4 className="text-success"><i className="fa fa-list fa-2xs"></i> Groups</h4>
                            <h4>{groups}</h4>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div style={{borderRadius:'4px', border:'1px solid #eee', padding:'35px'}}>
                            <h4 className="text-warning"><i className="fa fa-users fa-2xs"></i> People</h4>
                            <h4>{people}</h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}