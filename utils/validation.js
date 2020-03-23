export const validate = (form, keys) => {
  const errors = {}
  keys.forEach(k => {
    const val = form[k]
    if (!val) errors[k] = true
    if (Number(val) && Number(val) === 0) errors[k] = true
  })
  return [Object.keys(errors).length === 0, errors]
}
