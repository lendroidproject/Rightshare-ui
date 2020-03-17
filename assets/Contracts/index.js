import Web3 from 'web3'

import FRight from './ABIs/FRightABI.json'
import IRight from './ABIs/IRightABI.json'
import RightsDao from './ABIs/RightsDaoABI.json'

const addresses = {
  FRight: '0xdebe8d133cd16ebf1c417cb8b1aa9332c40a0b37',
  IRight: '0x7f103826b7735d669442180be129ec3b0ad60bf1',
  RightsDao: '0x7e255ccdedf7defb26fac6348d63b49610e30fb9',
}

const call = method => (...args) => method(...args).call()
const send = method => (...args) => {
  const option = args[args.length - 1]
  args.pop()
  return method(...args).send(option)
}

export default () => {
  const instance = new Web3(window.ethereum)
  const contracts = {
    FRight: new instance.eth.Contract(FRight, addresses.FRight),
    IRight: new instance.eth.Contract(IRight, addresses.IRight),
    RightsDao: new instance.eth.Contract(RightsDao, addresses.RightsDao),
  }

  const methods = {}

  // FRight
  methods.isFrozen = call(contracts.FRight.methods.isFrozen)

  // IRight

  // RightsDao
  methods.freeze = send(contracts.RightsDao.methods.freeze)

  return {
    web3: instance,
    contracts,
    methods,
  }
}
