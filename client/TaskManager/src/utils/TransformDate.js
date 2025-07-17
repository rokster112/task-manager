import dayjs from "dayjs";

export function TransformDate(date) {
  return dayjs(date).format("DD-MM-YYYY, HH:mm");
}
