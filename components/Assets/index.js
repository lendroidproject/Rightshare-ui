import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { fetchMetadata } from '~/utils/api'
import { FlexWrap } from '~/components/common/Wrapper'

import AssetDetail from './AssetDetail'
import AssetItem from './AssetItem'
import SuccessModal from './SuccessModal'

const Wrapper = styled(FlexWrap)``
const Items = styled(FlexWrap)`
  margin: -15px;
  align-items: stretch;
  margin-bottom: 15px;
`

export default connect((state) => state)(function ({ children, data, loadMore, onTab, ...props }) {
  const {
    methods: {
      addresses: { getName },
      FRight: { isFrozen, isUnfreezable, isIMintAble, metadata, tokenURI },
      IRight: { metadata: iMetadata, tokenURI: iTokenURI },
      RightsDao: { currentFVersion, currentIVersion },
    },
  } = props
  const [item, setItem] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSelect = (item) => {
    const {
      token_id: tokenId,
      asset_contract: { address },
    } = item
    setItem(item)

    const type = getName(address)
    switch (type) {
      case 'FRight':
        Promise.all([tokenURI(tokenId), metadata(tokenId), isIMintable(tokenId), isUnfreezable(tokenId)]).then(
          ([tokenURI, metadata, isIMintable, isUnfreezable]) => {
            fetchMetadata(tokenURI)
              .then(({ data: tokenInfo }) => {
                setItem({ ...item, type, tokenInfo, metadata, isIMintable, isUnfreezable })
              })
              .catch((err) => {
                console.error(err)
                setItem({ ...item, type, tokenInfo: {}, metadata, isIMintable, isUnfreezable })
              })
          }
        )
        break
      case 'IRight':
        Promise.all([iTokenURI(tokenId), iMetadata(tokenId)]).then(([tokenURI, metadata]) => {
          fetchMetadata(tokenURI)
            .then(({ data: tokenInfo }) => {
              setItem({ ...item, type, tokenInfo, metadata })
            })
            .catch((err) => {
              console.error(err)
              setItem({ ...item, type, tokenInfo: {}, metadata })
            })
        })
        break
      default:
        Promise.all([isFrozen(address, tokenId), currentFVersion(), currentIVersion()]).then(
          ([isFrozen, fVersion, iVersion]) => {
            setItem({ ...item, isFrozen, fVersion, iVersion })
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
          item={item}
          {...props}
          onReload={(reason) => {
            setItem(null)
            if (reason) {
              switch (reason) {
                default:
                  setSuccess(reason)
              }
            } else {
              loadMore(true)
            }
          }}
          onClose={() => setItem(null)}
        />
      )}
      {success && (
        <SuccessModal
          onClose={() => {
            switch (success) {
              default:
                onTab(0)
            }
            setSuccess(null)
          }}
        />
      )}
    </Wrapper>
  )
})
