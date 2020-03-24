import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
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

    console.log('The form was submitted with the following data:');
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <div className='FormCenter'>
          <form
            onSubmit={this.handleSubmit}
            className='FormFields'
            onSubmit={this.handleSubmit}
          >
            <div className='FormField'>
              <label className='FormField__Label' htmlFor='email'>
                <strong>E-Mail Address</strong>
              </label>
              <input
                type='email'
                id='email'
                className='FormField__Input'
                placeholder='Enter your email'
                name='email'
                value={this.state.email}
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
              <button className='FormField__Button mr-20'>Sign In</button>{' '}
              <Link to='/' className='FormField__Link'>
                <strong>Create an account</strong>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
