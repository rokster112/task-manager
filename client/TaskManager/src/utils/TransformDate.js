import dayjs from "dayjs";

export function TransformDate(
  date,
  forProjectForm = false,
  forTaskForm = false
) {
  if (forProjectForm) {
    return dayjs(date).format("YYYY-MM-DDTHH:mm");
  }
  if (forTaskForm) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return dayjs(date).format("DD-MM-YYYY, HH:mm");
}
