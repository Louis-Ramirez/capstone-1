import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import './styles/CreateListing.css';
import MarketPlace from './MarketPlace';

class CreateListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      description: '',
      option: '',
      policy: '',
      curTime: new Date().toLocaleString()
    };
  }

  itemNameChangeHandler = e => {
    e.preventDefault();
    this.setState({
      name: e.currentTarget.value
    });
  };

  descriptionChangeHandler = e => {
    e.preventDefault();
    this.setState({
      description: e.currentTarget.value
    });
  };

  handleOptionChange = e => {
    this.setState({
      option: e.currentTarget.value
    });
  };

  priceChangeHandler = e => {
    e.preventDefault();
    this.setState({
      price: e.currentTarget.value
    });
  };

  policyChangeHandler = e => {
    e.preventDefault();
    this.setState({
      policy: e.currentTarget.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
  };

  loanForm() {
    return (
      <Fragment>
        <label>
          <strong>
            Input the time and date that you want the item to be returned
          </strong>
        </label>
        <br />
        <input type='datetime-local' className='form-input' />
        <br />
        <br />
        <label>
          <strong>Set loan policy</strong>
        </label>
        <br />
        <textarea
          className='form-input'
          autofocus
          placeholder='Type your policy'
          maxlength='180'
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
        <input
          type='datetime-local'
          className='form-input'
          min={this.state.curTime}
        />
        <br />
        <br />
        <label>
          <strong>Set rental policy</strong>
        </label>
        <br />
        <textarea
          className='form-input'
          autofocus
          placeholder='Type your policy'
          maxlength='180'
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
      // <div>{this.props.children}</div>

      <div className='container-parent'>
        <div className='container'>
          <h1 className='title'>Create Listing</h1>
          <form onSubmit={this.handleSubmit} className='form-fields'>
            <div>
              <div className='button-wrapper'>
                <button className='close-button'>
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
              <label for='sale'>Sale</label>
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
