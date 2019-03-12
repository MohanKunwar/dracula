import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from '../../components/user/Login';
import Register from '../../components/user/Register';

class KhozContainer extends Component {

    render() {
        const currUrl = this.props.match.url
        return (
            <div className='khoz-container'>
            <Switch>
                <Route path={`${currUrl}/login`} component={Login} />
                <Route path={`${currUrl}/register`} component={Register} />
                <Redirect to={`${currUrl}/login`} />
            </Switch>
            <div className='right-img'>

            </div>
            </div>
        );
    }
}
export default KhozContainer;