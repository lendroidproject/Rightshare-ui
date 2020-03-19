import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Assets from '~/components/Assets'

const Wrapper = styled.div``
const LoadMore = styled.div`
  text-align: center;

  button {
    background: transparent;
    color: black;
  }
`

export default connect(state => state)(function({ children, ...props }) {
  const { address: owner, dispatch, assets = [] } = props
  const [page, setPage] = useState({ offset: 0, limit: 20 })
  const [end, setEnd] = useState(false)

  const myAssets = query =>
    getMyAssets(query)
      .then(response => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: allAssets,
        })
        setPage({ offset: allAssets.length, limit: 20 })
        if (newAssets.length < query.limit) setEnd(true)
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
      <Assets data={assets} loadMore={loadMore} />
      {!end && (
        <LoadMore>
          <button onClick={loadMore}>Load more...</button>
        </LoadMore>
      )}
    </Wrapper>
  )
})
