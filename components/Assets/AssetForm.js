import { useState } from 'react'
import styled from 'styled-components'
// import { intlForm } from '~utils/translation'
import LimitedText from '~/components/common/LimitedText'

export const Form = styled.form`
  > p {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-blue);
  }

  label {
    font-size: 13px;
    margin-bottom: 8px;
    display: block;

    span {
      font-size: 90%;
    }

    &.gap {
      margin-bottom: 17px;
    }
  }

  a {
    color: var(--color-link);
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
    margin: 0 -25px 25px;
    @media all and (max-width: 767px) {
      flex-direction: column;
      margin: 0 0 15px;
    }

    > * {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 0 25px;
      position: relative;
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

    img.suffix {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 20px;
      pointer-events: none;
    }

    select {
      appearance: none;
    }

    input,
    textarea,
    select,
    .input {
      width: 100%;
      font-size: 16px;
      padding: 5px 10px;
      line-height: 1.5;
      background: transparent;

      border: 1px solid var(--color-input);
      border-radius: 4px;
      color: var(--color-text);

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
    height: 86px;
    width: 67px;
    border-radius: 4px;
    cursor: pointer;

    border: 1px dashed var(--color-disable);
    background-color: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border-color: var(--color-purple);
      background-color: var(--color-text);
    }

    img {
      height: 74px;
      width: 57px;
    }

    &:not(:last-child) {
      margin-right: 6px;
    }
  }
`

export const Templates = [
  'https://tinyurl.com/rs-template-01',
  'https://tinyurl.com/rs-template-02',
  'https://tinyurl.com/rs-template-03',
  // 'https://tinyurl.com/rs-template-04',
]

export default ({ lang, form, setForm, active, metaTokens, setMetaTokens, onNewMeta, readOnly, children, errors }) => {
  // const intl = intlForm(lang)

  const { purpose = 'Rental', description = '', imageUrl = '', termsUrl = '' } = metaTokens[active] || {}
  const handleMeta = (updates) => {
    if (metaTokens[active])
      setMetaTokens(metaTokens.map((meta, idx) => (active === idx ? { ...meta, ...updates } : meta)))
    else onNewMeta(updates)
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div className="inputs">
        <div>
          <label>Purpose of the token</label>
          <select value={purpose} onChange={(e) => handleMeta({ purpose: e.target.value })} readOnly={readOnly}>
            <option value="Rental">Rental</option>
          </select>
          <img src="/meta/arrow.svg" className="suffix" />
        </div>
        <div>
          <label>
            Token Description <span>(Max 32 characters)</span>
          </label>
          <LimitedText
            value={description}
            onChange={(e) => handleMeta({ description: e.target.value })}
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
          <img src="/meta/calendar.svg" className="suffix" />
        </div>
        <div>
          <label>Time</label>
          <input
            type="time"
            value={form.expiryTime}
            onChange={(e) => setForm({ ...form, expiryTime: e.target.value })}
            readOnly={readOnly}
          />
          <img src="/meta/clock.svg" className="suffix" />
        </div>
      </div>
      <label className="gap">Choose Frame Image</label>
      <div className="inputs">
        <Frames>
          {Templates.map((url) => (
            <div
              key={url}
              className={`frame ${imageUrl === url ? 'active' : ''}`}
              onClick={() => handleMeta({ imageUrl: url })}
            >
              <img src={url} />
            </div>
          ))}
        </Frames>
      </div>
      <label>
        Or use this{' '}
        <a href="/template.zip" download>
          template
        </a>{' '}
        and upload your own image
      </label>
      <div className="inputs">
        <div>
          <input
            placeholder="Paste the URL of your image here"
            value={imageUrl}
            onChange={(e) => handleMeta({ imageUrl: e.target.value })}
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
          <label>
            Terms URL <span>(Optional)</span>
          </label>
          <input
            value={termsUrl}
            onChange={(e) => handleMeta({ termsUrl: e.target.value })}
            readOnly={readOnly}
            className={errors.termsUrl ? 'error' : ''}
          />
        </div>
      </div>
      {children}
    </Form>
  )
}
