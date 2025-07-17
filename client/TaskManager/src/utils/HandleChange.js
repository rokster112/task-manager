export function HandleChange(e, setErr, setFormData) {
  setErr(false);
  const { name, value } = e.target;
  const val = e.target.getAttribute("data-value")
    ? e.target.getAttribute("data-value")
    : value;
  const newName = e.target.getAttribute("data-name")
    ? e.target.getAttribute("data-name")
    : name;
  console.log(newName);
  setFormData((prev) => {
    const newVal =
      newName === "Priority" || newName === "Status" ? Number(val) : val;
    return {
      ...prev,
      [newName]:
        newName === "AssignedForIds"
          ? [...prev.AssignedForIds, newVal]
          : newVal,
    };
  });
}
