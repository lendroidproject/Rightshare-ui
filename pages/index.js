import { useState } from 'react'
import styled from 'styled-components'

import Button from '~components/common/Button'
import Parcels from '~components/Parcels'
import ENSs from '~components/ENSs'
import NFTs from '~components/NFTs'
import Intro from '~components/Intro'

const Accordion = styled.div`
  display: flex;
  height: 100%;

  > div {
    border-radius: 10px;
  }

  .panel {
    flex: 1;
    height: 100%;
    overflow: auto;
    background: black;
  }
`

const Tabs = styled.div`
  background: #4000b4;
  background: linear-gradient(180deg, #4000b4 0%, #7e0783 100%);

  display: flex;
  flex-direction: column;
  min-width: 250px;
  margin-right: 20px;

  .tab {
    padding: 20px 30px;
    font-weight: bold;

    &:not(:last-child) {
      border-bottom: 1px solid #9700ff;
    }
  }
`

const Tab = ({ label, active, onSelect }) => (
  <div key={label} className={`tab ${active ? 'active' : ''}`} onClick={onSelect}>
    {label}
  </div>
)

const tabs = [
  {
    label: 'CryptoVoxels Parcels',
    Component: Parcels,
  },
  // {
  //   label: 'Ethereum Name Service',
  //   Component: ENSs,
  // },
  {
    label: 'Other NFTs',
    Component: NFTs,
  },
  {
    label: 'How it works',
    Component: Intro,
  },
]

export default function () {
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(1)
  const { Component } = tabs[active]
  const tabLabels = tabs.map(({ label }) => label)

  const handleActive = (active) => {
    setActive(active)
    setShow(false)
  }

  return (
    <Accordion>
      <Tabs>
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            active={active === index}
            onSelect={() => (active === index ? setShow(!show) : handleActive(index))}
          />
        ))}
      </Tabs>
      <div className="panel">
        <Button className="primary">Text</Button>
        <Button className="secondary">Text</Button>
        <Button className="black">Text</Button>
        <Component onTab={() => setActive(tabs.length - 1)} />
      </div>
    </Accordion>
  )
}
