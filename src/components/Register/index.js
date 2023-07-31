import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'

class Register extends Component {
  state = {
    name: '',
    username: '',
    password: '',
    gender: 'male',
    errorMsg: '',
    isLoading: false,
  }

  onUsername = event => {
    this.setState({username: event.target.value, errorMsg: ''})
  }

  onName = event => {
    this.setState({name: event.target.value, errorMsg: ''})
  }

  onPassword = event => {
    this.setState({password: event.target.value, errorMsg: ''})
  }

  onRegister = async event => {
    event.preventDefault()
    this.setState({isLoading: true, errorMsg: ''})
    const url = 'https://bookifyserver.cyclic.cloud/register/'
    const {username, name, gender, password} = this.state
    const registerDetails = {username, password, name, gender}
    if (!username || !password || !name || !gender) {
      this.setState({
        errorMsg: 'Please fill in all the details',
        isLoading: false,
      })
      return
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(registerDetails),
      headers: {
        'content-type': 'application/json',
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const {history} = this.props
      this.setState({
        username: '',
        name: '',
        password: '',
        gender: 'male',
        errorMsg: data.message,
        isLoading: false,
      })
      setTimeout(() => {
        history.replace('/login')
      }, 2000)
    } else {
      this.setState({errorMsg: data.error, isLoading: false})
    }
  }

  onRadio = event => {
    this.setState({gender: event.target.value, errorMsg: ''})
  }

  render() {
    const {name, password, username, errorMsg, isLoading} = this.state
    return (
      <div className="register-container">
        <img
          src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1690355531/Book1_yn60zj.jpg"
          alt="logo"
          className="logo-image"
        />
        <p className="logo-text">
          Book<span>ify</span>
        </p>
        <form className="register" onSubmit={this.onRegister}>
          <input
            className="name"
            type="text"
            placeholder="Username"
            onChange={this.onUsername}
            value={username}
          />
          <input
            className="name"
            type="text"
            placeholder="Enter Name"
            onChange={this.onName}
            value={name}
          />
          <input
            className="name"
            type="password"
            placeholder="Enter Password"
            onChange={this.onPassword}
            value={password}
          />
          <div className="radio">
            <div>
              <input
                type="radio"
                name="gender"
                value="male"
                checked
                id="male"
                className="radio-type"
                onChange={this.onRadio}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                value="female"
                id="female"
                className="radio-type"
                onChange={this.onRadio}
              />
              <label htmlFor="male">Female</label>
            </div>
          </div>
          <button type="submit" className="register-button">
            {isLoading ? (
              <Loader type="Oval" width={25} height={25} color="#ffffff" />
            ) : (
              'Register'
            )}
          </button>
          {errorMsg !== '' && <p className="error">*{errorMsg}</p>}
          <Link to="/login" className="space">
            Login
          </Link>
        </form>
      </div>
    )
  }
}
export default Register
