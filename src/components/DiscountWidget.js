import React, {Component} from 'react';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import './DiscountWidget.css';

const SERVICE_URL = 'http://localhost:8080'

export default class DiscountWidget extends Component {
    // fetch(`http://localhost:8080/inventory?access_token=${event.data.accessToken}&shop=${event.data.shop}`)
    //     .then(res => res.json())
    //     .then(res => {
    //         console.log('Inventory response', res);
    //     })

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            price: '',
            compare_at_price: null,
            inventory: '',
            imageURL: '',
            discount: 15
        }
    }

    componentDidUpdate(prevProps) {
        // new access token indicates refreshing data
        if (!prevProps.accessToken && this.props.accessToken) {
            const {accessToken, shop} = this.props;

            fetch(`${SERVICE_URL}/inventory?access_token=${accessToken}&shop=${shop}`)
                .then(res => res.json())
                .then(res => {
                    const {title, price, inventory, imageURL, id} = res;
                    this.setState({
                        title, price, inventory, imageURL, id
                    });
                })
        }
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
        console.log('DISCOUNTING');
        const { id, price } = this.state;
        const { accessToken, shop } = this.props;
        fetch(`${SERVICE_URL}/discount`, {
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
    }

    render() {
        const {connected} = this.props;
        const {title, price, inventory, imageURL, discount} = this.state;
        return connected ? (
            <div className={'discount-widget'}>
                <p>We noticed you have {inventory} {title}(s) in your inventory.
                    Improve cash flow by discounting this product</p>
                <div className={'slider-container'}>
                    <Typography id="label">Discount</Typography>
                    <p className={'discount'}>{discount}</p>
                    <Slider
                        id={'slider'}
                        value={discount}
                        aria-labelledby="label"
                        onChange={this.handleSliderChange.bind(this)}
                    />
                </div>
                <div className={'discount-widget__summary'}>
                    <img src={imageURL}/>
                    <div className={'discount-widget__summary-items'}>
                        <p>In Stock</p>
                        <p>{inventory}</p>
                        <p className={'price'}>Price</p>
                        <p className={'original-price'}>{price}</p>
                        <p>{this.getDiscount.call(this)}</p>
                    </div>
                </div>
                <div className={'discount-widget__summary-description'}>
                    <p>At this price you need to sell</p>
                    <p>15 units</p>
                    <p>to maintain a positive cash flow</p>
                </div>
                <div className={'discount-widget__button-container'}>
                    <Button variant="contained" color="primary"
                            id={'button'}
                            onClick={this.discount.bind(this)}>
                        Discount Item
                    </Button>
                </div>
            </div>
        ) : null
    }
}