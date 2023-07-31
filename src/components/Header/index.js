import {Link, withRouter} from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import {RiRegisteredFill, RiLogoutBoxRLine} from 'react-icons/ri'
import {AiFillHome} from 'react-icons/ai'
import {IoBookSharp} from 'react-icons/io5'
import './index.css'

const Header = props => {
  const {history} = props
  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  const {pathname} = history.location
  const activeHome = pathname === '/' ? 'active link-item' : 'link-item'
  const activeBooks = pathname === '/books' ? 'active link-item' : 'link-item'
  return (
    <nav className="nav-container">
      <div className="image-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1690355531/Book1_yn60zj.jpg"
            alt="logo"
            className="logo-image-header"
          />
        </Link>
        <p className="logo-text-header">Bookify</p>
      </div>
      <div className="link-container-desktop">
        <Link to="/register" className="link-item">
          Register
        </Link>
        <Link to="/" className={activeHome}>
          Home
        </Link>
        <Link to="/books" className={activeBooks}>
          Books
        </Link>
        <button type="button" className="register-button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="link-container-mobile">
        <Link to="/register" className="link-item">
          <RiRegisteredFill size={30} />
        </Link>
        <Link to="/" className={activeHome}>
          <AiFillHome size={30} />
        </Link>
        <Link to="/books" className={activeBooks}>
          <IoBookSharp size={30} />
        </Link>
        <RiLogoutBoxRLine size={30} color="#ffffff" onClick={onLogout} />
      </div>
    </nav>
  )
}
export default withRouter(Header)
