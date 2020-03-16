import styled from 'styled-components'

const Wrapper = styled.div`
  text-align: center;

  h3 {
    margin: 15px 0 8px;
    text-align: left;
  }

  p {
    margin: 0 0 8px;
    text-align: left;
  }

  img {
    max-width: 100%;
    margin: 10px auto;
  }
`

export default function() {
  return (
    <Wrapper>
      <p>
        Say you have a parcel on CryptoVoxels. Today, allowing someone to access your parcel is done off-chain. NFT
        Rightsharing is an attempt to bring collaboration on-chain. To lease or share access rights to your parcel, even
        to people you don't know, without losing ownership of your parcel.
      </p>
      <p>
        As a first step, you deposit your parcel in a smart contract. When you do, you freeze your access rights to the
        parcel and create two new 'Rights Tokens' - Frozen Rights or fRights - You set an expiry period and 'freeze'
        your access to the land parcel until then. On expiry, the holder of fRights can unfreeze access to the land
        parcel.
      </p>
      <p>
        Interim Rights or iRights - Until the expiry, anyone who holds iRights can be given access to the land parcel.
      </p>
      <br />
      <p>
        The fRights and iRights are NFTs themselves, which means they are transferable - sent and received, bought and
        sold.
      </p>
      <img src="/exclusive-flow.jpg" />
      <p>
        As the holder of the land parcel, you keep fRights with you. You can transfer or sell the iRights to anyone.
        They will now use it to access the parcel. At expiry, the holders of iRights will no longer have access to the
        parcel. As the fRights holder, you can then unfreeze your access to the parcel.
      </p>
      <p>
        Now this is exclusive rights sharing. This way, only one person gets to access the parcel at any given time. You
        can go ahead and transfer it to someone or sell it on OpenSea, effectively selling your access rights as an
        exclusive lease.
      </p>
      <p>But access can be non-exclusive too. You can create more iRights.</p>
      <img src="/non-exclusive-flow.jpg" />
      <p>
        his way, we have enabled collaboration. At the end of the lease, the iRights expire and the person holding the
        token can no longer access the parcel. It now becomes 'just a collectible'. The fRights, as we saw earlier, can
        be 'thawed' or unfrozen to redeem your parcel NFT.
      </p>
      <h3>So what's the catch</h3>
      <p>
        For this to work, the underlying dApp should extend platform support to iRights as they would to the original
        parcel NFT. We are going to work on it, but if you are building a dApp, or you want this in a dApp you hang out
        at, join our Discord and let's brainstorm.
      </p>
      <h3>Not for all NFTs</h3>
      <p>
        When you lease or share access to your parcel, you want it back in the same condition. This means you don't want
        to do this with an NFT that might change when on-chain. For instance, if you've got a sword that can deteriorate
        or be destroyed during play, the rights share idea does not fit that use case well.
      </p>
      <h3>Some Use Cases</h3>
      <p>
        Leasing Parcels - This is what we have described above. It could happen in other Metaverse worlds, as long as
        the dApp is willing to support iRights. There could also be a market where you could sell access to your
        parcels. Why would you do that? Well, we're quite not sure yet. You tell us!
      </p>
      <p>
        Collaboration - Let's create a graffiti wall on Cryptovoxels where a number of artists collaborate together, and
        auction off the parcel.
      </p>
      <p>
        Digital Rights Sharing - As an artist, or even as the owner of a work or art, you have very little right over
        the art itself. Say you own Banksta(
        <a href="https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-28" target="_blank">
          https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-28
        </a>
        ), you own the token to have and hold, for some future value. Instead, why can't artists and owners monetize
        this ownership? You could sell the display rights token to 50 people for say six months. And the Metaverse could
        allow an image to be displayed only if you have the actual NFT or the corresponding valid iRights.
      </p>
      <p>
        Metaverse Advertising - This is a take-off from Andrew Steinwold's blog about an advertising marketplace. Why
        not lease out your parcels and let people run an advertising network?
      </p>
      <h3>Tell us what you think</h3>
      <p>
        If you're feeling creative, come talk to us. We'd love to know what you think and spitball some ideas, on
        Discord - <a href="https://discord.gg/SyHdEbD">https://discord.gg/SyHdEbD</a>
      </p>
    </Wrapper>
  )
}
