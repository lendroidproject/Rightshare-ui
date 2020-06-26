import styled from 'styled-components'
import Spinner from '~components/common/Spinner'

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 187px;
  margin: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #f3f3f3;
`
const Thumbnail = styled.div`
  height: 177px;
  margin: 15px;
  overflow: hidden;
  width: calc(100% - 30px);

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
  }
`
const ItemInfo = styled.div`
  padding: 0px 15px 15px;
  font-size: 12px;
  text-align: center;
`

export default ({ onSelect, ...data }) => {
  const {
    token_id: id,
    // image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    image_url: image,
    name,
    background_color: background,
    current_price: price,
    decimals,
    tokenInfo: { name: infoName, background_color: infoBack, image: infoImage } = {},
    loaded,
  } = data

  return (
    <ItemWrapper className="item" onClick={() => onSelect(data)}>
      <Thumbnail style={{ background: '#F3F3F3' }}>
        {!image && !loaded ? (
          <Spinner />
        ) : (
          <img
            src={
              infoImage || image ? infoImage || image : `https://via.placeholder.com/250/F3F3F3/000000?text=%23${id}`
            }
            alt={infoName || name}
            style={{ background: infoBack || background ? `#${infoBack || background}` : '#F3F3F3' }}
          />
        )}
      </Thumbnail>
      <ItemInfo>{infoName || name || `#${id}`}</ItemInfo>
    </ItemWrapper>
  )
}
