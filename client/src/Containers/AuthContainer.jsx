import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginForm from '../Components/LoginForm'
import SignupForm from '../Components/SignupForm'
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

class AuthContainer extends Component {
  state = {
    username: '',
    password: '',
    recaptchaToken: '',
    notBot: false
  }

  handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    this.setState({
      [inputName]: inputValue
    })
  }

  signupUser = async () => {
    if (this.state.notBot) {
      try {
        const { data } = await axios.post(`/api/auth/signup`, this.state)
        this.props.setUser(data.payload.user)

      } catch (err) {
        console.log('ERROR', err)
      }
    } else {
      window.alert('Please verify you are not a bot')
    }
  }


  loginUser = async () => {
    if (this.state.notBot) {
      try {
        const { data } = await axios.post(`/api/auth/login`, this.state)
        this.props.setUser(data.payload.user)

      } catch (err) {
        console.log('ERROR', err)
      }
    } else {
      window.alert('Please verify you are not a bot')
    }
  }

  handleReCaptchaToken = (token) => {
    if (token) {
      this.setState({
        notBot: true,
        recaptchaToken: token
      })
    } else {
      // reCAPTCHA expired
      this.setState({
        notBot: false,
        recaptchaToken: ''
      })
      window.alert('Human verification expired, please indicate you are not a robot again.')
    }
  }

  handleReCaptchaError = (err) => {
    this.setState({
      notBot: false,
      recaptchaToken: '',
    })

    window.alert('There was an error. Please check your network and try again later.')
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
        <ReCAPTCHA
          sitekey="6Ld-oeAZAAAAAGAC5J_5G_ZZt6yGTNktlhrOKD3R"
          onChange={this.handleReCaptchaToken}
          onErrored={this.handleReCaptchaError}
        />
      </div>
    )
  }
}

export default AuthContainer;
