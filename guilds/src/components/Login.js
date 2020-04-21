import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import './styles/Home.css';
import axios from 'axios';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let name = target.name;
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    axios
      .post('http://localhost:4000/login', this.state)
      .then(res => console.log(res.data));
    console.log('The login form was submitted with the following data:');
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <div className='FormCenter'>
          <form onSubmit={this.handleSubmit} className='FormFields'>
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
              <br />
              <br />
              <Route path='/forgot-password' component={ForgotPassword}></Route>
              <Link to='/forgot-password' className='FormField__Link'>
                <strong>Forgot your password?</strong>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
