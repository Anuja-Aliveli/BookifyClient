import {Component} from 'react'
import Loader from 'react-loader-spinner'
// eslint-disable-next-line import/no-extraneous-dependencies
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css'
import listContext from '../../Context/listContext'
import Header from '../Header'

const apiConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {
    bookDetails: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  componentWillUnmount() {
    const {onMessage} = this.context
    onMessage()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiConstants.progress})
    const {match} = this.props
    const bookId = match.params.id
    const url = `https://example-data.draftbit.com/books/${bookId}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        id: data.id,
        title: data.title,
        authors: data.authors,
        description: data.description,
        totalPages: data.num_pages,
        rating: data.rating,
        ratingCount: data.rating_count,
        reviewCount: data.review_count,
        imageUrl: data.image_url,
      }
      setTimeout(() => {
        this.setState({
          bookDetails: formattedData,
          apiStatus: apiConstants.success,
        })
      }, 2000)
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderProgress = () => {
    const numbersArray = Array.from({length: 15}, (_, index) => index)
    return (
      <SkeletonTheme highlightColor="rgb(217, 180, 252)">
        <div className="book-view-container">
          <div className="left-container">
            <Skeleton height="100%" width="100%" />
          </div>
          <div className="right-container">
            <div className="first">
              <div>
                <p>
                  <Skeleton width={200} />
                </p>
                <p>
                  <Skeleton width={200} />
                </p>
                <p>
                  <Skeleton width={200} />
                </p>
                <p>
                  <Skeleton width={200} />
                </p>
                <p>
                  <Skeleton width={200} />
                </p>
              </div>
              <Skeleton width={100} height={40} className="first-button" />
            </div>
            <p className="content-details">
              {numbersArray.map(each => (
                <Skeleton width="100%" key={each} />
              ))}
            </p>
          </div>
        </div>
      </SkeletonTheme>
    )
  }

  renderFailure = () => (
    <div className="container">
      <p>Something went wrong.</p>
      <button
        className="tab active-tab"
        type="button"
        onClick={this.getDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccess = () => {
    const {bookDetails} = this.state
    return (
      <listContext.Consumer>
        {value => {
          const {onBookList, message, isLoading} = value

          const onAdd = () => {
            onBookList(bookDetails)
          }

          const apiMsg = message !== '' ? message : ''
          const msgColor =
            apiMsg.charAt(0) === 'A' || apiMsg.charAt(0) === 'I'
              ? 'success-msg'
              : 'error-msg'

          return (
            <div className="book-view-container">
              <div className="left-container">
                <img src={bookDetails.imageUrl} alt={bookDetails.image_url} />
              </div>
              <div className="right-container">
                <div className="first">
                  <div>
                    <p>
                      <b>Title: </b>
                      {bookDetails.title}
                    </p>
                    <p>
                      <b>Authors: </b>
                      {bookDetails.authors}
                    </p>
                    <p>
                      <b>Total Pages: </b>
                      {bookDetails.totalPages}
                    </p>
                    <p>
                      <b>Ratings: </b>
                      {bookDetails.rating} ({bookDetails.ratingCount})
                    </p>
                    <p>
                      <b>Reviews: </b>
                      {bookDetails.reviewCount}
                    </p>
                  </div>
                  <div className="first-button">
                    <button
                      type="button"
                      className="register-button"
                      onClick={onAdd}
                    >
                      {isLoading ? (
                        <Loader
                          type="Oval"
                          color="#ffffff"
                          height={30}
                          width={30}
                        />
                      ) : (
                        'Add to List'
                      )}
                    </button>
                    <p className={msgColor}>{apiMsg}</p>
                  </div>
                </div>
                <p className="content-details">
                  <b>Description: </b>
                  {bookDetails.description}
                </p>
              </div>
            </div>
          )
        }}
      </listContext.Consumer>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.progress:
        return this.renderProgress()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="book-bg-container">
        <Header />
        {this.renderResult()}
      </div>
    )
  }
}

BookDetails.contextType = listContext

export default BookDetails
