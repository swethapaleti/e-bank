import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    isError: '',
  }

  userIdInput = event => {
    this.setState({userId: event.target.value})
  }

  pinInput = event => {
    this.setState({pin: event.target.value})
  }

  LoginForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const options = {
      method: 'POST',
      body: JSON.stringify({
        pin,
        user_id: userId,
      }),
    }
    try {
      const response = await fetch('https://apis.ccbp.in/ebank/login', options)
      const data = await response.json()
      const jwtToken = data.jwt_token
      if (response.ok === true) {
        Cookies.set('jwt_token', jwtToken, {expires: 30})
        const {history} = this.props
        history.replace('/')
      } else {
        this.setState({isError: data.error_msg})
      }
    } catch (e) {
      console.log(e.message)
      this.setState({isError: e.message})
    }
  }

  render() {
    const {isError} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg">
        <div className="login-card">
          <img
            className="login-img"
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
          <div className="form-container">
            <form className="form" onSubmit={this.LoginForm}>
              <h1>Welcome Back!</h1>
              <div className="user-id">
                <label className="label" htmlFor="user-id">
                  User ID
                </label>
                <input
                  className="input"
                  onChange={this.userIdInput}
                  id="user-id"
                  placeholder="Enter User ID"
                />
              </div>
              <div className="user-id">
                <label className="label" htmlFor="pin">
                  PIN
                </label>
                <input
                  className="input"
                  onChange={this.pinInput}
                  type="password"
                  id="pin"
                  placeholder="Enter PIN"
                />
              </div>
              <button className="login" type="submit">
                Login
              </button>
              {isError !== '' && <p className="error">{isError}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
