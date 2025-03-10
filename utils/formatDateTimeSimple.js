import moment from "moment";

export default function formatDateTimeSimple(isoString) {
  return moment(isoString).format("DD MMM YYYY, hh:mm A");
}
