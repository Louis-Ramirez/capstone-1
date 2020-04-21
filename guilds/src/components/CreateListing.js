import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import MarketPlace from './MarketPlace';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';

import './styles/CreateListing.css';

class CreateListing extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      price: '',
      description: '',
      option: '',
      date: '',
      policy: '',
      curTime: new Date().toLocaleString(),
      image: '',
    };
  }

  itemNameChangeHandler = (e) => {
    this.setState({
      name: e.currentTarget.value,
    });
  };

  descriptionChangeHandler = (e) => {
    this.setState({
      description: e.currentTarget.value,
    });
  };

  handleOptionChange = (e) => {
    this.setState({
      option: e.currentTarget.value,
    });
  };

  priceChangeHandler = (e) => {
    this.setState({
      price: e.currentTarget.value,
    });
  };

  policyChangeHandler = (e) => {
    this.setState({
      policy: e.currentTarget.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state); //post request with axios
    const item = this.state;
    axios.post(`http://localhost:4000/market-place`, { item }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  };

  fileSelectedHandler = (e) => {
    //console.log(e.target.files[0]);
    this.setState({
      image: e.currentTarget.value,
    });
  };

  onDateChange = (date) => this.setState({ date });
  loanForm() {
    let minimumDate = new Date();
    return (
      <Fragment>
        <label>
          <strong>
            Input the time and date that you want the item to be returned
          </strong>
        </label>
        <br />

        <br />
        <DateTimePicker
          onChange={this.onDateChange}
          value={this.state.date}
          minDate={minimumDate}
        />

        <br />
        <br />
        <label>
          <strong>Set loan policy</strong>
        </label>
        <br />
        <textarea
          className='form-input'
          autoFocus
          placeholder='Type your policy'
          maxLength='180'
          rows='8'
          cols='70'
          value={this.state.policy}
          onChange={this.policyChangeHandler}
        />
      </Fragment>
    );
  }

  saleForm() {
    return (
      <Fragment>
        <label>Price</label>
        <br />$
        <input
          className='priceBox'
          type='number'
          min='0.01'
          step='0.01'
          max='2500'
          onChange={this.priceChangeHandler}
        ></input>
      </Fragment>
    );
  }

  rentForm() {
    let minimumDate = new Date();
    return (
      <Fragment>
        <label>Set price per hr</label>
        <br />$
        <input
          className='priceBox'
          type='number'
          min='0.01'
          step='0.01'
          max='2500'
          onChange={this.priceChangeHandler}
        ></input>
        <br />
        <br />
        <label>
          <strong>
            Input the time and date that you want the item to be returned
          </strong>
        </label>
        <br />
        <br />
        <DateTimePicker
          onChange={this.onDateChange}
          value={this.state.date}
          minDate={minimumDate}
        />
        <br />
        <br />
        <label>
          <strong>Set rental policy</strong>
        </label>
        <br />
        <textarea
          className='form-input'
          autoFocus
          placeholder='Type your policy'
          maxLength='180'
          rows='8'
          cols='70'
          value={this.state.policy}
          onChange={this.policyChangeHandler}
        />
      </Fragment>
    );
  }

  closeButton() {
    return <Redirect path='/market-place' Component={MarketPlace}></Redirect>;
  }

  render() {
    return (
      <div className='container-parent'>
        <div className='container'>
          <h1 className='title'>Create Listing</h1>
          <form className='form-fields'>
            <div>
              <div className='button-wrapper'>
                <button className='close-button' onClick={this.closeButton}>
                  <strong>X</strong>
                </button>
              </div>
              <label>
                <strong>Item Name</strong>
              </label>
              <br />
              <input
                type='text'
                className='form-input'
                placeholder='Name of item'
                maxLength='50'
                col='10'
                value={this.state.name}
                onChange={this.itemNameChangeHandler}
              ></input>
            </div>
            <br />
            <div>
              <label>
                <strong>Item Description</strong>
              </label>
              <br />
              <textarea
                className='form-input'
                autoFocus
                placeholder='Type your description'
                maxLength='180'
                rows='8'
                cols='70'
                value={this.state.description}
                onChange={this.descriptionChangeHandler}
              />
            </div>
            <br />
            <div>
              <label>
                <strong>Type of Listing:</strong>
              </label>
              <br />
              <input
                type='radio'
                id='sale'
                value='sale'
                name='contact'
                onChange={this.handleOptionChange}
                checked={this.state.option === 'sale'}
              />
              <label htmlFor='sale'>Sale</label>
              <br />
              <input
                type='radio'
                id='loan'
                value='loan'
                name='contact'
                onChange={this.handleOptionChange}
                checked={this.state.option === 'loan'}
              />
              <label for='loan'>Loan</label>
              <br />
              <input
                type='radio'
                id='rental'
                value='rental'
                name='contact'
                onChange={this.handleOptionChange}
                checked={this.state.option === 'rental'}
              />
              <label for='rental'>Rental</label>
            </div>
            <br />

            {this.state.option === 'sale' || this.state.option === ''
              ? this.saleForm()
              : this.state.option === 'loan'
              ? this.loanForm()
              : this.rentForm()}
            <br />
            <br />
            <label>Upload an image</label>
            <br />
            <input
              type='file'
              onChange={this.fileSelectedHandler}
              value={this.state.image}
            />
          </form>
          <div className='submit-button-wrapper'>
            <button className='submit-button' onClick={this.handleSubmit}>
              <strong>Submit</strong>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateListing;
