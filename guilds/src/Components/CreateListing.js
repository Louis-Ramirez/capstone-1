import React, { Component } from 'react';
import './styles/CreateListing.css';

function validate(name, description, option, datetime) {
  // true means invalid, so our conditions got reversed
  return {
    name: name.length === 0,
    description: description.length === 0,
    option: option === '',
    datetime: datetime < new Date(),

  };
}

class CreateListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      description: '',
      option: '',
      insurance: 0,
      datetime: '',
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
    e.preventDefault();
    this.setState({
      option: e.currentTarget.value
    });
  };

  handleDatetimeChange = e => {
    e.preventDefault();
    this.setState({
      datetime: e.currentTarget.value
    });
  };

  handleSubmit = evt => {
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      alert('Unable to submit: some field may be empty');
      return;
    }
    else{
      alert('submission has been completed');
    }
  };

  canBeSubmitted() {
    const empty = validate(
                            this.state.name,
                            this.state.description,
                            this.state.option,
                            this.state.datetime,
                          );
    const isDisabled = Object.keys(empty).some(x => empty[x]);
    return !isDisabled;
  }

  render() {
    const errors = validate(
                    this.state.name,
                    this.state.description,
                    this.state.option,
                    this.state.datetime,
                  );
    return (
      <div className='container-parent'>
        <div className='container'>
          <h1 className='title'>Create Listing</h1>
          <form onSubmit={this.handleSubmit} className='form-fields'>
            <div>
              <div className='button-wrapper'>
                <button className='close-button'>X</button>
              </div>
              <label>Item Name </label>
              <br />
              <input
                type='text'
                className='form-input'
                placeholder='Name of item'
                maxLength='50'
                value={this.state.name}
                onChange={this.itemNameChangeHandler}
              ></input>
            </div>
            <div>
              {/* make into a description box */}
              <label>Item Description</label>
              <br />
              <textarea
                className='form-input'
                autofocus
                placeholder='Type your description'
                maxlength='180'
                rows='5'
                cols='40'
                value={this.state.description}
                onChange={this.descriptionChangeHandler}
              />
            </div>
            <div>
              <label>Type of Listing:</label>
              <br />
              <input
                type='radio'
                id='sale'
                value={this.state.option === 'sale'}
                name='contact'
                onChange={this.handleOptionChange}
              />
              <label for='sale'>Sale</label>
              <br />
              <input
                type='radio'
                id='loan'
                value={this.state.option === 'loan'}
                name='contact'
                onChange={this.handleOptionChange}
              />
              <label for='loan'>Loan</label>
              <br />
              <input
                type='radio'
                id='rental'
                value={this.state.option === 'rental'}
                name='contact'
                onChange={this.handleOptionChange}
              />
              <label for='rental'>Rental</label>
            </div>
            <div>
              <label>Insurance cost </label>
              <br />
              <input
                type='number'
                className='form-input'
                placeholder='0'
                maxLength='3'
                value={this.state.insurance}
                onChange={this.itemNameChangeHandler}
              ></input>
            </div>
            <div>
              <label>
                Input the time and date that you want the item returned
              </label>
              <br />
              <input
                type='datetime-local'
                className='form-input'
                value={this.state.datetime}
                onChange={this.handleDatetimeChange}
              />
            </div>
          </form>
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default CreateListing;
