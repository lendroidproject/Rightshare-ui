import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const defaults = {}

export default (initialState = defaults) => {
  return createStore(reducer, initialState)
}
