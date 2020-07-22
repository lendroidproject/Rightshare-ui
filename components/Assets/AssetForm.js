import styled from 'styled-components'
// import { intlForm } from '~utils/translation'
import LimitedText from '~/components/common/LimitedText'

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

    span {
      font-size: 90%;
    }
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
    @media all and (max-width: 767px) {
      flex-direction: column;
      margin: 0 0 15px;
    }

    > * {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 0 25px;
      @media all and (max-width: 767px) {
        margin: 0 0 10px 0;

        &.empty {
          display: none;
        }
      }

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
        @media all and (max-width: 767px) {
          margin-bottom: 10px;
        }
      }
    }

    input,
    textarea,
    select,
    .input {
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

    &:not(:last-child) {
      margin-right: 15px;
    }
  }
`

export const Templates = [
  'https://tinyurl.com/rs-template-01',
  'https://tinyurl.com/rs-template-02',
  'https://tinyurl.com/rs-template-03',
  // 'https://tinyurl.com/rs-template-04',
]

export default ({ lang, form, setForm, readOnly, children, errors }) => {
  // const intl = intlForm(lang)

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div className="inputs">
        <div>
          <label>Purpose of the token</label>
          <select
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            readOnly={readOnly}
          >
            <option value="Rental">Rental</option>
          </select>
        </div>
        <div className="empty" />
      </div>
      <div className="inputs">
        <div>
          <label>
            Purpose of the token <span>(Max 32 characters)</span>
          </label>
          <LimitedText
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            max={32}
            warn={8}
            exceed={10}
          />
        </div>
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
          {Templates.map((url) => (
            <div
              key={url}
              className={`frame ${form.imageUrl === url ? 'active' : ''}`}
              onClick={() => setForm({ ...form, imageUrl: url })}
            >
              <img src={url} />
            </div>
          ))}
        </Frames>
      </div>
      <label>
        Or use{' '}
        <a href="/template.zip" download>
          this template
        </a>{' '}
        and upload your own image
      </label>
      <div className="inputs">
        <div>
          <input
            placeholder="Paste the URL of your image here"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            readOnly={readOnly}
          />
        </div>
      </div>
      {/* <label>What kind of metatoken are you in the mood for?</label>
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
      </div> */}
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
      <div className="inputs">
        <div>
          <label>Terms URL (Optional)</label>
          <input
            value={form.termsUrl}
            onChange={(e) => setForm({ ...form, termsUrl: e.target.value })}
            readOnly={readOnly}
            className={errors.termsUrl ? 'error' : ''}
          />
        </div>
      </div>
      {children}
    </Form>
  )
}
