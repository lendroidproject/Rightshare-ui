import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'METAMASK_ADDRESS':
      return { ...state, address: action.payload }
    case 'METAMASK_BALANCE':
      return { ...state, balance: action.payload }
    case 'INIT_CONTRACTS':
      return { ...state, ...action.payload }
    case 'GET_MY_ASSETS':
      return { ...state, assets: action.payload }
    case 'GET_MY_FRIGHTS':
      return { ...state, fRights: action.payload }
    case 'GET_MY_IRIGHTS':
      return { ...state, iRights: action.payload }
    default:
      return state
  }
}

const defaults = {}

export default (initialState = defaults) => {
  return createStore(reducer, initialState)
}
