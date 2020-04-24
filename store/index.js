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
      const { assets: newAssets, refresh, owner } = action.payload
      const assets = refresh ? newAssets : [...(state.assets || []), ...newAssets]
      if (state.owner !== owner) {
        delete state.assets
        delete state.fRights
        delete state.iRights
      }
      return { ...state, assets, owner }
    case 'GET_MY_FRIGHTS': {
      const { assets: newAssets, refresh, owner } = action.payload
      const fRights = refresh ? newAssets : [...(state.fRights || []), ...newAssets]
      if (state.owner !== owner) {
        delete state.assets
        delete state.fRights
        delete state.iRights
      }
      return { ...state, fRights, owner }
    }
    case 'GET_MY_IRIGHTS': {
      const { assets: newAssets, refresh, owner } = action.payload
      const iRights = refresh ? newAssets : [...(state.iRights || []), ...newAssets]
      if (state.owner !== owner) {
        delete state.assets
        delete state.fRights
        delete state.iRights
      }
      return { ...state, iRights, owner }
    }
    case 'GET_ASSET_INFO': {
      const { data, type } = action.payload
      const source = state[type]
      const replaces = source.map((item) => {
        const match = data.find(({ token_id: id, permalink }) => id === item.token_id && permalink === item.permalink)
        if (match) {
          return { ...match, loaded: true }
        }
        return item
      })
      return { ...state, [type]: replaces }
    }
    case 'RESET_ASSETS': {
      const { resets = ['assets', 'fRights', 'iRights'] } = action.payload
      resets.forEach((key) => {
        delete state[key]
      })
      return state
    }
    default:
      return state
  }
}

const defaults = {}

export default (initialState = defaults) => {
  return createStore(reducer, initialState)
}
