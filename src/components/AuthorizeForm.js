import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

const { SHOPIFY_SERVICE_URL } = require('../config/config');

export default class AuthorizeForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { connected, disabled } = this.props;

        return (
            <div className={'authorize-form'}>
                <Button variant="contained" color="primary"
                        className={'consent-button'}
                        onClick={this.handleConnection.bind(this)}
                        disabled={disabled}>
                    Connect
                </Button>
            </div>
        );
    }

    handleConnection() {
        const params = new URLSearchParams(window.location.search);

        const shop = params.get('shop');

        fetch(`${SHOPIFY_SERVICE_URL}/install?shop=${shop}`)
            .then(res => res.text())
            .then(res => {
                window.open(res, '_blank');
            })
    }
}