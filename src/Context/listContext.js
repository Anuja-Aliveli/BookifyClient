import React from 'react'

const listContext = React.createContext({
  message: '',
  isLoading: false,
  onBookKist: () => {},
  onMessage: () => {},
})

export default listContext
