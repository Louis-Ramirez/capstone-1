import React, { Component, useState, useRef, useEffect } from "react";
// import Pagination from './Pagination';
import axios from "axios";
import "./styles/Payment.css";
import "react-toastify/dist/ReactToastify.css"; //notification layout (default green)

import ReactDOM from "react-dom";
import StripeCheckout from "react-stripe-checkout";
import { toast } from "react-toastify"; // notifaction

import itemChest from "../images/item_chest.png";
import PaymentSuccess from './PaymentSuccess';
import { format, parseISO } from 'date-fns';

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

toast.configure();

class Payment extends Component {
  constructor(props) {
    super(props);

    //console.log('recieved props for payment',props)
    // for test
    this.state = {
      id: '',
      name: '',
      lender: '',
      description: '',
      listing_type: '',
      insurance: '',
      return_date: '',
      greeting: '',
      click: false,
      payment_status: '',
      lendersearch: [],
      firstname: '',
      lastname: ''
    };

    // for listing
    // this.state = {
    //   // image: "",
    //   item_id: "",
    //   item_name: "",
    //   lender: "",
    //   item_description: "",
    //   type: "",
    //   price: "",
    //   return_by: "",
    //   policy: ""
    // }
  }


  async componentDidMount() {
    const userresponse = await axios.get('http://localhost:4000/profile/'+this.props.lenderid)
    console.log('user profile', userresponse)
    this.setState({ user: userresponse.data, isLoading: false })
    this.setState({
      firstname: userresponse.data.first_name,
      lastname: userresponse.data.last_name
  })
}

  onClickHandler(e) {
    e.preventDefault();
    this.setState({ click: true });
  }

  // componentDidMount() {
  //   let message;

  //   // axios.get("http://localhost:4000/payment").then((res) => {
  //   //   // message = res.data.greeting;
  //   //   // // console.log(message);
  //   //   // // this.state.greeting = message;
  //   //   // this.setState({ greeting: message })
  //   //   // console.log(res.data);
  //   // });
  // }

  // handleToken(token, addresses) {
  //   console.log({ token, addresses })
  // }

  render() {
    console.log('in render \n ',this.props)
    // this will get passed to stripe form
    // Stripe form takes care of everything else
    const product = {
      name: this.props.name,
      price: 4.50,
      description: this.props.description
    };

    // submits stripe payment for and returns 'success' or 'error' status
    async function handleToken(token) {
      // console.log({ token, addresses });
      const response = await axios.post('http://localhost:4000/payment/charge',
        {
        token,
        product
        }
      );
      const { status }  = response.data;
      // console.log(status);
      if (status === 'success') {
        toast('Success! Check email for details',
        { type: 'success' })
      } else {
        toast('Something went wrong',
        { type: 'error' })
      }
      // will require a POST to backend and marking listing paid for + unavailable
    }

    if(this.state.firstname == ''){
      this.state.firstname = 'Merge with'
      this.state.lastname = 'Dynamic Profile Needed'
      console.log('no merge yet with dynamic profile')
    }
    return (
      <div className="containerParent">
        <div className="container">
          <h1 className="title">
            <br />
            Payment
            <br />
          </h1>
          <div className="payment-body">
            <img src={itemChest} height="200" width="200"></img>
            <p className="lead">
              Name: {this.state.firstname + ' ' + this.state.lastname}
              <br />
              Lender: {this.props.lenderid}
              <br />
              Description: {this.props.description}
              <br />
              Type: {this.props.listing_type}
              <br />
              Insurance: {this.props.insurance}
              <br />
              Price: {this.props.price}
                <br />
                Return By Date &amp; Time: {format(parseISO(this.props.return_date), 'MMMM do,yyyy H:mma')}
              <br />
              {/* {this.state.greeting} */}
            </p>

            <h1>{product.name}</h1>
            <h3>Final Price: {this.props.price}</h3>
            <h4>{product.description}</h4>
            <StripeCheckout
              stripeKey="pk_test_Ci5vDkQD1gwMM6faugOYBC0B00IddzaMye"
              token={handleToken}
              billingAddress
              amount={product.price * 100}
              name={product.name}
            />
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById;

export default Payment;