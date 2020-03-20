import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { FlexWrap } from '~/components/common/Wrapper'

import AssetDetail from './AssetDetail'
import AssetItem from './AssetItem'

const Wrapper = styled(FlexWrap)``
const Items = styled(FlexWrap)`
  margin: -15px;
  align-items: stretch;
  margin-bottom: 15px;
`

export default connect(state => state)(function({ children, data, loadMore, ...props }) {
  const {
    methods: {
      addresses: { getName },
      FRight: { isFrozen, isUnfreezable, isIMintAble, metadata },
      IRight: { metadata: iMetadata },
    },
  } = props
  const [item, setItem] = useState(null)

  const handleSelect = item => {
    const {
      token_id: tokenId,
      asset_contract: { address },
    } = item
    setItem(item)

    const type = getName(address)
    switch (type) {
      case 'FRight':
        Promise.all([metadata(tokenId), isIMintAble(tokenId), isUnfreezable(tokenId)]).then(
          ([metadata, isIMintAble, isUnfreezable]) => {
            setItem({ ...item, type, metadata, isIMintAble, isUnfreezable })
          }
        )
        break
      case 'IRight':
        Promise.all([iMetadata(tokenId)]).then(([metadata]) => {
          setItem({ ...item, type, metadata })
        })
        break
      default:
        isFrozen(address, tokenId).then(isFrozen => {
          setItem({ ...item, isFrozen })
        })
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
          onReload={() => {
            loadMore(true)
            setItem(null)
          }}
          onClose={() => setItem(null)}
        />
      )}
    </Wrapper>
  )
})
