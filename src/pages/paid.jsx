import React, { Component } from 'react';
import * as eng from '../providers/engine';

export default class Paid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res: [], data: [], loading: true
        };
    }

    componentDidMount() {
        this.data();
    }

    data = () => {
        this.setState({ loading: true });
        eng.postData('sirjava&genesis=sirjava&case=list').then((res) => {
            this.setState({ loading: false, res: res, data: res.result });
        });
    }



    render() {
        const { data, loading } = this.state;
        return (
            <React.Fragment>
                <div className="container">
                    <p>&nbsp;</p>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped datatables">
                            <thead>
                                <tr>
                                    <th colSpan="2">Code</th>
                                    <th>Personal Details</th>
                                    {/* <th>Amount</th> */}
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading === true ? <tr><td colSpan="15" align="center">loading data...</td></tr> : ''}
                                {/* {loading === false ? <tr><td colSpan="15">Total GHS: {res.ghs} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Total NGN: {res.ngn} </td></tr> : ''} */}
                                {data.map(val => {
                                    return <tr key={val.id}>
                                        <td>
                                            {val.status === '1' ?
                                                <span className="label label-success"><i className="fa fa-check"></i> PAID</span> :
                                                <span className="label label-warning"><i className="fa fa-close"></i> UNPAID</span>
                                            }
                                        </td>
                                        <td>{val.code}</td>
                                        <td>
                                            <b>Full name:</b> {val.firstname} {val.lastname} <br />
                                            <b>Max ID:</b> {val.maxid} <br />
                                            <b>Phone number:</b> {val.phone} <br />
                                            <b>Email:</b> {val.email}
                                        </td>
                                        {/* <td>{val.currency}{val.amount}</td> */}
                                        <td>{val.crdate}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="hide" id="countdown"></div>
            </React.Fragment>
        );
    }

}