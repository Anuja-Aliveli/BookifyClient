import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import Cookies from 'js-cookie'
import Register from './components/Register'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import BookDetails from './components/BookDetails'
import listContext from './Context/listContext'
import Books from './components/Books'
import './App.css'

class App extends Component {
  state = {
    message: '',
    isLoading: false,
  }

  onBookList = async bookDetails => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://bookifyserver.cyclic.cloud/bookitem/'

    const detailsObj = {
      bookId: bookDetails.id,
      title: bookDetails.title,
      authors: bookDetails.authors,
      rating: bookDetails.rating,
      ratingCount: bookDetails.ratingCount,
      reviewCount: bookDetails.reviewCount,
      imageUrl: bookDetails.imageUrl,
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailsObj),
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      this.setState({message: data.message, isLoading: false})
    } else {
      this.setState({message: 'Try Again', isLoading: false})
    }
  }

  onMessage = () => {
    this.setState({message: ''})
  }

  render() {
    const {message, isLoading} = this.state
    return (
      <listContext.Provider
        value={{
          message,
          isLoading,
          onBookList: this.onBookList,
          onMessage: this.onMessage,
        }}
      >
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/books/:id" component={BookDetails} />
          <ProtectedRoute exact path="/books" component={Books} />
        </Switch>
      </listContext.Provider>
    )
  }
}
export default App
