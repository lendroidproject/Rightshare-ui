import styled from 'styled-components'
import { intlForm } from '~utils/translation'

export const Form = styled.form`
  > p {
    margin: 4px 0;
    font-size: 15px;
    font-weight: 600;
  }

  label {
    font-size: 12px;
    margin-bottom: 8px;
    display: block;
  }

  .radio label {
    margin-bottom: 0;

    color: #232160;
    font-size: 14px;
    font-weight: 500;
  }

  .inputs {
    display: flex;
    align-items: center;
    margin: 0 -25px 15px;

    > * {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 0 25px;

      &.radio {
        flex-direction: row;
        align-items: center;

        input {
          width: 20px;
          margin-right: 10px;
        }
      }

      &.separator {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.15px;
        line-height: 16px;
        width: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    input,
    select {
      width: 100%;
      font-size: 14px;
      padding: 5px 10px;
      line-height: 1.5;
      background: white;

      border: 1px solid #cccccc;
      border-radius: 4px;
      color: #232160;

      &[type='radio'] {
        cursor: pointer;

        -webkit-appearance: none;
        border: 5px solid #d8d8d8;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        padding: 0;

        &:checked {
          background: #e2b224;
          border-color: #232160;
        }
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

const Frames = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row !important;

  .frame {
    height: 74px;
    width: 57px;
    border: 1px dashed #cccccc;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border: 1px dashed #000000;
      background-color: #cbe558;
    }

    img {
      height: 60px;
      width: 45px;
    }
  }
`

export default ({ lang, form, setForm, readOnly, children, errors }) => {
  const intl = intlForm(lang)

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div className="inputs">
        <div>
          <label>Purpose of the token</label>
          <input
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            readOnly={readOnly}
          />
        </div>
        <div />
      </div>
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
      <label>Choose Frame Image</label>
      <div className="inputs">
        <Frames>
          {['template01', 'template02', 'template03'].map((name) => (
            <div
              key={name}
              className={`frame ${form.imageUrl.includes(name) ? 'active' : ''}`}
              onClick={() => setForm({ ...form, imageUrl: `/templates/${name}.png` })}
            >
              <img src={`/templates/${name}.png`} />
            </div>
          ))}
        </Frames>
        <div className="separator">Or</div>
        <div>
          <input
            placeholder="Enter image URL here"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            readOnly={readOnly}
          />
        </div>
      </div>
      <label>What kind of metatoken are you in the mood for?</label>
      <div className="inputs">
        <div className="radio">
          <input
            type="radio"
            name="isExclusive"
            value={1}
            checked={form.isExclusive}
            onChange={(e) => setForm({ ...form, isExclusive: Number(e.target.value) === 1 })}
          />
          <label onClick={() => setForm({ ...form, isExclusive: true })}>{intl.exclusive}</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            name="isExclusive"
            value={2}
            checked={!form.isExclusive}
            onChange={(e) => setForm({ ...form, isExclusive: Number(e.target.value) === 1 })}
          />
          <label onClick={() => setForm({ ...form, isExclusive: false })}>{intl.nonExclusive}</label>
        </div>
      </div>
      {/* {!form.isExclusive && (
        <div className="inputs">
          <div>
            <label>{intl.maxISupply}</label>
            <input
              type="number"
              value={form.maxISupply}
              onChange={(e) => setForm({ ...form, maxISupply: Number(e.target.value) })}
              readOnly={readOnly}
              className={errors.maxISupply ? 'error' : ''}
            />
          </div>
        </div>
      )} */}
      {children}
    </Form>
  )
}
