import React, { Component } from 'react';

import Event from './pages/event';
import List from './pages/list';
import Paid from './pages/paid';

export default class SirJava extends Component {

    params = this.props.match.params;

    render() {
        const action = this.params.action?this.params.action:'';
        switch(action) {
            case 'list':
                return (<List />);

            case 'paid':
                return (<Paid />);

            case 'private':
                return (<Event params={this.params} />);

            default:
                return (<Event params={this.params} />);
        }
    }
}