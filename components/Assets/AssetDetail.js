import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { intlActions, intlTransactions } from '~utils/translation'
import { validate } from '~utils/validation'
import { FlexCenter, FlexInline } from '~components/common/Wrapper'
import Spinner from '~components/common/Spinner'

import AssetForm from './AssetForm'
import AssetMetaData from './AssetMetaData'
import TransferForm from './TransferForm'

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

export const ItemDetail = styled(FlexInline)`
  align-items: stretch;
  padding: 10px;
  border-radius: 5px;
  background: white;
  max-width: 80%;
  position: relative;
  max-height: 100vh;
  overflow: auto;

  @media all and (max-width: 767px) {
    flex-wrap: wrap;
    max-width: 90%;
    max-height: 90vh;
  }

  > * {
    width: 384px;
    max-width: 100%;
    align-items: center;
    padding: 10px;
  }

  .actions {
    position: relative;
    min-height: 60px;
  }

  .external {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    padding: 0;

    img {
      height: auto;
      max-height: 384px;
    }
  }

  .info {
    position: relative;

    .heading {
      display: flex;
      justify-content: space-between;

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    h2 {
      margin: 0 0 10px;
    }

    .owner {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      img {
        border-radius: 50%;
        width: 35px;
        margin-right: 10px;
      }
    }

    p.desc {
      font-size: 13px;
    }
  }

  .buttons {
    margin: 0 -6px;
    display: flex;
    align-items: flex-start;
    font-size: 13px;

    button {
      min-width: 145px;
    }

    .tooltip {
      margin: 12px 6px;
      position: relative;

      &__info {
        padding: 3px 5px;
        text-align: center;
        font-size: 11px;

        position: absolute;
        white-space: nowrap;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        text-align: center;
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
      color: #27a0f7;
      text-decoration: none;
      font-size: 15px;
    }
  }
`

