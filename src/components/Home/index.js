import {Component} from 'react'
import {Link} from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import {AiOutlineSearch, AiOutlineClose} from 'react-icons/ai'
import Header from '../Header'
import './index.css'

const tabs = [
  {name: 'All', id: 0},
  {name: 'Historical', id: 1},
  {name: 'Romance', id: 2},
  {name: 'Fantasy', id: 3},
]

const apiConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

class Home extends Component {
  state = {
    searchInput: '',
    bookslist: [],
    apiStatus: apiConstants.initial,
    activeId: 0,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiConstants.progress})
    const {activeId, searchInput} = this.state
    const string = activeId === 0 ? 'j' : tabs[activeId].name.toLowerCase()
    const query = searchInput === '' ? string : searchInput
    const url = `https://example-data.draftbit.com/books?_limit=10&q=${query}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = data.map(eachItem => ({
        bookId: eachItem.id,
        title: eachItem.title,
        authors: eachItem.authors,
        imageUrl: eachItem.image_url,
        numPages: eachItem.num_pages,
        isPopup: false,
      }))
      setTimeout(() => {
        this.setState({
          bookslist: formattedData,
          apiStatus: apiConstants.success,
        })
      }, 800)
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.setState(this.getDetails)
    }
  }

  onActive = id => {
    this.setState({activeId: id, searchInput: ''}, this.getDetails)
  }

  renderFailure = displayText => (
    <div className="container">
      <p>{displayText}</p>
      <button
        className="tab active-tab"
        type="button"
        onClick={this.getDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderProgress = () => (
    <SkeletonTheme highlightColor="rgb(217, 180, 252)">
      <div className="book-list view-lg">
        {array.map(each => (
          <li className="book-item" key={each}>
            <Skeleton width="180px" height="160px" />
          </li>
        ))}
      </div>
      <div className="book-list view-sm">
        {array.map(each => (
          <li className="book-item" key={each}>
            <Skeleton width="100%" height="200px" />
          </li>
        ))}
      </div>
    </SkeletonTheme>
  )

  mouseEnter = details => {
    this.setState(prevState => ({
      bookslist: prevState.bookslist.map(eachBook =>
        eachBook.bookId === details.bookId
          ? {...eachBook, isPopup: true}
          : eachBook,
      ),
    }))
  }

  mouseLeave = details => {
    this.setState(prevState => ({
      bookslist: prevState.bookslist.map(eachBook =>
        eachBook.bookId === details.bookId
          ? {...eachBook, isPopup: false}
          : eachBook,
      ),
    }))
  }

  onClose = details => {
    this.setState(prevState => ({
      bookslist: prevState.bookslist.map(eachBook =>
        eachBook.imageId === details.imageId
          ? {...eachBook, isPopup: false}
          : eachBook,
      ),
    }))
  }

  renderSuccess = () => {
    const {bookslist} = this.state
    if (bookslist.length === 0) {
      const search = 'Search Not Found'
      return this.renderFailure(search)
    }
    return (
      <ul className="book-list">
        {bookslist.map(eachBook => (
          <li
            className={`book-item ${eachBook.isPopup ? 'show-details' : ''}`}
            key={eachBook.bookId}
            onMouseEnter={() => this.mouseEnter(eachBook)}
            onMouseLeave={() => this.mouseLeave(eachBook)}
          >
            <img
              className="image"
              src={eachBook.imageUrl}
              alt={eachBook.title}
            />
            <div className="book-details">
              <AiOutlineClose
                className="close"
                onClick={() => this.onClose(eachBook)}
              />
              <p className="text">
                <span>Title: </span>
                {eachBook.title}
              </p>
              <p className="text place">
                <span>Author: </span>
                {eachBook.authors}
              </p>
              <Link to={`/books/${eachBook.bookId}`} className="link">
                View Book
              </Link>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    const fail = 'Something went wrong.'
    switch (apiStatus) {
      case apiConstants.progress:
        return this.renderProgress()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderFailure(fail)
      default:
        return null
    }
  }

  getTabs = eachTab => {
    const {activeId} = this.state
    return (
      <button
        className={activeId === eachTab.id ? `active-tab tab` : `tab`}
        type="button"
        id={eachTab.id}
        onClick={() => this.onActive(eachTab.id)}
        key={eachTab.id}
      >
        {eachTab.name}
      </button>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="home-container">
        <Header />
        <div className="input-container">
          <input
            className="input"
            placeholder="Search Book and Press Enter"
            type="search"
            value={searchInput}
            onChange={this.onSearch}
            onKeyDown={this.onEnter}
          />
          <AiOutlineSearch className="icon" />
        </div>
        <div className="tab-container">
          {tabs.map(eachTab => this.getTabs(eachTab))}
        </div>
        <div className="books-container">{this.renderResult()}</div>
      </div>
    )
  }
}

export default Home
