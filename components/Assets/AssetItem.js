import styled from 'styled-components'
import Spinner from '~components/common/Spinner'

const ItemWrapper = styled.div`
  min-height: 270px;
  width: 227px;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  background-color: var(--color-bg4);
  background: var(--color-grad4);
  box-shadow: var(--box-shadow3);

  margin: 20px;
  overflow: hidden;
  cursor: pointer;
  padding: 20px 20px 0;
  position: relative;
  @media all and (max-width: 767px) {
    min-height: 191px;
    width: 160px;
    padding: 13px 16px 0;
    margin: 7.5px 3px;
  }
`
const Thumbnail = styled.div`
  height: 182px;
  width: 187px;
  overflow: hidden;
  @media all and (max-width: 767px) {
    height: 127px;
    width: 124px;
  }

  border-radius: 8px;
  background-color: var(--color-text);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;

  img {
    height: 100%;
    max-width: 100%;
  }
`
const ItemInfo = styled.div`
  margin: 10px 0 12px;
  font-size: 16px;
  text-align: center;

  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  @media all and (max-width: 767px) {
    font-size: 12px;
    margin: 6px 0 12px;
  }

  span {
    font-size: 12px;
    position: relative;
    top: -8px;
    @media all and (max-width: 767px) {
      font-size: 10px;
    }
  }

  .description {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;

    font-size: 12px;
    padding: 2px 10px;
    border-radius: 8px 8px 0 0;
    background-color: var(--color-bg3);
    background: var(--color-grad3);
    color: white;

    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    @media all and (max-width: 767px) {
      font-size: 10px;
    }
  }
`

export default ({ onSelect, ...data }) => {
  const {
    token_id: id,
    // image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    image_url: image,
    name,
    description,
    background_color: background,
    current_price: price,
    decimals,
    tokenInfo: { name: infoName, background_color: infoBack, image: infoImage } = {},
    loaded,
    totalNFTRights,
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
      <ItemInfo>
        {infoName || name || `#${id}`}
        <br />
        <span>({totalNFTRights || 0} metatokens)</span>
        {/* {totalNFTRights > 0 && <span>({totalNFTRights} metatokens)</span>} */}
        <div className="description">{description || '---'}</div>
      </ItemInfo>
    </ItemWrapper>
  )
}
