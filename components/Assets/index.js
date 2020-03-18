import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
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
    methods: { isFrozen },
  } = props
  const [item, setItem] = useState(null)

  const handleSelect = item => {
    const {
      token_id: tokenId,
      asset_contract: { address },
    } = item
    isFrozen(address, tokenId).then(frozen => {
      setItem({ ...item, frozen })
    })
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
          onProceed={() => {
            loadMore(true)
            setItem(null)
          }}
          onClose={() => setItem(null)}
        />
      )}
    </Wrapper>
  )
})
