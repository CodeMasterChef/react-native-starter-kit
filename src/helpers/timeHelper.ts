import moment from 'moment';

class TimeHelper {

    constructor() { }

    convertTimestampToDayMonthYearHourMinute(milliseconds: number) {
        const date = moment.unix(milliseconds / 1000).format('DD/MM/YYYY');
        const time = moment.unix(milliseconds / 1000).format('HH:mm:ss');
        return date + ' - ' + time;
    }

    convertTimestampToDayMonthYear(milliseconds: number) {
        const date = moment.unix(milliseconds / 1000).format('DD/MM/YYYY');
        return date;
    }

    convertDateToDayMonthYear(d: Date) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${day}/${month}/${year}`;
    }

    convertTimestampToMinute(milliseconds: number) {
        return Math.round(milliseconds / 1000 / 60);
    }

    differentMillisecondToHourMinute(milliseconds: number) {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const h = Math.floor(minutes / 60);
        const m = minutes - h * 60;
        if (h < 0) {
            return '0:00';
        } else {
            return m < 10 ? `${h}:0${m}` : `${h}:${m}`;
        }

    }

}

export const timeHelper = new TimeHelper();