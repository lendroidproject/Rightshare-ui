import styled from 'styled-components'

const Wrapper = styled.button`
  font-size: 16px;
  color: var(--color-text);
  border: 0;
  border-radius: 10px;
  background: var(--color-bg6);
  background: var(--color-grad6);
  box-shadow: var(--box-shadow1);
  cursor: pointer;

  &.primary {
    font-weight: bold;
    color: var(--color-bg);
    border: 1px solid var(--color-highlight);
    border-radius: 4px;
    padding: 10px 20px;
  }

  &.secondary {
    font-size: 13px;
    background: var(--color-bg7);
    background: var(--color-grad7);
    box-shadow: var(--box-shadow2);
    padding: 11px 16px;
  }

  &.black {
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    box-shadow: var(--box-shadow2);
    padding: 10px 20px;
  }

  &.icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;

    img {
      height: 24px;
      filter: grayscale(1);
    }

    &.active img {
      filter: grayscale(0);
    }
  }
`

export default ({ className, ...props }) => <Wrapper className={`button ${className}`} {...props} />
