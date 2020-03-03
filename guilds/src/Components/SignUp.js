import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class SignUp extends Component {
  constructor() {
    super();

    this.state = {
      EMAIL: '',
      PASSWORD: '',
      FIRST_NAME: '',
      LAST_NAME: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    let target = e.target;
    let name = target.name;
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    axios.post('http://localhost:4000/users/', signUp)
    .then(res => console.log(res.data));
    console.log('The form was submitted with the following data:');
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className='FormFields'>
          <div className='FormField'>
            <label className='FormField__Label' htmlFor='name'>
              <strong>First Name</strong>
            </label>
            <input
              type='text'
              id='firstname'
              className='FormField__Input'
              placeholder='Enter your first name'
              name='firstname'
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <label className='FormField__Label' htmlFor='name'>
              <strong>Last Name</strong>
            </label>
            <input
              type='text'
              id='lastname'
              className='FormField__Input'
              placeholder='Enter your last name'
              name='lastname'
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <label className='FormField__Label' htmlFor='password'>
              <strong>Password</strong>
            </label>
            <input
              type='password'
              id='password'
              className='FormField__Input'
              placeholder='Enter your password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <label className='FormField__Label' htmlFor='email'>
              <strong>E-Mail Address</strong>
            </label>
            <input
              type='email'
              id='email'
              className='FormField__Input'
              placeholder='Enter your campus email'
              name='email'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div className='FormField'>
            <button className='FormField__Button mr-20'>Sign Up</button>{' '}
            <Link to='/sign-in' className='FormField__Link'>
              I'm already a member
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