const Close = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 24px;
  height: 24px;
  background: lightgrey;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background: grey;
  }

  &:before,
  &:after {
    position: absolute;
    left: 11px;
    top: 4px;
    content: ' ';
    height: 16px;
    width: 2px;
    background-color: white;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`

const transformUTC = (time) => {
  const date = new Date(time)
  const dateUTC = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  return new Date(dateUTC).toISOString()
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
      RightsDao: { freeze, unfreeze, issueI, revokeI },
      IRight: { transfer },
    },
    addresses: { RightsDao: approveAddress },
  } = props

  const [availables, setAvailables] = useState({})
  const [originFreezeForm, setFreezeForm] = useState(null)
  const [transferForm, setTransferForm] = useState(null)
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const [txInfo, setTxInfo] = useState([])
  const [txHash, setTxHash] = useState('')
  const [txStatus, setTxStatus] = useState('')

  const handleFreezeForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setFreezeForm(form)
    estimateFreeze(form)
  }
  const handleTransferForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setTransferForm(form)
    estimateTransfer(form)
  }

  const handleTransaction = ({ send }, [name, ...args]) => {
    const isFunc = typeof intlTx[name] === 'function'
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
        .then((gasLimit) => resolve({ [type]: gasLimit }))
        .catch(() => resolve({ [type]: -1 }))
    )
  const estimateGas = () => {
    const transansactions = []
    if (!type) transansactions.push(['approve', approve(address)(approveAddress, tokenId, { from: owner })])
    if (isUnfreezable) transansactions.push(['unfreeze', unfreeze(tokenId, { from: owner })])
    if (isIMintable && !freezeForm.isExclusive)
      transansactions.push(['issueI', issueI([metadata.tokenId, Number(metadata.endTime), I_VERSION], { from: owner })])
    if (type === 'IRight') transansactions.push(['revokeI', revokeI(metadata.tokenId, { from: owner })])
    const init = {}
    transansactions.forEach(([key]) => (init[key] = 0))
    setAvailables(init)
    Promise.all(transansactions.map(handleEstimate))
      .then((availables) => {
        setAvailables(availables.reduce((a, c) => ({ ...a, ...c }), {}))
      })
      .catch((err) => console.error(err))
  }
  const estimateFreeze = (freezeForm) => {
    if (!freezeForm) return
    setAvailables({ ...availables, freeze: 0 })
    const transansactions = []
    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid] = validate(freezeForm, validations)
    if (isValid) {
      const { expiryDate, expiryTime, isExclusive, maxISupply } = freezeForm
      const [year, month, day] = expiryDate.split('-')
      const expiry = parseInt(new Date(Date.UTC(year, month - 1, day, ...expiryTime.split(':'))).getTime() / 1000)
      transansactions.push([
        'freeze',
        freeze(address, tokenId, expiry, [isExclusive ? 1 : maxISupply, F_VERSION, I_VERSION], {
          from: owner,
        }),
      ])
      Promise.all(transansactions.map(handleEstimate))
        .then((inputs) => {
          setAvailables({ ...availables, ...inputs.reduce((a, c) => ({ ...a, ...c }), {}) })
        })
        .catch((err) => {
          console.error(err)
          setAvailables({ ...availables, freeze: -1 })
        })
    }
  }
  const estimateTransfer = (transferForm) => {
    if (!transferForm) return
    setAvailables({ ...availables, transfer: 0 })
    const transansactions = []
    const validations = ['to']
    const [isValid] = validate(transferForm, validations)
    if (isValid) {
      transansactions.push(['transfer', transfer(owner, transferForm.to, metadata.tokenId, { from: owner })])
      Promise.all(transansactions.map(handleEstimate))
        .then((inputs) => {
          setAvailables({ ...availables, ...inputs.reduce((a, c) => ({ ...a, ...c }), {}) })
        })
        .catch((err) => {
          console.error(err)
          setAvailables({ ...availables, transfer: -1 })
        })
    }
  }

  const colors = (gasLimit) => {
    if (!gasLimit) return 'black'
    if (gasLimit === -1) return '#c30000'
    if (gasLimit >= GAS_LIMIT) return '#f9a825'
    return '#1b5e20'
  }
  const tooltips = (gasLimit) => {
    let ret = gasLimit
    if (gasLimit === -1) ret = 'unknown'
    if (!gasLimit) ret = '...'
    return `Estimated gas cost: ${ret}`
  }
  const WithToolTip = (element, type) => (
    <div className="tooltip">
      {element}
      <div className="tooltip__info" style={{ color: colors(availables[type]) }}>
        {tooltips(availables[type])}
      </div>
    </div>
  )

  useEffect(() => {
    if (item) {
      handleFreezeForm(null)
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

  const handleFreeze = (e) => {
    e.preventDefault()
    if (!freezeForm) {
      setStatus({ start: 'approve' })
      handleTransaction(approve(address)(approveAddress, tokenId, { from: owner }), ['approve'])
        .then(() => {
          const date = new Date(Date.now() + 1000 * 3600 * 24)
          handleFreezeForm({
            expiryDate: date.toISOString().split('T')[0],
            expiryTime: date.toISOString().split('T')[1].substr(0, 5),
            isExclusive: true,
            maxISupply: 1,
            circulatingISupply: 1,
          })
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setStatus(null)
        })
      return
    }

    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid, errors] = validate(freezeForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    setStatus({ start: 'freeze' })
    const { expiryDate, expiryTime, isExclusive, maxISupply } = freezeForm
    const [year, month, day] = expiryDate.split('-')
    const expiry = parseInt(new Date(Date.UTC(year, month - 1, day, ...expiryTime.split(':'))).getTime() / 1000)
    handleTransaction(
      freeze(address, tokenId, expiry, [isExclusive ? 1 : maxISupply, F_VERSION, I_VERSION], {
        from: owner,
      }),
      ['freeze']
    )
      .then(() => {
        onReload('freeze')
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
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

    setStatus({ start: 'issueI' })
    handleTransaction(issueI([metadata.tokenId, Number(metadata.endTime), I_VERSION], { from: owner }), ['issueI'])
      .then(() => {
        onReload()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setStatus(null)
      })
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

  return (
    <ItemOverlay onClick={handleClose}>
      <ItemDetail onClick={(e) => e.stopPropagation()}>
        <a href={permalink} className="external" target="_blank">
          <img
            src={
              infoImage || image
                ? infoImage || image
                : `https://via.placeholder.com/512/FFFFFF/000000?text=%23${tokenId}`
            }
            alt={infoName || name}
            style={{
              background: infoBack || background ? `#${infoBack || background}` : 'white',
            }}
          />
        </a>
        {!metadata || metadata.baseAssetAddress !== '0x0000000000000000000000000000000000000000' ? (
          <div className="info">
            <Close onClick={handleClose} />
            <div className="heading">
              <p>{assetName}</p>
            </div>
            <h2>{infoName || name}</h2>
            <div className="owner">
              <img src={avatar} alt={userName} />
              <span>
                Owned by <b>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</b>
              </span>
            </div>
            <p className="desc">{infoDesc || description}</p>
            <div className="price">Price: {price ? price : 0}</div>
            <div className="actions">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {!type &&
                    (!!freezeForm ? (
                      <AssetForm
                        lang={lang}
                        {...{
                          form: freezeForm,
                          setForm: handleFreezeForm,
                        }}
                        errors={errors}
                      />
                    ) : (
                      <div className="buttons">
                        {isFrozen === false &&
                          WithToolTip(
                            <button
                              onClick={handleFreeze}
                              data-for="approve"
                              data-tip={tooltips(availables['approve'], 'approve')}
                            >
                              {intl.freeze}
                            </button>,
                            'approve'
                          )}
                      </div>
                    ))}
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
                          disabled={!!status}
                          onClick={handleFreeze}
                          data-for="freeze"
                          data-tip={tooltips(availables['freeze'])}
                        >
                          {intl.submit}
                          {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                        </button>,
                        'freeze'
                      )}
                    {isUnfreezable &&
                      WithToolTip(
                        <button
                          disabled={!!status}
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
                          disabled={!!status}
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
                            disabled={!!status}
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
                        <button disabled={!!status} onClick={handleTransfer}>
                          {intl.transfer}
                        </button>
                      ))}
                    {type === 'IRight' &&
                      !transferForm &&
                      WithToolTip(
                        <button
                          disabled={!!status}
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
    </ItemOverlay>
  )
}
