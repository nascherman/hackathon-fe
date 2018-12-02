import React, { Component } from 'react';

import './ShortFallWidget.css';
import Icon from "@material-ui/core/Icon";
import AuthorizeForm from './AuthorizeForm';

export default class ShortFallWidget extends Component {
    constructor(props) {
        super(props);
    }


    formatPredictedBalance() {
        const { predictedBalance } = this.props;

        return predictedBalance > 0 ?
            `$${predictedBalance.toFixed(2)}` :
            `(-$${predictedBalance.toFixed(2) * - 1})`
    }

    render() {
        const { predictedBalance, accessToken } = this.props;

        return (
            <div className={'shortfall-widget'}>
                <div className={'shortfall-widget__cta'}>
                    <Icon>notification_important</Icon>
                    <p>Based on your history, we predict a
                    shortfall in your cash flow next week.</p>
                </div>
                <div className={'shortfall-widget__balance'}>
                    <p>Predicted balance (next week)</p>
                    <div>
                        <p>{this.formatPredictedBalance.call(this)}</p>
                        <Icon>
                            {predictedBalance > 0 ?
                                'arrow_upward' :
                                'arrow_downward'}
                        </Icon>
                    </div>
                </div>
                <AuthorizeForm disabled={accessToken ? true : false} />
            </div>

        );
    }
}