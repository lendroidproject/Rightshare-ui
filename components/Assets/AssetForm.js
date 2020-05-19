import styled from 'styled-components'

export const Form = styled.form`
  > p {
    margin: 4px 0;
    font-size: 16px;
    font-weight: 600;
  }

  label {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .inputs {
    display: flex;
    margin: 0 -8px 8px;

    > * {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 0 8px;

      &.radio {
        flex-direction: row;
        align-items: center;

        input {
          width: 20px;
          margin-right: 10px;
        }
      }
    }

    input, select {
      width: 100%;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid;
      padding: 5px 10px;
      line-height: 1.5;
      background: white;

      &[type='radio'] {
        cursor: pointer;
      }

      &[readonly] {
        background: #eee;
      }

      &.error {
        border-color: red;
      }
    }
  }
`

export default ({ form, setForm, readOnly, children, errors }) => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <p>Set Expiry (UTC)</p>
    <div className="inputs">
      <div>
        <label>Date</label>
        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          readOnly={readOnly}
        />
      </div>
      <div>
        <label>Time</label>
        <input
          type="time"
          value={form.expiryTime}
          onChange={(e) => setForm({ ...form, expiryTime: e.target.value })}
          readOnly={readOnly}
        />
      </div>
    </div>
    <p>Set Access</p>
    <div className="inputs">
      <div className="radio">
        <input
          type="radio"
          name="isExclusive"
          value={1}
          checked={form.isExclusive}
          onChange={(e) => setForm({ ...form, isExclusive: Number(e.target.value) === 1 })}
        />
        <label onClick={() => setForm({ ...form, isExclusive: true })}>Exclusive</label>
      </div>
      <div className="radio">
        <input
          type="radio"
          name="isExclusive"
          value={2}
          checked={!form.isExclusive}
          onChange={(e) => setForm({ ...form, isExclusive: Number(e.target.value) === 1 })}
        />
        <label onClick={() => setForm({ ...form, isExclusive: false })}>Non-Exclusive</label>
      </div>
    </div>
    {!form.isExclusive && (
      <div className="inputs">
        <div>
          <label>Max Supply - iRights?</label>
          <input
            type="number"
            value={form.maxISupply}
            onChange={(e) => setForm({ ...form, maxISupply: Number(e.target.value) })}
            readOnly={readOnly}
            className={errors.maxISupply ? 'error' : ''}
          />
        </div>
      </div>
    )}
    {children}
  </Form>
)
