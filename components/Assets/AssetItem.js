import styled from 'styled-components'
import { Flex } from '~/components/common/Wrapper'

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 1px 5px grey;
  cursor: pointer;
  background: #eee;

  &:hover {
    box-shadow: 0px 0px 7px #27a0f7;
  }
`
const Thumbnail = styled.div`
  width: 250px;
  height: 250px;
  max-width: 100%;
  display: felx;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
  }
`
const ItemInfo = styled(Flex)`
  justify-content: space-between;
  padding: 10px;
  min-height: 48px;

  .price {
    flex: 0 0 50px;
    text-align: right;
    display: none; /* Price */
  }
`

export default ({ onSelect, ...data }) => {
  const {
    token_id: id,
    // image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    image_url: original,
    name,
    background_color: background,
    current_price: price,
    decimals,
  } = data

  return (
    <ItemWrapper className="item" onClick={() => onSelect(data)}>
      <Thumbnail style={{ background: background ? `#${background}` : 'white' }}>
        <img src={original ? original : 'https://picsum.photos/250'} alt="" />
      </Thumbnail>
      <ItemInfo>
        <div>{name}</div>
        <div className="price">{Number(price ? price : 0).toFixed(decimals)}</div>
      </ItemInfo>
    </ItemWrapper>
  )
}
