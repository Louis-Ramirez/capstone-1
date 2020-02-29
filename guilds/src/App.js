import React, { Component } from 'react';
import {
  BrowserRouter,
  HashRouter as Router,
  Route,
  Link,
  NavLink,
  Switch
} from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/SignUp';
import './App.css';

// function App() {
//   return (
//     <BrowserRouter>
//       <div className='App'>
//         <Navigation>
//           <Switch>
//             <Route path='/' component={Login} exact />
//           </Switch>
//         </Navigation>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

class App extends Component {
  render() {
    return (
      <Router basename='/react-auth-ui/'>
        <div className='App'>
          <div className='App__Aside'></div>
          <div className='App__Form'>
            <div className='PageSwitcher'>
              <NavLink
                to='/sign-in'
                activeClassName='PageSwitcher__Item--Active'
                className='PageSwitcher__Item'
              >
                Sign In
              </NavLink>
              <NavLink
                exact
                to='/'
                activeClassName='PageSwitcher__Item--Active'
                className='PageSwitcher__Item'
              >
                Sign Up
              </NavLink>
            </div>

            <div className='FormTitle'>
              <NavLink
                to='/sign-in'
                activeClassName='FormTitle__Link--Active'
                className='FormTitle__Link'
              >
                Sign In
              </NavLink>{' '}
              or{' '}
              <NavLink
                exact
                to='/'
                activeClassName='FormTitle__Link--Active'
                className='FormTitle__Link'
              >
                Sign Up
              </NavLink>
            </div>

            <Route exact path='/' component={Signup}></Route>
            <Route path='/sign-in' component={Login}></Route>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;