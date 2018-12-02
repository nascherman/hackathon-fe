import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

export default class AuthorizeForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { connected } = this.props;

        return (
            <div className={'authorize-form'}>
                <h1>Consent to authorize your Shopify app with CIBC</h1>
                <Button variant="contained" color="primary"
                        className={'consent-button'}
                        onClick={this.handleConnection.bind(this)}
                        disabled={connected}>
                    Connect
                </Button>
                <p className={'disclaimer'}>By authorizing I agree to the terms and conditions</p>
            </div>
        );
    }

    handleConnection() {
        const params = new URLSearchParams(window.location.search);

        const shop = params.get('shop');

        fetch(`http://localhost:8080/install?shop=${shop}`)
            .then(res => res.text())
            .then(res => {
                window.open(res, '_blank');
            })
    }

    toggleConnection() {
        this.setState(({connected}) => ({connected: !connected}));
    }

    // accountConnectionMarkup() {
    //     return this.state.connected
    //         ? (
    //             <AccountConnection
    //                 avatarUrl="https://gravatar.com/avatar/57dde0bd2de4350c196d9fb235703b83?s=200"
    //                 accountName="Dominic McPhee"
    //                 details="craigmont.myshopify.com"
    //                 action={{content: 'Disconnect', onAction: this.toggleConnection.bind(this, this.state)}}
    //                 connected={this.state.connected}
    //             />
    //         ) : (
    //             <AccountConnection
    //                 title="CIBC"
    //                 action={{content: 'Connect', onAction: this.handleConnection.bind(this, this.state)}}
    //                 details="No account connected"
    //                 termsOfService={<p>By clicking Connect, you agree to accept CIBC’s <Link url="https://shopify.com">Terms and conditions</Link>. You’ll pay a commission rate of 15% on sales made through CIBC.</p>}
    //                 connected={this.state.connected}
    //             />
    //         )
    // }
}