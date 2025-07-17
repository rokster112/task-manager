export function UserFormHandleChange(e, setFormData, setErr) {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setErr(false);
}
