import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { FlexWrap } from '~components/common/Wrapper'

import AssetDetail from './AssetDetail'
import CreateMeta from './CreateMeta'
import AssetItem from './AssetItem'
import SuccessModal from './SuccessModal'

const Wrapper = styled(FlexWrap)`
  padding: 20px 0;
  @media all and (max-width: 767px) {
    width: 100%;
    padding: 0;
  }
`

const Items = styled(FlexWrap)`
  margin: 0 -20px;
  justify-content: center;
  @media all and (max-width: 767px) {
    padding: 18px 10px;
    border-radius: 12px;
    background: var(--color-bg);
    margin: 0;
  }
`

export default connect((state) => state)(function ({
  meta,
  setMeta,
  item,
  setItem,
  children,
  data,
  loadMore,
  onTab,
  onParent,
  lang,
  ...props
}) {
  const {
    dispatch,
    methods: {
      addresses: { getName },
      FRight: { isFrozen, isUnfreezable, isIMintable, metadata },
      IRight: { metadata: iMetadata },
      // RightsDao: { currentFVersion, currentIVersion },
    },
  } = props

  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = (item) => {
    const {
      token_id: tokenId,
      asset_contract: { address },
    } = item
    // setItem(item)
    setLoading(true)

    const type = getName(address)
    switch (type) {
      case 'FRight':
        Promise.all([metadata(tokenId), isIMintable(tokenId), isUnfreezable(tokenId)])
          .then(([metadata, isIMintable, isUnfreezable]) => {
            setItem({ ...item, type, metadata, isIMintable, isUnfreezable })
            setLoading(false)
          })
          .catch(console.log)
        break
      case 'IRight':
        Promise.all([iMetadata(tokenId)])
          .then(([metadata]) => {
            setItem({ ...item, type, metadata })
            setLoading(false)
          })
          .catch(console.log)
        break
      default:
        Promise.all([isFrozen(address, tokenId) /*, currentFVersion(), currentIVersion()*/])
          .then(([isFrozen, fVersion = 1, iVersion = 1]) => {
            setItem({ ...item, isFrozen, fVersion, iVersion })
            setLoading(false)
          })
          .catch(console.log)
    }
  }

  const handleClose = () => {
    setMeta(null)
    setItem(null)
  }

  return (
    <Wrapper>
      {meta ? (
        <CreateMeta
          lang={lang}
          item={item}
          loading={loading}
          onReload={(reason) => {
            setItem(null)
            if (reason) {
              switch (reason) {
                default:
                  setSuccess(reason)
              }
            } else {
              dispatch({
                type: 'RESET_ASSETS',
                payload: {},
              })
              loadMore(true)
            }
          }}
          onClose={handleClose}
          {...props}
        />
      ) : (
        data.length > 0 && (
          <Items>
            {data.map((asset, index) => (
              <AssetItem key={index} {...asset} onSelect={handleSelect} />
            ))}
          </Items>
        )
      )}
      {item && !meta && (
        <AssetDetail
          lang={lang}
          item={item}
          loading={loading}
          onReload={(reason) => {
            setItem(null)
            if (reason) {
              switch (reason) {
                default:
                  setSuccess(reason)
              }
            } else {
              dispatch({
                type: 'RESET_ASSETS',
                payload: {},
              })
              loadMore(true)
            }
          }}
          onClose={handleClose}
          onCreateMeta={() => setMeta(true)}
          {...props}
        />
      )}
      {success && (
        <SuccessModal
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
})
