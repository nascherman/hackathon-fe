import React, {Component} from 'react';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import './DiscountWidget.css';

const { SHOPIFY_SERVICE_URL } = require('../config/config');

export default class DiscountWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            price: '',
            compare_at_price: null,
            inventory: '',
            imageURL: '',
            discount: 15,
            discounted: false
        };

        if(this.props.accessToken) {
            this.fetchInventory(this.props.accessToken, this.props.shop);
        }
    }

    componentDidUpdate(prevProps) {
        // new access token indicates refreshing data
        if (!prevProps.accessToken && this.props.accessToken) {
            const {accessToken, shop} = this.props;

            this.fetchInventory(accessToken, shop);
        }
    }

    fetchInventory(accessToken, shop) {
        fetch(`${SHOPIFY_SERVICE_URL}/inventory?access_token=${accessToken}&shop=${shop}`)
            .then(res => res.json())
            .then(res => {
                const {title, price, inventory, imageURL, id} = res;
                this.setState({
                    title, price, inventory, imageURL, id
                });
            })
    }

    handleSliderChange(event, value) {
        this.setState({
            discount: value.toFixed(0)
        })
    }

    getDiscount() {
        const { price, discount } = this.state;
        return (price * ((100 - discount) / 100)).toFixed(2)
    }

    discount() {
        const { id, price } = this.state;
        const { accessToken, shop } = this.props;
        fetch(`${SHOPIFY_SERVICE_URL}/discount`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                compare_at_price: price,
                price: this.getDiscount.call(this),
                accessToken,
                shop
            })
        })
            .then(res => {
                if (res.status >= 400) {
                    throw new Error('Error in response, oops');
                } else {
                    return res;
                }
            })
            .then(res => res.json())
            .then(res => {
                // successful response
                this.setState({
                    discounted: true
                });
            })
    }

    // get number needed to sell from state
    getSellAmount() {
        const discountedPrice = this.getDiscount.call(this);
        const { predictedBalance } = this.props;

        // rough calculation
        return ((predictedBalance * -1) / discountedPrice).toFixed(0);
    }

    render() {
        const {connected} = this.props;
        const {
            title,
            price,
            inventory,
            imageURL,
            discount,
            sold,
            discounted
        } = this.state;

        return connected && !discounted ? (
            <div className={'discount-widget'}>
                <div className={'discount-widget__cta'}>
                    <Icon>highlight</Icon>
                    <p>We noticed you have {inventory} {title}(s) in your inventory.
                        Improve cash flow by discounting this product</p>
                    <p>Improve your cash flow by discounting this product</p>
                </div>
                <div className={'discount-widget__summary'}>
                    <div className={'discount-widget__summary-items'}>
                        <p className={'title'}>{title}</p>
                        <p className={'current-price'}>Current Price</p>
                        <p>{`$${price}`}</p>
                        <p className={'discounted-price'}>Discounted Price</p>
                        <p>{`$${this.getDiscount.call(this)}`}</p>
                    </div>
                    <div className="discount-widget__summary-image">
                        <div>
                            <p>{`-${discount}%`}</p>
                        </div>
                        <img src={imageURL} alt={title}/>
                    </div>
                </div>
                <Slider
                    id={'slider'}
                    value={parseInt(discount)}
                    aria-labelledby="label"
                    onChange={this.handleSliderChange.bind(this)}
                />
                <div className={'slider-container'}>
                    <p>Units sold to maintain a positive balance</p>
                    <div>
                        <p>{sold || 0}</p>
                        <p>of {this.getSellAmount.call(this)}</p>
                    </div>
                </div>
                <div className={'discount-widget__button-container'}>
                    <Button variant="contained" color="primary"
                            id={'button'}
                            onClick={this.discount.bind(this)}>
                        Apply Discount
                    </Button>
                </div>
            </div>
        ) : connected && discounted ? (
            <div className={'discount-widget'}>
                <div className={'discount-widget__cta'}>
                    <Icon>notification_important</Icon>
                    <p>{title} has been discounted</p>
                </div>
                <div className={'discount-widget__summary discount-widget__summary--discounted'}>
                    <div className={'discount-widget__summary-items discount-widget__summary-items--discounted'}>
                        <p className={'title'}>{title}</p>
                        <div>
                            <p>{`$${this.getDiscount.call(this)}`}</p>
                            <p>{`$${price}`}</p>
                        </div>
                        <p>{inventory} in stock</p>
                    </div>
                    <div className="discount-widget__summary-image">
                        <img src={imageURL} alt={title}/>
                    </div>
                </div>
            </div>
        ) : null;
    }
}