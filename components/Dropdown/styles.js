import styled from 'styled-components'

export default styled.div`
  position: ${(props) => (props.positionRelative ? 'relative' : 'unset')};

  .button {
    color: var(--color-lighter);

    &:hover,
    &.active {
      color: var(--color-orange);
    }
  }
`

export const Content = styled.div`
  display: none;
  position: absolute;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.209927);
  z-index: 2;
  padding: 10px 0;

  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;

  top: ${(props) => (props.position.top !== undefined ? props.position.top : 'unset')};
  left: ${(props) => (props.position.left !== undefined ? props.position.left : 'unset')};
  right: ${(props) => (props.position.right !== undefined ? props.position.right : 'unset')};
  bottom: ${(props) => (props.position.bottom !== undefined ? props.position.bottom : 'unset')};

  overflow: auto;

  label {
    color: var(--color-bright);
    white-space: nowrap;
    font-size: 14px;
  }

  &.show {
    display: block;
  }
`

export const Option = styled.div`
  color: var(--color-black);
  padding: 7px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;

  svg {
    margin-right: 11px;
  }

  &:hover {
    background: var(--color-border);
    opacity: 0.9;
  }

  &.active {
    background: var(--color-border);
  }
`
