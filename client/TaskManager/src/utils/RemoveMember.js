export function RemoveMember(e, formData, setFormData) {
  const id = e.target.getAttribute("data-id");
  const filteredMembers = formData.AssignedForIds.filter((m) => m !== id);
  setFormData((prev) => ({ ...prev, AssignedForIds: filteredMembers }));
}
