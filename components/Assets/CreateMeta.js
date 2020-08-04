import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import dayjs from 'dayjs'

import { intlActions, intlTransactions } from '~utils/translation'
import { validate } from '~utils/validation'
import { tinyURL } from '~utils/api'
import { FlexCenter, FlexInline } from '~components/common/Wrapper'
import Spinner from '~components/common/Spinner'
import Button from '~components/common/Button'

import AssetForm, { Templates } from './AssetForm'
import ProgressModal from './ProgressModal'

import { Carousel } from 'react-responsive-carousel'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const ETHERSCAN = MAIN_NETWORK ? 'https://etherscan.io/tx/' : 'https://rinkeby.etherscan.io/tx/'

const GAS_LIMIT = 5000000
const F_VERSION = 1
const I_VERSION = 1

export const Wrapper = styled.div`
  width: 100%;

  .heading {
    border-bottom: 1px solid var(--color-line);
    padding: 0 5px 10px;
    margin-bottom: 14px;

    p {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-head);

      span {
        font-size: 12px;
        font-weight: normal;
      }
    }
  }

  > .button {
    margin-bottom: 15px;
  }
`

export const ItemDetail = styled(FlexInline)`
  align-items: flex-start;
  padding: 20px;

  border: 1px solid var(--color-grey);
  border-radius: 8px;
  background-color: var(--color-bg);
  box-shadow: var(--box-shadow4);

  @media all and (max-width: 767px) {
    flex-wrap: wrap;
    margin: 0;
  }

  > div {
    margin: 20px;
  }

  .actions {
    position: relative;
  }

  .item-view {
    width: 340px;
    max-width: 100%;

    border: 2px solid var(--color-dark);
    border-radius: 8px;
    background-color: var(--color-bg8);
    background: var(--color-grad8);
    box-shadow: var(--box-shadow1);

    padding: 10px 17px 17px;

    .carousel-root {
      height: 337px;
      width: 255px;
      margin: auto;
    }

    .carousel .thumbs {
      padding-left: 0;
    }

    .template {
      position: relative;
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

        color: var(--color-bg);
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

    .trash {
      display: block;
      position: absolute;
      z-index: 1;
      right: -7px;
      top: -12px;
      width: 36px;
      cursor: pointer;
    }

    &.freeze {
      flex-direction: column;
      position: relative;
      overflow: visible;
      width: 255px;
      margin: auto;

      .carousel-status {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 12px;
      }

      .previews {
        margin: 15px -3px;

        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .preview {
          width: 43px;
          height: 53px;

          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          padding: 4px;
          position: relative;
          border: 1px dashed transparent;
          border-radius: 4px;
          background-color: transparent;

          position: relative;

          &.active {
            border-color: var(--color-purple);
            background-color: var(--color-text);
          }

          .origin {
            border-radius: 2px;
          }

          .metadata {
            font-size: 2px;
          }

          img.close {
            width: 17px;
          }
        }
      }
    }

    .new.template {
      width: 100%;
      height: 100%;
      background: var(--color-input);
      border-radius: 2px;
    }

    img.image {
      height: auto;
      max-width: 100%;
    }

    img.close {
      width: 45px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  .info {
    position: relative;
    flex: 1;
    padding-bottom: 46px;

    display: flex;
    flex-direction: column;

    p.desc {
      font-size: 12px;
      margin: 20px 0;
      flex: 1;
    }
  }

  .owner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 12px;

    img {
      border-radius: 50%;
      width: 26px;
      margin-right: 8px;
    }
  }

  .buttons {
    button {
    }

    .tooltip {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media all and (max-width: 767px) {
      }

      &__info {
        font-size: 12px;
        display: flex;
        align-items: center;

        .tip {
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

const Template = styled.div`
  border-radius: 8px;
  background-color: var(--color-bg);
  box-shadow: var(--box-shadow4);

  padding: 14px 10px;

  font-size: 14px;
  text-align: center;

  a {
    font-size: 14px;
    color: var(--color-link);
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

  const colors = (gasLimit) => {
    if (txErrors.global || gasLimit === -1) return '#c30000'
    if (!gasLimit) return 'black'
    if (gasLimit >= GAS_LIMIT) return '#f9a825'
    return 'var(--color-green)'
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
    }

    return () => {
      handleFreezeForm(null)
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
    if ((index || active) >= metaTokens.length - 1) {
      setActive(0)
    }
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

  const [txTitle, ...txInfos] = txInfo

  return (
    <Wrapper onMouseDown={(e) => e.stopPropagation()}>
      <Button className="secondary image" onClick={() => onClose()}>
        <img src="/meta/arrow-circle.svg" />
        Back to My Assets
      </Button>
      <ItemDetail>
        <div className="item-view">
          <div className="heading">
            <p>
              {assetName}
              <br />
              <span>{infoName || name || `#${tokenId}`}</span>
            </p>
          </div>
          <div className="owner">
            <img src={avatar} alt={userName} />
            Owned by&nbsp;<span>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</span>
          </div>
          <div className="external freeze">
            {metaTokens.length > 1 && (
              <img src="/meta/delete.svg" className="trash" onClick={() => handleRemoveMeta(active)} />
            )}
            <Carousel
              showThumbs={false}
              showIndicators={false}
              showStatus={false}
              emulateTouch
              selectedItem={active}
              onChange={(active) => setActive(active)}
            >
              {metaTokens.map((metaToken, idx) => (
                <div className="template" key={idx}>
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
            </Carousel>
            <div className="carousel-status">
              <img src="/meta/arrow-left.svg" onClick={() => active >= 1 && setActive(active - 1)} />
              <span>
                {active + 1} / {metaTokens.length}
              </span>
              <img
                src="/meta/arrow-right.svg"
                onClick={() => active < metaTokens.length - 1 && setActive(active + 1)}
              />
            </div>
            <div className="previews">
              {metaTokens.map((metaToken, idx) => (
                <div key={idx} className={`preview ${active === idx ? 'active' : ''}`} onClick={() => setActive(idx)}>
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
              <div className="preview" onClick={() => handleNewMeta()}>
                <div className="template new">
                  <img src="/meta/add.svg" className="close" />
                </div>
              </div>
            </div>
          </div>
          <Template>
            If you plan to build your own frame then
            <br />
            <a href="/template.zip" download>
              Click Here to download PSD template
            </a>
          </Template>
        </div>
        {!metadata || metadata.baseAssetAddress !== '0x0000000000000000000000000000000000000000' ? (
          <div className="info">
            <div className="actions">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {freezeForm && (
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
                      }}
                      errors={errors}
                    />
                  )}
                  <div className="buttons">
                    {freezeForm &&
                      WithToolTip(
                        <Button
                          disabled={!!status || availables['freeze'] === -1}
                          onClick={handleFreeze}
                          data-for="freeze"
                          data-tip={tooltips(availables['freeze'])}
                        >
                          {intl.submit}
                          {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                        </Button>,
                        freezeForm.isExclusive && availables['approve'] !== 0 ? 'approve' : 'freeze'
                        // freezeForm.isExclusive && availables['approve'] !== 0 ? (
                        //   <Button
                        //     onClick={handleApprove}
                        //     data-for="approve"
                        //     data-tip={tooltips(availables['approve'])}
                        //   >
                        //     {intl.approve}
                        //     {status && status.start === 'approve' && <img src="/spinner.svg" />}
                        //   </Button>
                        // ) : (
                        //   <Button
                        //     disabled={!!status || availables['freeze'] === -1}
                        //     onClick={handleFreeze}
                        //     data-for="freeze"
                        //     data-tip={tooltips(availables['freeze'])}
                        //   >
                        //     {intl.submit}
                        //     {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                        //   </Button>
                        // ),
                        // freezeForm.isExclusive && availables['approve'] !== 0 ? 'approve' : 'freeze'
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
      {status && status.start && (
        <ProgressModal
          onClose={() => {
            dispatch({
              type: 'RESET_ASSETS',
              payload: {},
            })
            switch (success) {
              default:
                onParent(2)
            }
            setSuccess(null)
          }}
        />
      )}
    </Wrapper>
  )
}
