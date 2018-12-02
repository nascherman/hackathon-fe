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

        this.state = {
            connected: false
        };

        window.addEventListener('message', this.handleMessage.bind(this),
            false);
    }

    handleMessage(event) {
        if (event.data.accessToken) {
            console.log('EVENT', event.data);

            this.setState({
                accessToken: event.data.accessToken,
                shop: event.data.shop,
                connected: true
            });
        }
    }

    render() {
        const { connected, accessToken, shop } = this.state;
        return (
            <div className={'app'}>
                <CssBaseline/>
                <Grid container spacing={24} className={'grid-item'}>
                    <Grid item xs={12}>
                        <AuthorizeForm connected={connected}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ShortFallWidget/>
                    </Grid>
                    <Grid item xs={12}>
                        <DiscountWidget
                            connected={connected}
                            accessToken={accessToken}
                            shop={shop}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default App;
