import React, {Component} from 'react';

import logo from './logo.svg';

import AuthorizeForm from './components/AuthorizeForm';
import ShortFallWidget from './components/ShortFallWidget';
import DiscountWidget from './components/DiscountWidget';

import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

class App extends Component {
    constructor(props) {
        super(props);

        const accessToken = window.localStorage.getItem('accessToken');
        const shop = window.localStorage.getItem('shop');

        this.state = {
            title: 'Team 13 App',
            connected: accessToken && shop ? true : false,
            predictedBalance: -500,
            accessToken: accessToken,
            shop: shop
        };

        window.addEventListener('message', this.handleMessage.bind(this),
            false);
    }

    handleMessage(event) {
        if (event.data.accessToken) {
            window.localStorage.setItem(
                'accessToken',
                event.data.accessToken
            );
            window.localStorage.setItem(
                'shop',
                event.data.shop
            );

            this.setState({
                accessToken: event.data.accessToken,
                shop: event.data.shop,
                connected: true
            });
        }
    }

    render() {
        const {
            title,
            connected,
            accessToken,
            shop,
            predictedBalance } = this.state;
        return (
            <div className={'app'}>
                <CssBaseline/>
                <Grid container spacing={24} className={'grid-item'}>
                    <Grid item xs={12}>
                        <div className={'app-title'}>
                            <h1>{title}</h1>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <ShortFallWidget
                            accessToken={accessToken}
                            predictedBalance={predictedBalance}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DiscountWidget
                            connected={connected}
                            accessToken={accessToken}
                            shop={shop}
                            predictedBalance={predictedBalance}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default App;
