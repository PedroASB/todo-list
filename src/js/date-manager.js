import { format as formatDateFns } from "date-fns";

export class DateManager {
    /* Applying dependency inversion principle to manage all 
    date-related stuff through a single Class */

    static getDateFromString(dateString) {
        const [year, month, day] = dateString.split("-");
        return new Date(year, month - 1, day);
    }

    static getCurrentDate() {
        return new Date();
    }

    static formatDate(date, format) {
        return formatDateFns(date, format);
    }
}