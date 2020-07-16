import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { FlexWrap } from '~components/common/Wrapper'

import AssetDetail from './AssetDetail'
import AssetItem from './AssetItem'
import SuccessModal from './SuccessModal'

const Wrapper = styled(FlexWrap)``
const Items = styled(FlexWrap)`
  margin: -10px;
  align-items: stretch;
  margin-bottom: 15px;
  width: 100%;
`

export default connect((state) => state)(function ({ children, data, loadMore, onTab, onParent, lang, ...props }) {
  const {
    dispatch,
    methods: {
      addresses: { getName },
      FRight: { isFrozen, isUnfreezable, isIMintable, metadata },
      IRight: { metadata: iMetadata },
      // RightsDao: { currentFVersion, currentIVersion },
    },
  } = props
  const [item, setItem] = useState(null)
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
        Promise.all([metadata(tokenId), isIMintable(tokenId), isUnfreezable(tokenId)]).then(
          ([metadata, isIMintable, isUnfreezable]) => {
            setItem({ ...item, type, metadata, isIMintable, isUnfreezable })
            setLoading(false)
          }
        )
        break
      case 'IRight':
        Promise.all([iMetadata(tokenId)]).then(([metadata]) => {
          setItem({ ...item, type, metadata })
          setLoading(false)
        })
        break
      default:
        Promise.all([isFrozen(address, tokenId)/*, currentFVersion(), currentIVersion()*/]).then(
          ([isFrozen, fVersion = 1, iVersion = 1]) => {
            setItem({ ...item, isFrozen, fVersion, iVersion })
            setLoading(false)
          }
        )
    }
  }

  return (
    <Wrapper>
      <Items>
        {data.map((asset, index) => (
          <AssetItem key={index} {...asset} onSelect={handleSelect} />
        ))}
      </Items>
      {item && (
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
          onClose={() => setItem(null)}
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
