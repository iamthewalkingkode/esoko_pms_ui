import React, { Component } from 'react';
import axios from 'axios';
import * as eng from '../providers/engine';
import $ from 'jquery';

export default class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 100, country: 'GH', currency: 'GHS', volume: '1',
            // firstname: 'Emmanuel', lastname: 'Anyele', maxid: '676036', email: 'maysdelmundo@ymail.com', phone: '026298871',
            // momo: '0249567265', voucher: '', ticket: 'weferw', channel: 'mtn',
            firstname: '', lastname: '', maxid: '', email: '', phone: '',
            momo: '', voucher: '', ticket: '', channel: '', paid: 350, limit: 350
        };
    }

    componentDidMount() {
        this.getGeoInfo();
        this.paid();
    }

    speakers = [
        { name: 'Dr. Bright Kyei Wiredu', rank: 'Crown Diamond', image: 'bright_wiredu' },
        { name: 'Nana Ama Kyei Wiredu', rank: 'Crown Diamond', image: 'nana_ama' },
        { name: 'Dr. Kelvin Owusu', rank: 'Double Diamond', image: 'kelvin_owusu' },
        { name: 'Sir Java Evans', rank: 'Double Diamond', image: 'sirjava' },
        // {name:'Akosua Manu', rank:'Diamond', image:'akosua_manu'},
        { name: 'Isaac Akpor-Adjei', rank: 'Diamond', image: 'isaac_akpor' },
        { name: 'Mathew Nketiah', rank: 'Diamond', image: 'mathew_nketiah' },
        { name: 'Paul Nyamekye', rank: 'Diamond', image: 'paul_nyamekye' },
        { name: 'Bernard Frimpong', rank: 'Diamond', image: 'bernard_frimpong' },
        { name: 'Godfred Opoku', rank: 'Diamond', image: 'godfred_opoku' }
    ];

    networks = [
        { code: 'mtn', name: 'MTN Mobile Money' },
        { code: 'airtel', name: 'Airtel Money' },
        { code: 'tigo', name: 'Tigo Cash' },
        { code: 'vodafone', name: 'Vodafone Cash' }
    ];

    paid = () => {
        this.setState({ loading: true });
        eng.postData('sirjava&genesis=sirjava&case=count').then((res) => {
            this.setState({ paid: Number(res.result) });
        });
    }

    formChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getGeoInfo = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            let geo = response.data;
            if (geo.country === 'NG') {
                this.setState({ country: 'NG', currency: 'NGN', amount: 7000 });
            }
        });
    }

    reserve = (e) => {
        e.preventDefault();
        $('input').attr('disabled', true);
        $('#submit').html('<i class="fa fa-spin fa-spinner"></i> please wait ...').attr('disabled', true);
        eng.postData('sirjava&genesis=sirjava&case=save', this.state).then((res) => {
            this.stap();
            if (typeof res === 'object') {
                if (res.status === 200) {
                    this.purchase(res.ticket);
                    this.setState({ ticket: res.ticket });
                } else {
                    window.showSwal('warning', res.result);
                }
            } else { this.stap(); window.showSwal('warning', '34: Reservation failed'); }
        });
    }

    purchase = (ticket) => {
        const { firstname, lastname, email, amount, phone, volume, country, currency } = this.state;
        const self = this;
        switch (country) {
            default:
                window.$('#momo').modal('show');
                break;
            case 'NG':
                window.getpaidSetup({
                    PBFPubKey: 'FLWPUBK-37fdbfad518b17a2edca6d139e55490b-X',
                    customer_email: email,
                    customer_firstname: firstname + ' ' + lastname,

                    custom_logo: 'https://scontent-sjc3-1.cdninstagram.com/vp/12fbecf243e8519df036d3f752927035/5D14A6B7/t51.2885-19/s320x320/42368266_256787678356946_3454296528061988864_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com',
                    custom_title: 'Leadership Summit 2019',
                    custom_description: 'Reservation',

                    amount: amount * volume,
                    // subaccounts: [{ id: 'RS_ACD9D35DAAA7D85562C4867CB14470AE' }],
                    country: country, currency: currency,
                    txref: ticket,
                    onclose: function () {
                        self.stap();
                    },
                    callback: function (response) {
                        $('input').attr('disabled', false);
                        $('#form #submit').html('RESERVE').attr('disabled', false);
                        // let flw_ref = response.tx.flwRef;
                        console.log(response);
                        const tx = response.tx ? response.tx : { chargeResponseCode: '100' };
                        if (tx.chargeResponseCode === '00' || tx.chargeResponseCode === '0') {
                            let data = { ticket: ticket, email: email, phone: phone, firstname: firstname, lastname: lastname, amount: amount, volume: volume, currency: currency };
                            eng.postData('sirjava&genesis=sirjava&case=paid', data).then((res) => {
                                if (typeof res === 'object') {
                                    if (res.status === 200) {
                                        self.stap();
                                        window.showSwal('success', 'Your payment was successful. A confirmation code has been sent to your email address and phone number which you will use to purchase a physical ticket');
                                    } else {
                                        self.stap();
                                    }
                                } else {
                                    self.stap();
                                }
                            });
                        } else {
                            self.stap();
                        }
                    }
                });
                break;
        }
    }

    payWithMomo = (e) => {
        e.preventDefault();
        $('input, select').attr('disabled', true);
        $('#momo #submit').html('<i class="fa fa-spin fa-spinner"></i> please wait ...').attr('disabled', true);
        eng.postData('sirjava&genesis=sirjava&case=momo', this.state).then((res) => {
            this.stap();
            if (typeof res === 'object') {
                if (res.result.ResponseCode === '0001') {
                    $('#momo #forms').hide();
                    $('#momo #ajax').show().html(res.process);
                } else {
                    window.showSwal('warning', res.result);
                }
            } else { window.showSwal('warning', 'Payment failed'); }
        });
    }

    stap = () => {
        $('input, select').attr('disabled', false);
        $('#form #submit, #momo #submit').html('RESERVE').attr('disabled', false);
    }

    render() {
        const { firstname, lastname, maxid, email, phone, amount, volume, currency, channel, limit, paid } = this.state;
        const { action } = this.props.params;
        return (
            <React.Fragment>
                <div className={'overlay ' + ((action === 'private') ? 'hide' : '')}>
                    <div className="containers" style={{ padding: 0 }}>
                        <img className="banner img-thumbnail no" src="/assets/img/banner.jpg" alt="Leadership Summit 2019 - SirJava Official" />
                    </div>
                </div>

                <div id="venu" className={'hidden-xss hidden-sms ' + ((action === 'private') ? 'hide' : '')}>
                    <div className="container">
                        <div className="text-center">
                            <div className="row">
                                <div className="col-lg-4 col-xs-3"></div>
                                <div className="col-lg-4 col-xs-6">
                                    <div id="countdown" className="row">
                                        <div className="col-lg-3 col-xs-3"><div>00</div> <small>days</small></div>
                                        <div className="col-lg-3 col-xs-3"><div>00</div> <small>hours</small></div>
                                        <div className="col-lg-3 col-xs-3"><div>00</div> <small>minutes</small></div>
                                        <div className="col-lg-3 col-xs-3"><div>00</div> <small>seconds</small></div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-xs-3"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overlay">
                    <div className="container" style={{ background: '#fff', padding: 50 }}>
                        <div className="text-center">
                            <h1><span className="text-warning">Leadership</span> Conference 2019 - <span className="text-warning">Kumasi City</span></h1>
                            <div className="box yellow">
                                Exclusive to Max International Associates. 600 Seats Limited
                            </div>
                            <p>&nbsp;</p>
                            <div className="row">
                                <div className="col-lg-4"></div>
                                <div className="col-lg-4">
                                <div className="alert alert-danger animated infinite flash slow">
                                        <b style={{ fontSize: '25px' }}>TICKETS SOLD OUT</b>
                                    </div>
                                </div>
                                <div className="col-lg-4"></div>
                            </div>
                        </div>

                        <div className={'row ' + ((action === 'private') ? 'hide' : '')}>
                            <div className="col-12"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div>
                            <div className="col-2 col-md-2 col-lg-2"></div>
                            <div className="col-xs-12 col-md-4 col-sm-6 col-lg-4">
                                <div className="speaker wow animated fadeInDown" style={{ padding: 15 }}>
                                    <h3><i className="fa fa-map-marker fa-2x text-warning"></i></h3>
                                    <b>VENUE</b>
                                    <p>College of Science Auditorium <br /> KNUST Kumasi</p>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-4 col-sm-6 col-lg-4">
                                <div className="speaker wow animated fadeInDown" style={{ padding: 15 }}>
                                    <h3><i className="fa fa-calendar fa-2x text-warning"></i></h3>
                                    <b>DATE</b>
                                    <p>Saturday 6th July <br />
                                        Events starts @ 8:30am</p>
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2"></div>
                        </div>


                        {/* F O R M */}
                        {limit > paid || action === 'private' ? <div className="row">
                        {action !== 'private' ? <div className="col-12"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div> : ''}
                            <div className="col-xs-12 text-center">
                                {action !== 'private' ? <h3>Reserve your <span className="text-warning">Ticket</span></h3> : ''}
                                {action !== 'private' ? <p>
                                    Early Bird Purchase (May) Price: <b className="text-warning">{currency} {amount * volume}</b> <br />
                                    <small className="text-muted"><i>(Depending on your Country you May Pay additional charges as Tax)</i></small>
                                </p> : ''}
                                <p>&nbsp;</p>
                                <div className="row">
                                    <div className="col-lg-4"></div>
                                    <div className="col-lg-4">
                                        {action !== 'private' ? <div className="alert alert-warning animated infinite heartBeat">
                                            <b style={{ fontSize: '25px' }}>{limit - paid} Seats Left</b>
                                        </div> : ''}
                                    </div>
                                    <div className="col-lg-4"></div>
                                </div>
                                <p>&nbsp;</p>
                            </div>
                            <div className="col-xs-3 col-lg-3">
                                {/* <iframe src="https://drive.google.com/drive/folders/1vSv7mxqQRuJ981Vo_l6NZU-2o-ZmjyCd"></iframe> */}
                            </div>
                            <div className="col-xs-12 col-lg-6">
                                <form id="form" className=" wow animated fadeInLeft" method="post" autoComplete="off" autoCorrect="off" action="/" onSubmit={this.reserve}>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" requiredd placeholder="* Enter your First name" name="firstname" value={firstname} onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" requiredd placeholder="* Enter your Last name" name="lastname" value={lastname} onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" requiredd placeholder="* Enter your Max ID" name="maxid" value={maxid} onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-lg" requiredd placeholder="* Enter your Email address" name="email" value={email} onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" requiredd placeholder="* Enter your Mobile number with country code" value={phone} name="phone" onChange={this.formChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" requiredd placeholder="* How many tickets are you buying?" value={volume} name="volume" onChange={this.formChange} />
                                        <small className="text-muted">How many tickets are you buying?</small>
                                    </div>
                                    <div className="form-group text-center">
                                        <button id="submit" className="btn btn-lg btn-warning btn-block">RESERVE</button>
                                        <small className="text-muted">* I understand the seats are limited</small>
                                    </div>
                                </form>
                            </div>
                            <div className="col-xs-3 col-lg-3"></div>
                        </div> : ''}

                        {/* {limit <= paid?<div className="alert alert-danger">
                            Seats as full. We can not take any more orders
                        </div>:''} */}

                        <div className={'row ' + ((action === 'private') ? 'hide' : '')}>
                            <div className="col-12"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div>
                            <div className="col-xs-12 text-center">
                                <h2><span className="text-warning">Topics</span> To be treated</h2>
                                <p>&nbsp;</p>
                            </div>
                            <div className="col-2 col-lg-2"></div>
                            <div className="col-xs-12 col-lg-4">
                                <ul>
                                    <li>What We do Inside of Network Marketing</li>
                                    <li>Team &amp; Business Investments</li>
                                    <li>Handling Objects on Product Sales</li>
                                    <li>Confidence &amp; Self Esteem</li>
                                    <li>The Journey of Personal Development</li>
                                </ul>
                            </div>
                            <div className="col-xs-12 col-lg-4">
                                <ul>
                                    <li>Performance &amp; Productivity</li>
                                    <li>Responsibility &amp; Commitment to Business Growth</li>
                                    <li>Emotional Intelligence (Attitude and Mindset)</li>
                                    <li>Handling Objections as a Leader</li>
                                </ul>
                            </div>
                            <div className="col-2 col-lg-2"></div>
                        </div>
                    </div>
                </div>

                <div id="venu" className={'hidden-md hidden-lg ' + ((action === 'private') ? 'hide' : '')}>
                    <div className="container">
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-2"></div>
                            <div className="col-xs-12 col-md-4 col-sm-6 col-lg-4">
                                <div className="row">
                                    <div className="col-xs-12 col-md-2 col-lg-2">
                                        <h3><i className="fa fa-map-marker fa-2x"></i></h3>
                                    </div>
                                    <div className="col-xs-12 col-md-10 col-lg-10">
                                        <h3><b>College of Science</b></h3>
                                        <p className="text-muted">Auditorium KNUST Kumasi</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-4 col-sm-6 col-lg-4">
                                <div className="row">
                                    <div className="col-xs-12 col-md-2 col-lg-2">
                                        <h3><i className="fa fa-calendar fa-2x"></i></h3>
                                    </div>
                                    <div className="col-xs-12 col-md-10 col-lg-10">
                                        <h3><b>Tuesday 6th July</b></h3>
                                        <p className="text-muted">Events starts @ 8:30am</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2"></div>
                        </div>
                    </div>
                </div>


                <div className={'overlays ' + ((action === 'private') ? 'hide' : '')} style={{ background: '#f6f6f6' }}>
                    <div className="container text-center" style={{ padding: 50 }}>
                        <h2>Our <span className="text-warning">Speakers</span></h2>
                        <p>&nbsp;</p>
                        <div className="row">
                            {this.speakers.map(sp => {
                                return <div key={sp.image} className="col-xs-12 col-md-6 col-sm-6 col-lg-3">
                                    <div className="speaker wow animated fadeInDown">
                                        <img className="img-thumbnail no" src={'/assets/img/speakers/' + sp.image + '.jpg'} alt={sp.name} />
                                        <div className="details">
                                            <b>{sp.name}</b> <br />
                                            <small className="text-muted"><i>{sp.rank}</i></small>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>

                <div className={'footer ' + ((action === 'private') ? 'hide' : '')}>
                    <div className="container" style={{ padding: 50 }}>
                        <div className="row">
                            <div className="col-xs-12 col-lg-4">
                                <b>MORE DETAILS</b> <br /> <br />
                                Email: <a href="mailto:sirjavagroup@gmail.com">sirjavagroup@gmail.com</a> <br />
                                WhatsApp: <a href="https://wa.me/233556513213" target="_blank" rel="noopener noreferrer">+233 (0) 55 651 3213</a>
                                <p>&nbsp;</p>
                            </div>
                            <div className="col-xs-12 col-lg-4">
                                <b>HOTEL BOOKING</b> <br /> <br />
                                Mr Chris: <a href="tel:+233 (0) 209750507">+233 (0) 50 279 9375</a>
                                <p>&nbsp;</p>
                            </div>
                            <div className="col-xs-12 col-lg-4">
                                <b>RSVP</b> <br /> <br />
                                Lydia: <a href="tel:+233 (0) 20 509 2332">+233 (0) 20 509 2332</a> <br />
                                Kernel: <a href="tel:+233 (0) 26 933 9905">+233 (0) 26 933 9905</a> <br />
                                Vicky: <a href="tel:+233 (0) 20 509 2332">+233 (0) 20 509 2332</a>
                                <p>&nbsp;</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="momo" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" aria-hidden="true">
                    <div className="modal-dialog modal-sms" style={{ maxWidth: '500px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title mt-0" id="myModalLabel"><b>Pay with Mobile Money</b></h4>
                            </div>
                            <div className="modal-body">
                                <form id="forms" method="post" autoComplete="off" autoCorrect="off" action="/" onSubmit={this.payWithMomo}>
                                    <div className="form-group">
                                        <select className="form-control form-control-lg" required name="channel" onChange={this.formChange}>
                                            <option value="">Select payment Network</option>
                                            {this.networks.map(ntw => {
                                                return <option key={ntw.code} value={ntw.code}>{ntw.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className={'form-group ' + ((channel !== 'vodafone') ? 'hide' : '')}>
                                        <input type="text" className='form-control form-control-lg' placeholder="* Vodafone Voucher Code" name="voucher" onChange={this.formChange} />
                                        <small className="text-muted">Dial <b>*110#</b> and select menu item 6 to create the voucher</small>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" required placeholder="* Enter your mobile money number" name="momo" onChange={this.formChange} />
                                    </div>
                                    <div className="form-group text-center">
                                        <button id="submit" className="btn btn-lg btn-success btn-block">Pay GHS{amount * volume}</button>
                                    </div>
                                </form>
                                <div className="alert alert-warning" id="ajax" style={{ display: 'none' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}