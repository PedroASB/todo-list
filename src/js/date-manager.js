import { format as formatDateFns } from "date-fns";

export function getDateFromString(dateString) {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
}

export function getCurrentDate() {
    return new Date();
}

export function formatDate(date, format) {
    return formatDateFns(date, format);
}