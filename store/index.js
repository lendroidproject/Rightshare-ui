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
      const { assets: newAssets, refresh } = action.payload
      const assets = refresh ? newAssets : [...(state.assets || []), ...newAssets]
      return { ...state, assets }
    case 'GET_MY_FRIGHTS': {
      const { assets: newAssets, refresh } = action.payload
      const fRights = refresh ? newAssets : [...(state.fRights || []), ...newAssets]
      return { ...state, fRights }
    }
    case 'GET_MY_IRIGHTS': {
      const { assets: newAssets, refresh } = action.payload
      const iRights = refresh ? newAssets : [...(state.iRights || []), ...newAssets]
      return { ...state, iRights }
    }
    default:
      return state
  }
}

const defaults = {}

export default (initialState = defaults) => {
  return createStore(reducer, initialState)
}
