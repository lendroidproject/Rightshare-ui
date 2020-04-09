import { Form } from './AssetForm'

export default ({ form, setForm, data }) => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <div className="inputs">
      <div>
        <label>
          <b>I</b> Version
        </label>
        <select
          type="number"
          value={form.iVersion}
          onChange={(e) => setForm({ ...form, iVersion: Number(e.target.value) })}
        >
          {new Array(data.iVersion || 1).fill(null).map((_, idx) => (
            <option key={idx + 1}>{idx + 1}</option>
          ))}
        </select>
      </div>
    </div>
  </Form>
)
