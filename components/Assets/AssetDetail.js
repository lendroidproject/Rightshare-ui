import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import dayjs from 'dayjs'

import { intlActions, intlTransactions } from '~utils/translation'
import { validate } from '~utils/validation'
import { tinyURL } from '~utils/api'
import { FlexCenter, FlexInline } from '~components/common/Wrapper'
import Spinner from '~components/common/Spinner'

import AssetForm, { Templates } from './AssetForm'
import AssetMetaData from './AssetMetaData'
import TransferForm from './TransferForm'

import { Carousel } from 'react-responsive-carousel'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const ETHERSCAN = MAIN_NETWORK ? 'https://etherscan.io/tx/' : 'https://rinkeby.etherscan.io/tx/'

const GAS_LIMIT = 5000000
const F_VERSION = 1
const I_VERSION = 1

export const ItemOverlay = styled(FlexCenter)`
  background: rgba(0, 0, 0, 0.7);
  z-index: 11;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`

export const Wrapper = styled.div`
  padding: 15px 25px;
  border-radius: 5px;
  background: white;
  max-width: 90%;
  position: relative;
  max-height: 100vh;
  overflow: auto;

  @media all and (max-width: 767px) {
    max-height: 90vh;
    padding: 15px 15px;
  }

  .heading {
    padding-bottom: 12px;
    border-bottom: 1px solid #ccc;

    p {
      margin: 0;
      font-size: 16px;

      span {
        color: #232160;
      }
    }
  }
`

export const ItemDetail = styled(FlexInline)`
  align-items: stretch;
  margin: -8px;

  @media all and (max-width: 767px) {
    flex-wrap: wrap;
    margin: 0;
  }

  > div {
    padding: 20px 8px 8px;
    margin: 8px;
  }

  .actions {
    position: relative;
    min-height: 60px;
  }

  .item-view {
    max-width: 260px;
    @media all and (max-width: 767px) {
      max-width: unset;
      width: 100%;
      margin: 0;
      padding: 8px;
    }

    .carousel-root {
      width: 213px;
      height: 281px;
      margin: auto;
    }

    .carousel .thumbs {
      padding-left: 0;
    }

    .carousel .thumb {
      width: 51px;
      padding: 0;
    }

    .template {
      position: relative;
      max-width: 213px;
      width: 100%;
      cursor: pointer;
      display: flex;

      .origin {
        position: absolute;
        left: 23.5%;
        width: 55%;
        top: 23.5%;
        height: 42%;
        border-radius: 5px;
      }

      .metadata {
        position: absolute;
        bottom: 6.5%;
        height: 11%;
        left: 10%;
        right: 10%;
        font-size: xx-small;
        letter-spacing: -0.2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: courier;
        white-space: nowrap;
        font-weight: 900;
      }
    }

    .carousel .slide {
      width: auto;
      background: transparent;
    }
  }

  .external {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 0;

    &.freeze {
      flex-direction: column;

      .previews {
        margin: 20px -3px 10px;

        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .preview {
          width: 51px;
          height: 63.33px;
          margin: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          border: 3px solid transparent;
          border-radius: 3px;
          padding: 3px;

          position: relative;
          .trash {
            display: none;
            position: absolute;
            z-index: 1;
            right: 3px;
            top: 3px;
            color: #c80e68;
            font-size: 10px;
          }

          &:not(.new):hover {
            .trash {
              display: block;
            }

            &:after {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              background: rgba(255, 255, 255, 0.4);
            }
          }

          &.active {
            border-color: #232160;
          }

          .origin {
            border-radius: 2px;
          }

          .metadata {
            font-size: 2px;
          }

          &.new:hover {
            filter: invert(0.3);
          }

          img.close {
            width: 30px;
          }
        }
      }
    }

    img.image {
      height: auto;
      max-height: 281px;
      max-width: 100%;
    }

    img.close {
      width: 45px;
      position: absolute;
      left: 50%;
      top: 44%;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  .info {
    position: relative;
    width: 460px;
    max-width: 100%;

    p.desc {
      font-size: 16px;
      margin-top: 0;
    }
  }

  .owner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 12px;

    span {
      color: #232160;
    }

    img {
      border-radius: 50%;
      width: 25px;
      margin-right: 5px;
    }
  }

  .buttons {
    margin: 0 -6px;
    display: flex;
    align-items: flex-start;
    font-size: 13px;
    @media all and (max-width: 767px) {
      flex-direction: column;
      margin: 0 0;
    }

    button {
      min-width: 145px;
      @media all and (max-width: 767px) {
        width: 100%;
        padding: 8px 15px;
        font-size: 100%;
      }
    }

    .tooltip {
      margin: 12px 6px;
      position: relative;
      @media all and (max-width: 767px) {
        width: 100%;
        margin: 12px 0;
      }

      &__info {
        padding: 3px 5px;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        white-space: nowrap;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        text-align: center;

        .tip {
          color: #222060;
          font-weight: bold;
          margin-left: 5px;
          cursor: pointer;
        }
      }

      button {
        margin-top: 0;
      }
    }
  }

  .tx-info {
    margin-bottom: 15px;
    padding: 0 15px;

    &.solid {
      text-align: center;
    }

    h3 {
      text-align: center;
      margin: 15px 0;
    }

    &__item {
      font-size: 13px;
    }
  }

  .message {
    margin-bottom: 10px;
    font-size: 15px;
  }

  .tx-hash {
    a {
      color: #123fca;
      font-size: 15px;
    }
  }

  .__react_component_tooltip {
    max-width: 260px;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 12px;
    font-weight: normal;

    &.show {
      opacity: 1;
    }
  }
`

