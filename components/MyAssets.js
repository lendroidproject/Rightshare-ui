import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Assets from '~/components/Assets'

const Wrapper = styled.div``
// const LoadMore = styled.div`
//   text-align: center;

//   button {
//     background: transparent;
//     color: black;
//   }
// `

export default connect(state => state)(function({ children, onTab, ...props }) {
  const {
    address: owner,
    methods: {
      addresses: { getName },
    },
    dispatch,
    assets = [],
  } = props
  const [page, setPage] = useState({ offset: 0, limit: 20 })
  // const [end, setEnd] = useState(false)

  const myAssets = ({ limit, ...query }) =>
    // getMyAssets({...query, asset_contract_address: '0x79986af15539de2db9a5086382daeda917a9cf0c'})
    getMyAssets(query)
      .then(response => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: allAssets,
        })
        setPage({ offset: allAssets.length, limit: 20 })
        // if (newAssets.length < query.limit) setEnd(true)
      })
      .catch(error => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: [],
          error,
        })
      })
  const loadMore = refresh =>
    myAssets(
      refresh
        ? {
            offset: 0,
            limit: 20,
            owner,
          }
        : { ...page, owner }
    )

  useEffect(() => {
    if (owner) {
      myAssets({
        offset: 0,
        limit: 20,
        owner,
      })
    }
  }, [owner])

  return (
    <Wrapper>
      <Assets
        data={assets.filter(({ asset_contract: { address } }) => !getName(address))}
        loadMore={loadMore}
        onTab={onTab}
      />
      {/* {!end && (
        <LoadMore>
          <button onClick={loadMore}>Load more...</button>
        </LoadMore>
      )} */}
    </Wrapper>
  )
})
