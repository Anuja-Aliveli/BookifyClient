import {Component} from 'react'
import Cookies from 'js-cookie'
// eslint-disable-next-line import/no-extraneous-dependencies
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import {AiFillDelete} from 'react-icons/ai'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Books extends Component {
  state = {
    savedList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount = () => {
    this.getListDetails()
  }

  getListDetails = async () => {
    try {
      this.setState({apiStatus: apiConstants.progress})
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://bookifyserver.cyclic.cloud/books/'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      console.log(response)
      if (response.ok === true) {
        const data = await response.json()
        const formattedData = data.list.map(eachBook => ({
          imageUrl: eachBook.book_img_url,
          rating: eachBook.rating,
          authors: eachBook.authors,
          id: eachBook.book_id,
        }))
        setTimeout(() => {
          this.setState({
            savedList: formattedData,
            apiStatus: apiConstants.success,
          })
        }, 1000)
      } else {
        this.setState({apiStatus: apiConstants.failure})
      }
    } catch (err) {
      console.log(err)
    }
  }

  onDelete = async bookId => {
    const jwtToken = Cookies.get('jwt_token')
    const urlDelete = `https://bookifyserver.cyclic.cloud/books/${bookId}/`
    const optionsDelete = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const responseDelete = await fetch(urlDelete, optionsDelete)
      if (responseDelete.ok === true) {
        this.getListDetails()
      }
    } catch (err) {
      console.log(err)
    }
  }

  renderList = () => {
    const {savedList} = this.state
    return (
      <ul className="saved-list">
        {savedList.map(eachBook => (
          <li className="saved-item" key={eachBook.id}>
            <Link to={`/books/${eachBook.id}`}>
              <img
                className="saved-img"
                src={eachBook.imageUrl}
                alt={eachBook.title}
              />
            </Link>
            <div className="saved-container">
              <p className="saved">
                <b>Authors: </b>
                {eachBook.authors}
              </p>
              <p className="saved">
                <b>Rating: </b>
                {eachBook.rating}
              </p>
              <AiFillDelete
                color="#000000"
                size={25}
                className="saved-icon-container"
                onClick={() => this.onDelete(eachBook.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderProgress = () => (
    <SkeletonTheme highlightColor="rgb(217, 180, 252)">
      <ul className="saved-list">
        {Array.from({length: 8}).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className="saved-item" key={index}>
            <Skeleton height={160} />
            <div className="saved-container">
              <p className="saved">
                <Skeleton width={130} />
              </p>
              <p className="saved">
                <Skeleton width={100} />
              </p>
              <div className="saved-icon-container">
                <Skeleton circle height={25} width={25} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SkeletonTheme>
  )

  renderNotFound = (text, button) => (
    <div className="not-container">
      <p className="not-text">{text}</p>
      <Link to="/">
        <button type="button" className="register-button">
          {button}
        </button>
      </Link>
    </div>
  )

  renderSuccess = () => {
    const {savedList} = this.state
    const notAdd = 'No Books are Added'
    const buttonAdd = 'Add Books'
    return (
      <>
        {savedList.length === 0
          ? this.renderNotFound(notAdd, buttonAdd)
          : this.renderList()}
      </>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    const fail = 'Something went wrong.'
    const buttonTry = 'Try Again'
    switch (apiStatus) {
      case apiConstants.progress:
        return this.renderProgress()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderNotFound(fail, buttonTry)
      default:
        return null
    }
  }

  render() {
    return (
      <div className="list-bg-container">
        <Header />
        {this.renderResult()}
      </div>
    )
  }
}

export default Books
