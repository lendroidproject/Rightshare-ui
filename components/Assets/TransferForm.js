import { Form } from './AssetForm'

export default ({ owner, form, setForm }) => (
  <Form onSubmit={e => e.preventDefault()}>
    <div className="inputs">
      <div>
        <label>From</label>
        <input defaultValue={owner} readOnly />
      </div>
    </div>
    <div className="inputs">
      <div>
        <label>To</label>
        <input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
      </div>
    </div>
  </Form>
)