const Close = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #e2b224;
  background: white;

  &:before,
  &:after {
    position: absolute;
    left: 9px;
    top: 4px;
    content: ' ';
    height: 12px;
    width: 2px;
    background-color: #e2b224;
    border-radius: 1px;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`

const Template = styled.div`
  border-radius: 6px;
  background-color: #ecebeb;

  text-align: center;
  padding: 14px 16px;

  font-size: 11px;
  font-weight: 900;
  text-align: center;

  a {
    font-size: 12px;
    color: #123fca;
    font-weight: 100;
    margin-top: 3px;
    display: block;
  }
`

const transformUTC = (time, isDate = false) => {
  const date = new Date(time)
  const dateUTC = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  return isDate ? new Date(dateUTC) : new Date(dateUTC).toISOString()
}

const transformUTCfromString = (date, time) => {
  return dayjs(`${date}T${time}:00`)
}

const transformFreeze = ({ expiry, endTime, isExclusive, maxISupply, circulatingISupply, serialNumber }) => ({
  expiry: transformUTC(Number(expiry || endTime) * 1000),
  expiryDate: transformUTC(Number(expiry || endTime) * 1000).split('T')[0],
  expiryTime: transformUTC(Number(expiry || endTime) * 1000)
    .split('T')[1]
    .substr(0, 5),
  isExclusive,
  maxISupply,
  circulatingISupply,
  serialNumber,
})

export default ({ lang, item, loading, onReload, onClose, ...props }) => {
  const intl = intlActions(lang)
  const intlTx = intlTransactions(lang)
  const {
    address: owner,
    methods: {
      NFT: { approve },
      RightsDao: { freeze /*, issueUnencumberedI*/, unfreeze, issueI, revokeI },
      IRight: { transfer },
    },
    addresses: { RightsDao: approveAddress },
  } = props

  const [availables, setAvailables] = useState({})
  const [originFreezeForm, setFreezeForm] = useState(null)
  const [active, setActive] = useState(0)
  const [metaTokens, setMetaTokens] = useState([])
  const [transferForm, setTransferForm] = useState(null)
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const [txInfo, setTxInfo] = useState([])
  const [txHash, setTxHash] = useState('')
  const [txStatus, setTxStatus] = useState('')
  const [txErrors, setTxErrors] = useState({})

  const handleTransaction = ({ send }, [origin, ...args]) => {
    const isFunc = typeof intlTx[name] === 'function'
    const name = freezeForm && !freezeForm.isExclusive && origin === 'freeze' ? 'issueUnencumberedI' : origin
    setTxInfo(isFunc ? intlTx[name](...args) : intlTx[name])
    setTxHash('')
    setTxStatus('Waiting for sign transaction...')
    return new Promise((resolve, reject) => {
      send()
        .on('transactionHash', function (hash) {
          console.log(hash)
          setTxHash(hash)
          setTxStatus('Waiting for confirmation...')
        })
        .on('receipt', function (receipt) {
          console.log(receipt)
          setTxStatus('Transaction confirmed!')
          setTimeout(() => resolve(receipt), 100)
        })
        .on('error', (err) => {
          setTxStatus('Transaction failed or declined!')
          reject(err)
        })
    })
  }
  const handleEstimate = ([type, { estimate }]) =>
    new Promise((resolve) =>
      estimate()
        .then((gasLimit) => resolve({ [type]: gasLimit <= 0 ? -1 : gasLimit }))
        .catch((err) => {
          const { code, message } = err
          setTxErrors({ ...txErrors, [type]: `${intl[type]} cannot be performed on this NFT.\n(${code}: ${message})` })
          resolve({ [type]: -1 })
        })
    )
  const estimateGas = () => {
    const transansactions = []
    // if (!type) transansactions.push(['approve', approve(address)(approveAddress, tokenId, { from: owner })])
    if (isUnfreezable) transansactions.push(['unfreeze', unfreeze(tokenId, { from: owner })])
    // if (isIMintable && !freezeForm.isExclusive)
    //   transansactions.push(['issueI', issueI([metadata.tokenId, Number(metadata.endTime), I_VERSION], { from: owner })])
    if (type === 'IRight') transansactions.push(['revokeI', revokeI(metadata.tokenId, { from: owner })])
    const init = {}
    transansactions.forEach(([key]) => key !== 'approve' && (init[key] = 0))
    setAvailables(init)
    setTxErrors({ ...txErrors, global: '' })
    Promise.all(transansactions.map(handleEstimate))
      .then((availables) => {
        setAvailables(availables.reduce((a, c) => ({ ...a, ...c }), {}))
      })
      .catch((err) => {
        setTxErrors({ ...txErrors, global: (err && err.message) || 'Something went wrong' })
      })
  }

  const handleFreezeForm = (form, init) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setFreezeForm(form)
    if (form) {
      init && setMetaTokens(init)
    } else {
      setMetaTokens([])
    }
  }
  useEffect(() => {
    estimateFreeze()
  }, [freezeForm, metaTokens])
  const estimateFreeze = () => {
    if (!freezeForm || !metaTokens.length) return

    const transansactions = []
    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid] = validate(freezeForm, validations)

    if (freezeForm.isExclusive && availables.approve !== 0) return
    if (isValid) {
      setAvailables({ ...availables, freeze: 0 })
      const { expiryDate, expiryTime, isExclusive, maxISupply } = freezeForm
      const expiry = parseInt(transformUTC(`${expiryDate}T${expiryTime}:00`, true).getTime() / 1000)
      transansactions.push([
        'freeze',
        isExclusive
          ? freeze(address, tokenId, expiry, [isExclusive ? 1 : maxISupply, F_VERSION, I_VERSION], metaTokens, {
              from: owner,
            })
          : issueI(
              address,
              [tokenId, 0, expiry, I_VERSION],
              metaTokens.map(({ purpose, description, imageUrl, termsUrl = 'none' }) => [
                purpose,
                description,
                imageUrl,
                termsUrl,
              ]),
              {
                from: owner,
              }
            ),
      ])
      setTxErrors({ ...txErrors, global: '' })
      Promise.all(transansactions.map(handleEstimate))
        .then((inputs) => {
          setAvailables({ ...availables, ...inputs.reduce((a, c) => ({ ...a, ...c }), {}) })
        })
        .catch((err) => {
          const { arg, code, reason, message } = err
          if (code) {
            setTxErrors({
              ...txErrors,
              freeze: `${intl.freeze} cannot be performed on this NFT.\n(${code}: "${arg}" ${reason})`,
            })
          } else {
            setTxErrors({
              ...txErrors,
              global: message || 'Something went wrong',
            })
          }
          setAvailables({ ...availables, freeze: -1 })
        })
    }
  }
  const handleTransferForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setTransferForm(form)
  }
  useEffect(() => {
    estimateTransfer()
  }, [transferForm])
  const estimateTransfer = () => {
    if (!transferForm) return
    setAvailables({ ...availables, transfer: 0 })
    const transansactions = []
    const validations = ['to']
    const [isValid] = validate(transferForm, validations)
    if (isValid) {
      transansactions.push(['transfer', transfer(owner, transferForm.to, metadata.tokenId, { from: owner })])
      setTxErrors({ ...txErrors, global: '' })
      Promise.all(transansactions.map(handleEstimate))
        .then((inputs) => {
          setAvailables({ ...availables, ...inputs.reduce((a, c) => ({ ...a, ...c }), {}) })
        })
        .catch((err) => {
          const { arg, code, reason, message } = err
          if (code) {
            setTxErrors({
              ...txErrors,
              transfer: `${intl.transfer} cannot be performed on this NFT.\n(${code}: "${arg}" ${reason})`,
            })
          } else {
            setTxErrors({
              ...txErrors,
              global: message || 'Something went wrong',
            })
          }
          setAvailables({ ...availables, transfer: -1 })
        })
    }
  }

  const colors = (gasLimit) => {
    if (txErrors.global || gasLimit === -1) return '#c30000'
    if (!gasLimit) return 'black'
    if (gasLimit >= GAS_LIMIT) return '#f9a825'
    return '#1b5e20'
  }
  const tooltips = (gasLimit) => {
    if (txErrors.global || gasLimit === -1) return 'Not available'
    let ret = gasLimit
    if (!gasLimit) ret = '...'
    return `Estimated gas cost: ${ret}`
  }
  const WithToolTip = (element, type) => (
    <div className="tooltip">
      {element}
      <div className="tooltip__info" style={{ color: colors(availables[type]) }}>
        {tooltips(availables[type])}{' '}
        {(availables[type] === -1 || txErrors.global) && (
          <div className="tip">
            <span data-for={type} data-tip={type} style={{ color: colors(availables[type]) }}>
              &#9432;
            </span>
            <ReactTooltip id={type} effect="solid">
              {txErrors.global || txErrors[type]}
            </ReactTooltip>
          </div>
        )}
      </div>
    </div>
  )

  useEffect(() => {
    if (item) {
      if (!type && !freezeForm) {
        handleFreeze()
      } else {
        handleFreezeForm(freezeForm)
      }
      handleTransferForm(null)
      estimateGas()
    }

    return () => {
      handleFreezeForm(null)
      handleTransferForm(null)
    }
  }, [item])

  if (!item) return null
  const {
    name,
    asset_contract: { name: assetName, address },
    owner: { user, profile_img_url: avatar },
    permalink,
    // external_link: external,
    current_price: price,
    image_url: image,
    background_color: background,
    description,
    type,
    isFrozen,
    metadata,
    isUnfreezable,
    isIMintable,
    token_id: tokenId,
    tokenInfo: {
      name: infoName,
      background_color: infoBack,
      description: infoDesc,
      expiry: infoExpiry,
      image: infoImage,
    } = {},
  } = item
  const userName = (user && user.username) || '---'
  const freezeForm = metadata ? transformFreeze({ ...metadata, expiry: infoExpiry }) : originFreezeForm

  const handleApprove = (e) => {
    e && e.preventDefault()
    setStatus({ start: 'approve' })
    handleTransaction(approve(address)(approveAddress, tokenId, { from: owner }), ['approve'])
      .then(() => {
        setAvailables({ ...availables, approve: 0 })
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
  }
  const handleNewMeta = (meta) => {
    setMetaTokens([
      ...metaTokens,
      {
        purpose: 'Rental',
        description: '',
        imageUrl: Templates[0],
        termsUrl: '',
        ...meta,
      },
    ])
    setActive(metaTokens.length)
  }
  const handleRemoveMeta = (index) => {
    setMetaTokens(metaTokens.filter((_, idx) => idx !== (index || active)))
  }
  const handleFreeze = (e) => {
    e && e.preventDefault()
    if (!freezeForm) {
      const date = new Date(Date.now() + 1000 * 3600 * 24)
      handleFreezeForm(
        {
          expiryDate: date.toISOString().split('T')[0],
          expiryTime: date.toISOString().split('T')[1].substr(0, 5),
          isExclusive: false,
          maxISupply: 1,
          circulatingISupply: 1,
        },
        [{ purpose: 'Rental', description: '', imageUrl: Templates[0], termsUrl: '' }]
      )
      // setStatus({ start: 'approve' })
      // handleTransaction(approve(address)(approveAddress, tokenId, { from: owner }), ['approve'])
      //   .then(() => {
      //     const date = new Date(Date.now() + 1000 * 3600 * 24)
      //     setAvailables({ ...availables, approve: 1 })
      //     handleFreezeForm({
      //       expiryDate: date.toISOString().split('T')[0],
      //       expiryTime: date.toISOString().split('T')[1].substr(0, 5),
      //       isExclusive: false,
      //       maxISupply: 1,
      //       circulatingISupply: 1,
      //       purpose: 'Rental',
      //       description: '',
      //       imageUrl: Templates[0],
      //       termsUrl: '',
      //     })
      //   })
      //   .catch((err) => console.log(err))
      //   .finally(() => {
      //     setStatus(null)
      //   })
      return
    }

    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid, errors] = validate(freezeForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    const { expiryDate, expiryTime, isExclusive, maxISupply } = freezeForm
    const [year, month, day] = expiryDate.split('-')
    const expiry = parseInt(new Date(Date.UTC(year, month - 1, day, ...expiryTime.split(':'))).getTime() / 1000)

    Promise.all(metaTokens.map(({ imageUrl }) => tinyURL(imageUrl)))
      .then((imageUrls) => {
        setStatus({ start: 'freeze' })
        handleTransaction(
          isExclusive
            ? freeze(
                address,
                tokenId,
                expiry,
                [isExclusive ? 1 : maxISupply, F_VERSION, I_VERSION],
                metaTokens.map(({ purpose, description = 'none', termsUrl = 'none' }, idx) => [
                  purpose,
                  description,
                  imageUrls[idx],
                  termsUrl,
                ]),
                {
                  from: owner,
                }
              )
            : issueI(
                address,
                [tokenId, 0, expiry, I_VERSION],
                metaTokens.map(({ purpose, description = 'none', termsUrl = 'none' }, idx) => [
                  purpose,
                  description,
                  imageUrls[idx],
                  termsUrl,
                ]),
                {
                  from: owner,
                }
              ),
          ['freeze']
        )
          .then(() => {
            onReload('freeze')
          })
          .catch((err) => console.log(err))
          .finally(() => {
            setStatus(null)
          })
      })
      .catch(console.log)
  }
  const handleUnfreeze = (e) => {
    e.preventDefault()
    setStatus({ start: 'unfreeze' })
    handleTransaction(unfreeze(tokenId, { from: owner }), ['unfreeze'])
      .then(() => {
        onReload()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
  }
  const handleIssueI = (e) => {
    e.preventDefault()

    // setStatus({ start: 'issueI' })
    // handleTransaction(issueI([metadata.tokenId, Number(metadata.endTime), I_VERSION], { from: owner }), ['issueI'])
    //   .then(() => {
    //     onReload()
    //   })
    //   .catch((err) => console.log(err))
    //   .finally(() => {
    //     setStatus(null)
    //   })
  }
  const handleRevoke = (e) => {
    e.preventDefault()
    setStatus({ start: 'revokeI' })
    handleTransaction(revokeI(metadata.tokenId, { from: owner }), ['revokeI'])
      .then(() => {
        onReload()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
  }
  const handleTransfer = (e) => {
    e.preventDefault()
    if (!transferForm) {
      return handleTransferForm({ to: '' })
    }

    const validations = ['to']
    const [isValid, errors] = validate(transferForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    setStatus({ start: 'transfer' })
    handleTransaction(transfer(owner, transferForm.to, metadata.tokenId, { from: owner }), [
      'transfer',
      transferForm.to,
    ])
      .then(() => {
        onReload()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
  }

  const handleClose = (e) => {
    if (status) return
    onClose(e)
  }

  const [txTitle, ...txInfos] = txInfo

  const onFreeze = !type && freezeForm && !loading

  return (
    <ItemOverlay onMouseDown={handleClose}>
      <Wrapper onMouseDown={(e) => e.stopPropagation()}>
        <div className="heading">
          <p>
            {assetName}
            <br />
            <span>{infoName || name || `#${tokenId}`}</span>
          </p>
          <Close onClick={handleClose} />
        </div>
        <ItemDetail>
          <div className="item-view">
            {onFreeze ? (
              <div className="external freeze">
                <Carousel
                  showThumbs={false}
                  showIndicators={false}
                  emulateTouch
                  selectedItem={active}
                  onChange={(active) => setActive(active)}
                >
                  {metaTokens.map((metaToken) => (
                    <div className="template">
                      <img src={metaToken.imageUrl} className="image" />
                      <img
                        src={
                          infoImage || image
                            ? infoImage || image
                            : `https://via.placeholder.com/512/FFFFFF/000000?text=%23${tokenId}`
                        }
                        alt={infoName || name}
                        style={{
                          background: infoBack || background ? `#${infoBack || background}` : '#f3f3f3',
                        }}
                        className="origin"
                      />
                      {metaToken.description && (
                        <div className="metadata">
                          <span>{metaToken.description}</span>
                          <span>
                            Expires on{' '}
                            {transformUTCfromString(freezeForm.expiryDate, freezeForm.expiryTime).format(
                              'DD MMM YY, HH:mm'
                            )}{' '}
                            UTC
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="template new" onClick={() => handleNewMeta()}>
                    <img src={Templates[0]} className="image" />
                    <img src="/assets/close.svg" className="close" />
                  </div>
                </Carousel>
                <div className="previews">
                  {metaTokens.map((metaToken, idx) => (
                    <div className={`preview ${active === idx ? 'active' : ''}`} onClick={() => setActive(idx)}>
                      {metaTokens.length > 1 && (
                        <i className="trash fa fa-trash-alt" aria-hidden="true" onClick={() => handleRemoveMeta(idx)} />
                      )}
                      <div className="template">
                        <img src={metaToken.imageUrl} className="image" />
                        <img
                          src={
                            infoImage || image
                              ? infoImage || image
                              : `https://via.placeholder.com/512/FFFFFF/000000?text=%23${tokenId}`
                          }
                          alt={infoName || name}
                          style={{
                            background: infoBack || background ? `#${infoBack || background}` : '#f3f3f3',
                          }}
                          className="origin"
                        />
                        {metaToken.description && (
                          <div className="metadata">
                            <span>{metaToken.description}</span>
                            <span>
                              Expires on{' '}
                              {transformUTCfromString(freezeForm.expiryDate, freezeForm.expiryTime).format(
                                'DD MMM YY, HH:mm'
                              )}{' '}
                              UTC
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="preview new" onClick={() => handleNewMeta()}>
                    <div className="template">
                      <img src="/assets/close.svg" className="close" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <a href={permalink} className="external" target="_blank">
                <img
                  src={
                    infoImage || image
                      ? infoImage || image
                      : `https://via.placeholder.com/512/FFFFFF/000000?text=%23${tokenId}`
                  }
                  alt={infoName || name}
                  style={{
                    background: infoBack || background ? `#${infoBack || background}` : '#f3f3f3',
                  }}
                  className="image"
                />
              </a>
            )}
            <div className="owner">
              <img src={avatar} alt={userName} />
              Owned by&nbsp;<span>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</span>
            </div>
            {onFreeze && (
              <Template>
                If you plan to build your own frame then
                <br />
                <a href="/template.zip" download>
                  Click Here to download PSD template
                </a>
              </Template>
            )}
          </div>
          {!metadata || metadata.baseAssetAddress !== '0x0000000000000000000000000000000000000000' ? (
            <div className="info">
              {!onFreeze && <p className="desc">{infoDesc || description}</p>}
              {/* <div className="price">Price: {price ? price : 0}</div> */}
              <div className="actions">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {onFreeze && (
                      <AssetForm
                        lang={lang}
                        {...{
                          form: freezeForm,
                          setForm: handleFreezeForm,
                          active,
                          setActive,
                          metaTokens,
                          setMetaTokens,
                          onNewMeta: handleNewMeta,
                          onRemove: handleRemoveMeta,
                        }}
                        errors={errors}
                      />
                    )}
                    {type && !transferForm && <AssetMetaData data={freezeForm} />}
                    {type === 'IRight' && transferForm && (
                      <TransferForm
                        owner={owner}
                        {...{
                          form: transferForm,
                          setForm: handleTransferForm,
                        }}
                        errors={errors}
                      />
                    )}
                    <div className="buttons">
                      {isFrozen === false &&
                        freezeForm &&
                        WithToolTip(
                          <button
                            disabled={!!status || availables['freeze'] === -1}
                            onClick={handleFreeze}
                            data-for="freeze"
                            data-tip={tooltips(availables['freeze'])}
                          >
                            {intl.submit}
                            {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                          </button>,
                          freezeForm.isExclusive && availables['approve'] !== 0 ? 'approve' : 'freeze'
                          // freezeForm.isExclusive && availables['approve'] !== 0 ? (
                          //   <button
                          //     onClick={handleApprove}
                          //     data-for="approve"
                          //     data-tip={tooltips(availables['approve'])}
                          //   >
                          //     {intl.approve}
                          //     {status && status.start === 'approve' && <img src="/spinner.svg" />}
                          //   </button>
                          // ) : (
                          //   <button
                          //     disabled={!!status || availables['freeze'] === -1}
                          //     onClick={handleFreeze}
                          //     data-for="freeze"
                          //     data-tip={tooltips(availables['freeze'])}
                          //   >
                          //     {intl.submit}
                          //     {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                          //   </button>
                          // ),
                          // freezeForm.isExclusive && availables['approve'] !== 0 ? 'approve' : 'freeze'
                        )}
                      {isUnfreezable &&
                        WithToolTip(
                          <button
                            disabled={!!status || availables['unfreeze'] === -1}
                            onClick={handleUnfreeze}
                            data-for="unfreeze"
                            data-tip={tooltips(availables['unfreeze'])}
                          >
                            {intl.unfreeze}
                            {status && status.start === 'unfreeze' && <img src="/spinner.svg" />}
                          </button>,
                          'unfreeze'
                        )}
                      {isIMintable &&
                        !freezeForm.isExclusive &&
                        WithToolTip(
                          <button
                            disabled={!!status || availables['issueI'] === -1}
                            onClick={handleIssueI}
                            data-for="issueI"
                            data-tip={tooltips(availables['issueI'])}
                          >
                            {intl.issueI}
                            {status && status.start === 'issueI' && <img src="/spinner.svg" />}
                          </button>,
                          'issueI'
                        )}
                      {type === 'IRight' &&
                        (transferForm ? (
                          WithToolTip(
                            <button
                              disabled={!!status || availables['transfer'] === -1}
                              onClick={handleTransfer}
                              data-for="transfer"
                              data-tip={tooltips(availables['transfer'])}
                            >
                              {intl.submit}
                              {status && status.start === 'transfer' && <img src="/spinner.svg" />}
                            </button>,
                            'transfer'
                          )
                        ) : (
                          <button onClick={handleTransfer}>{intl.transfer}</button>
                        ))}
                      {type === 'IRight' &&
                        !transferForm &&
                        WithToolTip(
                          <button
                            disabled={!!status || availables['revokeI'] === -1}
                            onClick={handleRevoke}
                            data-for="revokeI"
                            data-tip={tooltips(availables['revokeI'])}
                          >
                            {intl.revokeI}
                            {status && status.start === 'revokeI' && <img src="/spinner.svg" />}
                          </button>,
                          'revokeI'
                        )}
                    </div>
                  </>
                )}
              </div>
              {status && status.start && (
                <Spinner>
                  <div className={`tx-info ${txInfos.length > 1 ? '' : 'solid'}`}>
                    <h3>{txTitle}</h3>
                    {txInfos.map((txt, idx) => (
                      <div className="tx-info__item" key={idx}>
                        {txt}
                      </div>
                    ))}
                  </div>
                  {txHash && (
                    <div className="tx-hash">
                      <a href={`${ETHERSCAN}${txHash}`} target="_blank">
                        View transaction on Etherscan
                      </a>
                    </div>
                  )}
                </Spinner>
              )}
            </div>
          ) : (
            <div className="info">
              <h3>Asset is unavailable.</h3>
            </div>
          )}
        </ItemDetail>
      </Wrapper>
    </ItemOverlay>
  )
}
