import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  border-radius: 7px;
  background-color: var(--color-bg);
  box-shadow: var(--box-shadow2);
  display: flex;

  input {
    font-size: 16px;
    color: var(--color-text);
    border: 0;
    background: var(--color-bg-input);
    padding: 11px 13px;

    &.small {
      font-size: 12px;
      padding: 13px 13px;
    }
  }

  .icon {
    display: flex;
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 27px;

    img {
      height: 100%;
      margin: auto;

      filter: var(--filter-invert);
    }
  }

  &.icon input {
    padding-left: 40px;
  }

  &.suffix input {
    padding-right: 40px;
  }
`

export default ({ icon, suffix, ...props }) => (
  <Wrapper className={`input ${icon ? 'icon' : ''} ${suffix ? 'suffix' : ''}`}>
    {icon && <div className="icon">{icon}</div>}
    <input {...props} />
  </Wrapper>
)
