import Web3 from 'web3'

import FRight from './ABIs/FRightABI.json'
import IRight from './ABIs/IRightABI.json'
import RightsDao from './ABIs/RightsDaoABI.json'
import NFT from './ABIs/NFTABI.json'

const addresses = {
  FRight: '0x646BB8Aa5FBcE2E2F3d9b2036b6f2025f4d32556',
  IRight: '0x4890096ef662e4557772085d8042D4f7788C99B0',
  RightsDao: '0x3B4134763bF0F73f9E227286A7Fb098C13252df4',
}

const call = method => (...args) => method(...args).call()
const send = method => (...args) => {
  const option = args.pop()
  return method(...args).send(option)
}

export default () => {
  const instance = new Web3(window.ethereum)
  const contracts = {
    FRight: new instance.eth.Contract(FRight, addresses.FRight),
    IRight: new instance.eth.Contract(IRight, addresses.IRight),
    RightsDao: new instance.eth.Contract(RightsDao, addresses.RightsDao),
  }

  const methods = {
    addresses: {},
    FRight: {},
    IRight: {},
    RightsDao: {},
    NFT: {},
  }

  // Addresses
  methods.addresses.getName = addr => Object.keys(addresses).find(k => addresses[k].toLowerCase() === addr.toLowerCase())

  // FRight
  methods.FRight.isFrozen = call(contracts.FRight.methods.isFrozen)
  methods.FRight.metadata = call(contracts.FRight.methods.metadata)
  methods.FRight.isUnfreezable = call(contracts.FRight.methods.isUnfreezable)
  methods.FRight.isIMintAble = call(contracts.FRight.methods.isIMintAble)
  methods.FRight.tokenURI = call(contracts.FRight.methods.tokenURI)

  // IRight
  methods.IRight.metadata = call(contracts.IRight.methods.metadata)
  methods.IRight.tokenURI = call(contracts.IRight.methods.tokenURI)
  methods.IRight.transfer = send(contracts.IRight.methods.transferFrom)

  // RightsDao
  methods.RightsDao.freeze = send(contracts.RightsDao.methods.freeze)
  methods.RightsDao.unfreeze = send(contracts.RightsDao.methods.unfreeze)
  methods.RightsDao.issueI = send(contracts.RightsDao.methods.issue_i)
  methods.RightsDao.revokeI = send(contracts.RightsDao.methods.revoke_i)

  // NFT
  methods.NFT.approve = address => {
    const contract = new instance.eth.Contract(NFT, address)
    return send(contract.methods.approve)
  }

  return {
    web3: instance,
    addresses,
    contracts,
    methods,
  }
}
