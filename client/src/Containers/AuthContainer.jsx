import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginForm from '../Components/LoginForm'
import SignupForm from '../Components/SignupForm'
import axios from 'axios';

class AuthContainer extends Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    this.setState({
      [inputName]: inputValue
    })
  }

  signupUser = async () => {
    try {
      const { data } = await axios.post(`/api/auth/signup`, this.state)
      this.props.setUser(data.payload.user)

    } catch (err) {
      console.log('ERROR', err)
    }
  }

  loginUser = async () => {
    try {
      const { data } = await axios.post(`/api/auth/login`, this.state)
      this.props.setUser(data.payload.user)

    } catch (err) {
      console.log('ERROR', err)
    }
  }

  renderSignupForm = () => {
    const { username, password } = this.state
    return (
      <SignupForm
        handleChange={this.handleChange}
        username={username}
        password={password}
        signupUser={this.signupUser}
      />
    )
  }

  renderLoginForm = () => {
    const { username, password } = this.state
    return (
      <LoginForm
        handleChange={this.handleChange}
        username={username}
        password={password}
        loginUser={this.loginUser}
      />
    )
  }

  render() {
    const { isUserLoggedIn } = this.props;
    return (
      <div>
        <h2>AuthContainer</h2>
        {
          isUserLoggedIn
            ? <Redirect to="/profile" />
            : (
              <Switch>
                <Route path="/login" render={this.renderLoginForm} />
                <Route path="/signup" render={this.renderSignupForm} />
              </Switch>
            )
        }
      </div>
    )
  }
}

export default AuthContainer;
