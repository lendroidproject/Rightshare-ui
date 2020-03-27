import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Assets from '~/components/Assets'

const Wrapper = styled.div``

export default connect(state => state)(function({ children, onTab, ...props }) {
  const {
    address: owner,
    dispatch,
    iRights: assets = [],
    addresses: { IRight: asset_contract_address },
  } = props
  const [page, setPage] = useState({ offset: 0 })

  const myAssets = query =>
    getMyAssets({ ...query, asset_contract_address })
      .then(response => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_IRIGHTS',
          payload: allAssets,
        })
        setPage({ offset: allAssets.length })
      })
      .catch(error => {
        dispatch({
          type: 'GET_MY_IRIGHTS',
          payload: [],
          error,
        })
      })
  const loadMore = refresh =>
    myAssets(
      refresh
        ? {
            offset: 0,
            owner,
          }
        : { ...page, owner }
    )

  useEffect(() => {
    if (owner) {
      myAssets({
        offset: 0,
        owner,
      })
    }
  }, [owner])

  return (
    <Wrapper>
      <Assets data={assets} loadMore={loadMore} onTab={onTab} />
    </Wrapper>
  )
})
