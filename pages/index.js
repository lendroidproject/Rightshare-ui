import { useState } from 'react'
import styled from 'styled-components'

import { FlexCenter } from '~/components/common/Wrapper'
import Assets from '~components/Assets'

const Accordion = styled.div`
  background: white;
  min-height: calc(100vh - 164px);
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 25px;
  border-radius: 5px;
  overflow: hidden;

  * {
    color: black;
  }

  .accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 20px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
  }

  .panel {
    padding: 20px;
    background-color: white;
    overflow: hidden;
  }
`

const Tabs = styled(FlexCenter)`
  border-bottom: 1px solid #eee;

  > div {
    padding: 10px;
    cursor: pointer;
    margin: 0 1px;

    &:hover, &.active {
      background-color: #27A0F7;
      color: white;
    }
  }
`

const Tab = ({ label, active, onSelect }) => (
  <div key={label} className={active ? 'active' : ''} onClick={onSelect}>
    {label}
  </div>
)

const tabs = [
  {
    label: 'How it works',
    Component: () => <div>

    Say you have a parcel on CryptoVoxels. Today, allowing someone to access your parcel is done off-chain. NFT Rightsharing is an attempt to bring collaboration on-chain. To lease or share access rights to your parcel, even to people you don’t know, without losing ownership of your parcel.

As a first step, you deposit your parcel in a smart contract. When you do, you freeze your access rights to the parcel and create two new ‘Rights Tokens’ -
Frozen Rights or fRights -  You set an expiry period and ‘freeze’ your access to the land parcel until then. On expiry, the holder of fRights can unfreeze access to the land parcel.
Interim Rights or iRights - Until the expiry, anyone who holds iRights can be given access to the land parcel.

The fRights and iRights are NFTs themselves, which means they are transferable - sent and received, bought and sold.

<img src="/exclusive-flow.jpg"  />
As the holder of the land parcel, you keep fRights with you. You can transfer or sell the iRights to anyone. They will now use it to access the parcel. At expiry, the holders of iRights will no longer have access to the parcel. As the fRights holder, you can then unfreeze your access to the parcel.

Now this is exclusive rights sharing. This way, only one person gets to access the parcel at any given time. You can go ahead and transfer it to someone or sell it on OpenSea, effectively selling your access rights as an exclusive lease.

But access can be non-exclusive too. You can create more iRights.

<img src="/non-exclusive-flow.jpg"  />
his way, we have enabled collaboration. At the end of the lease, the iRights expire and the person holding the token can no longer access the parcel. It now becomes ‘just a collectible’. The fRights, as we saw earlier, can be ‘thawed’ or unfrozen to redeem your parcel NFT.

So what’s the catch
For this to work, the underlying dApp should extend platform support to iRights as they would to the original parcel NFT. We are going to work on it, but if you are building a dApp, or you want this in a dApp you hang out at, join our Discord and let’s brainstorm.

Not for all NFTs
When you lease or share access to your parcel, you want it back in the same condition. This means you don’t want to do this with an NFT that might change when on-chain. For instance, if you’ve got a sword that can deteriorate or be destroyed during play, the rights share idea does not fit that use case well.

Some Use Cases
Leasing Parcels - This is what we have described above. It could happen in other Metaverse worlds, as long as the dApp is willing to support iRights. There could also be a market where you could sell access to your parcels. Why would you do that? Well, we’re quite not sure yet. You tell us!
Collaboration - Let’s create a graffiti wall on Cryptovoxels where a number of artists collaborate together, and auction off the parcel.
Digital Rights Sharing - As an artist, or even as the owner of a work or art, you have very little right over the art itself. Say you own Banksta(https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-28), you own the token to have and hold, for some future value. Instead, why can’t artists and owners monetize this ownership? You could sell the display rights token to 50 people for say six months. And the Metaverse could allow an image to be displayed only if you have the actual NFT or the corresponding valid iRights.
Metaverse Advertising - This is a take-off from Andrew Steinwold’s blog about an advertising marketplace. Why not lease out your parcels and let people run an advertising network?

Tell us what you think
If you’re feeling creative, come talk to us. We’d love to know what you think and spitball some ideas, on Discord - https://discord.gg/SyHdEbD


</div>,
  },
  {
    label: 'My Assets',
    Component: Assets,
  },
  {
    label: 'My FTokens',
    Component: () => <div>Coming soon...</div>,
  },
  {
    label: 'My ITokens',
    Component: () => <div>Coming soon...</div>,
  },
]

export default function() {
  const [active, setActive] = useState(1)
  const { Component } = tabs[active]
  const tabLabels = tabs.map(({ label }) => label)

  return (
    <Accordion>
      <Tabs>
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} active={active === index} onSelect={() => setActive(index)} />
        ))}
      </Tabs>
      <div className="panel">
        <Component />
      </div>
    </Accordion>
  )
}
