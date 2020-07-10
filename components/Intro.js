import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 1024px;
  margin: auto;
  width: 90%;
  padding: 20px 0;

  h3,
  ul,
  p {
    text-align: left;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 900;
    line-height: 27px;
  }

  p {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 300;
    line-height: 18px;
  }

  img {
    max-width: 100%;
    margin: auto;
  }
  a {
    color: #0651fa;
  }

  .with-image {
    display: flex;
    align-items: center;
    margin: 20px 0;

    img {
      margin-right: 28px;
    }

    @media all and (max-width: 767px) {
      flex-direction: column;

      img {
        margin-right: auto;
        margin-bottom: 20px;
      }
    }
  }
`

export default function () {
  return (
    <Wrapper>
      <h3>How it works</h3>
      <p>
        You are sharing access to your property via an NFT you create for it. It’s that simple.
        <br />
        <br />
        Imagine you have a Cryptovoxels parcels. You sign in with your metamask on Rightshare and you are able to see
        all your parcels in one view. You then choose any parcel that you want to rent out or share access to.
      </p>
      <div className="with-image">
        <img src="/assets/intro/1_asset.png" />
        <p>
          You can now create ‘customer’ tokens for any of your properties. We could call them rental tokens or tenant
          tokens, but that’s only one use case. There is so much else you can do with this kind of access token. More on
          that later.
          <br />
          <br />
          It’s easy to create customer tokens for your property. We provide a choice of three templates, which you can
          customize. You must set an expiry date for the token, and any other details you feel are relevant. Here’s a
          point of view -
        </p>
      </div>
      <div className="with-image">
        <img src="/assets/intro/2_token.png" />
        <p>
          Once you’ve crafted your property token, mint it in a couple of clicks. You can then either transfer the token
          to someone, or list it for sale via OpenSea.
        </p>
      </div>
      <div className="with-image">
        <img src="/assets/intro/3_success.png" />
        <p>
          Whosoever holds the customer token has access rights to your property until expiry. So it is written. So shall
          it be done.
        </p>
      </div>
    </Wrapper>
  )
}
