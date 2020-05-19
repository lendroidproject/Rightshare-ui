import { useState } from 'react'
import styled from 'styled-components'

import { FlexCenter } from '~components/common/Wrapper'
import Parcels from '~components/Parcels'
import NFTs from '~components/NFTs'
import Intro from '~components/Intro'

const Accordion = styled.div`
  background: white;
  min-height: calc(100vh - 190px);
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 25px;
  border-radius: 5px;
  overflow: hidden;
  @media all and (max-width: 767px) {
    min-height: calc(100vh - 208px);
  }

  * {
    color: black;

    button {
      color: white;
      position: relative;

      &:disabled img {
        display: block;
      }

      img {
        display: none;
        position: absolute;
        height: 100%;
        top: 0;
        left: calc(50% - 19px);
      }
    }
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
    position: relative;
  }
`

const Tabs = styled(FlexCenter)`
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;

  @media all and (max-width: 767px) {
    flex-wrap: wrap;

    > div {
      width: 50%;
      text-align: center;
    }
  }

  > div {
    padding: 10px;
    cursor: pointer;

    &:hover,
    &.active {
      background-color: #27a0f7;
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
    label: 'CryptoVoxels Parcels',
    Component: Parcels,
  },
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
  const [active, setActive] = useState(0)
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
        <Component onTab={setActive} />
      </div>
    </Accordion>
  )
}
