import moment from "moment";
import { holydaysDates } from "./hojidays";

export function padd(num: string, padlen: number, padchar: string) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}



export function timeRange(start: string, end: string) {
    const startTime = moment(start);
    const endTime = moment(end);

    return [`das ${startTime.format('H:mm')} às ${endTime.format('H:mm')}`, `no dia ${startTime.format('D [de] MMMM [de] YYYY')}`];
}


export type calculateBusinessDaysType =
    {
        businessDays: any[],
        nonBusinessDays: any[],
        totalBusinessDays: number,
        totalNonBusinessDays: number,
    };
export function calculateBusinessDays(startDate:string, endDate:string): calculateBusinessDaysType {
    const startMoment = moment(moment(startDate, 'YYYY-MM-DDTHH:mm:ss').add(-1 * new Date().getTimezoneOffset(), 'minutes').format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss');
    const endMoment = moment(endDate, 'YYYY-MM-DD');

    let currentMoment: any = moment(startMoment);
    let businessDays: any[] = [];
    let nonBusinessDays: any[] = [];

    while (currentMoment.isSameOrBefore(endMoment, 'day')) {
        const dayOfWeek = currentMoment.day();

        // 0 sunday, 6 é sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHoliday = holydaysDates?.holydays?.map(({ date }: any) => date).includes(currentMoment.format('YYYY-MM-DD'));

        if (!isWeekend && !isHoliday) {

            businessDays.push(currentMoment.format('YYYY-MM-DD'));
        } else {
            nonBusinessDays.push(currentMoment.format('YYYY-MM-DD'));
        }

        currentMoment.add(1, 'day');
    }

    return {
        businessDays,
        nonBusinessDays,
        totalBusinessDays: businessDays.length,
        totalNonBusinessDays: nonBusinessDays.length,
    };
}

export function dateDifference(start: string, end: string) {
    const startDate = moment(start);
    const endDate = moment(end);

    // Verifica se as datas são iguais
    if (startDate.isSame(endDate, 'day')) {
        return timeRange(start, end);
    }

    // Verifica se as datas estão no mesmo mês e ano
    if (startDate.isSame(endDate, 'month') && startDate.isSame(endDate, 'year')) {
        return [`de ${startDate.format('D')} a ${endDate.format('D [de] MMMM [de] YYYY')}`];
    }

    // Verifica se as datas estão no mesmo ano
    if (startDate.isSame(endDate, 'year')) {
        return [`de ${startDate.format('D [de] MMMM')} a ${endDate.format('D [de] MMMM [de] YYYY')}`];
    }

    // Caso geral, incluindo diferenças em anos diferentes
    return [`de ${startDate.format('D [de] MMMM [de] YYYY')} a ${endDate.format('D [de] MMMM [de] YYYY')}`];
}


export function timeConverter(startDate: string, endDate: string, durations?: number) {

    let duration: any;
    if (durations) {
        duration = moment.duration(durations, 'seconds');
    } else {

        const startMoment = moment(startDate, 'YYYY-MM-DDTHH:mm:ss');
        const endMoment = moment(endDate, 'YYYY-MM-DDTHH:mm:ss');

        duration = moment.duration(endMoment.diff(startMoment));

    }

    const { totalBusinessDays: days, } = calculateBusinessDays(startDate, endDate);

    const daysy = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let result = '';
    if (days > 0 && daysy > 0) {
        return result += `${days} ${days === 1 ? 'dia útil' : 'dias úteis'}  `;
    }

    if (hours > 0) {
        result += `${hours} ${hours === 1 ? 'hora' : 'horas'} `;
    }

    if (minutes > 0) {
        return result += `${minutes} ${minutes === 1 ? 'minutos' : 'minutos'}`;
    }
    return result.trim();
}


