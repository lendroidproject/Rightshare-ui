import { Form } from './AssetForm'

export default ({ owner, form, setForm, errors }) => (
  <Form onSubmit={e => e.preventDefault()}>
    <p>Transfer</p>
    <div className="inputs">
      <div>
        <label>From</label>
        <input defaultValue={owner} readOnly />
      </div>
    </div>
    <div className="inputs">
      <div>
        <label>To</label>
        <input className={errors.to ? 'error' : ''} value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
      </div>
    </div>
  </Form>
)
