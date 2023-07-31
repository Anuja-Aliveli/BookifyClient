import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isLoading: false,
    errorMsg: '',
  }

  onUsername = event => {
    this.setState({username: event.target.value, errorMsg: ''})
  }

  onPassword = event => {
    this.setState({password: event.target.value, errorMsg: ''})
  }

  onForm = async event => {
    event.preventDefault()
    this.setState({isLoading: true, errorMsg: ''})
    const url = 'https://bookifyserver.cyclic.cloud/login'
    const {username, password} = this.state
    const loginDetails = {username, password}
    if (!username || !password) {
      this.setState({
        errorMsg: 'Please fill in all the details',
        isLoading: false,
      })
      return
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
      headers: {
        'content-type': 'application/json',
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const {history} = this.props
      const {jwtToken} = data
      Cookies.set('jwt_token', jwtToken, {
        expires: 30,
      })
      history.replace('/')
      this.setState({
        username: '',
        password: '',
        isLoading: false,
      })
    } else {
      this.setState({errorMsg: data.error, isLoading: false})
    }
  }

  render() {
    const {username, password, isLoading, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1690355531/Book1_yn60zj.jpg"
          alt="logo"
          className="logo-image"
        />
        <p className="logo-text">
          Book<span>ify</span>
        </p>
        <form className="login" onSubmit={this.onForm}>
          <p className="text-login">Login</p>
          <input
            className="name-login"
            type="text"
            placeholder="Username"
            onChange={this.onUsername}
            value={username}
          />
          <input
            className="name-login"
            type="password"
            placeholder="Enter Password"
            onChange={this.onPassword}
            value={password}
          />
          <button type="submit" className="register-button">
            {isLoading ? (
              <Loader type="Oval" width={25} height={25} color="#ffffff" />
            ) : (
              'Login'
            )}
          </button>
          {errorMsg !== '' && <p className="error">*{errorMsg}</p>}
          <Link to="/register" className="space">
            Register
          </Link>
        </form>
      </div>
    )
  }
}
export default Login
