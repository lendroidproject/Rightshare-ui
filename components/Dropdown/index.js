import React, { useState, useEffect } from 'react'

import Wrapper, { Content, Option } from './styles'

export default function Dropdown({
  children,
  label,
  options,
  render,
  selection,
  onSelect,
  position = {},
  closeOnSelect = true,
  positionRelative = true,
  ...props
}) {
  const [show, setShow] = useState(false)
  const handleShow = (e) => {
    e.preventDefault()
    setShow(!show)
  }
  const classNames = ['form-field']

  useEffect(() => {
    const handleClose = (e) => {
      if (e.target && typeof e.target.className === 'string' && e.target.className.includes('trigger')) return
      setShow(false)
    }
    document.body.addEventListener('click', handleClose)
    return () => document.body.removeEventListener('click', handleClose)
  }, [])

  return (
    <Wrapper className={classNames.join(' ')} positionRelative={positionRelative} {...props}>
      {React.cloneElement(children, {
        ...props,
        onClick: (e) => {
          handleShow(e)
          props.onClick && props.onClick(e)
        },
        // className: `button ${show ? 'active' : ''}`,
      })}
      <Content className={`animated fadeIn ${show ? 'show' : ''}`} position={position}>
        <label>{label}</label>
        {options.map(({ id, label, icon }) => (
          <Option
            key={id}
            onClick={() => onSelect(id)}
            className={`pointer ${selection.includes(id) ? 'active' : ''} ${closeOnSelect ? '' : 'trigger'}`}
          >
            {render ? (
              render({ id, label, icon })
            ) : (
              <>
                {icon && icon} {selection.includes(id) ? '+' : '-'} {label}
              </>
            )}
          </Option>
        ))}
      </Content>
    </Wrapper>
  )
}
