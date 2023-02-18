import {
  ACTION_STATUS_DATES_FOR_HOLIDAYS,
  ACTION_STATUS_DATES_FOR_NOT_WORK,
  ACTION_STATUS_DATES_FOR_WORK,
} from './constants';
import { ДЕНЬНЕД, КОНМЕСЯЦА } from './tools-excel';

export const getDaysInMonth = (date): number =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const addDay = (
  date: Date,
  days_to_add: number // Добавить кол.дней
): Date => new Date(date.getTime() + days_to_add * 86400000);

export const diffDays = (date1: Date, date2: Date): number => {
  // Разница дней
  if (typeof date1 !== 'object') {
    console.error('Ошибочная сравнения дат:', date1, date2);
    return 0;
  }
  if (date2 > date1) {
    const difference = date2.getTime() - date1.getTime();
    return -Math.floor((difference + 1) / (1000 * 3600 * 24));
  } else {
    const difference = date1.getTime() - date2.getTime();
    return Math.floor((difference + 1) / (1000 * 3600 * 24));
  }
};

export const dateToStringFormat = (d: Date): string => {
  if (typeof d === 'string') {
    d = new Date(d);
  }
  if (!d || typeof d !== 'object') {
    // console.error('Wrong Date to dateToStringFormat:', d);
    return '';
  }
  const r = [];
  r.push(
    [
      ('0' + d.getDate()).slice(-2),
      ('0' + (d.getMonth() + 1)).slice(-2),
      d.getFullYear(),
    ].join('.')
  );
  return r.join(' ');
};

export const thousandsSeparators = (
  num: number,
  return_if_zero: string = '',
  dec: number = 2
): string => {
  if (!num) {
    return return_if_zero;
  }
  num =
    Math.round((num + Number.EPSILON) * Math.pow(10, dec)) / Math.pow(10, dec);
  const numParts: string[] = num.toString().split('.');
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  numParts[1] = ((numParts[1] || '') + '00').substring(0, dec);
  return numParts.join(',');
};

export const getDateFormat = (d: Date): string => {
  const date: number = d.getDate();
  const month: number = d.getMonth() + 1;
  const year: number = d.getFullYear();
  const st: string =
    ('0' + date).slice(-2) + '.' + ('0' + month).slice(-2) + '.' + year;
  return st;
};

export const getPayDate = (d: Date): Date => {
  const date = new Date(d);
  // date =
  //   ДЕНЬНЕД(КОНМЕСЯЦА(date), 16) === 1 // суббота
  //     ? addDay(КОНМЕСЯЦА(date), -1)
  //     : ДЕНЬНЕД(КОНМЕСЯЦА(date), 16) === 2 // воскресенье
  //       ? addDay(КОНМЕСЯЦА(date), -2)
  //       : date.getMonth() === 11 // Если декабрь, то не ставим на 31 декабря
  //         ? addDay(КОНМЕСЯЦА(date), -1) // переносим на 30 декабря
  //         : КОНМЕСЯЦА(date);
  let dateAsString: string = getDateFormat(date);
  while (
    ACTION_STATUS_DATES_FOR_NOT_WORK.includes(dateAsString) || // Если объявлен не рабочим днем
    ACTION_STATUS_DATES_FOR_HOLIDAYS.includes(dateAsString.substring(0, 5)) || // Если попадает на праздничные дни
    (!ACTION_STATUS_DATES_FOR_WORK.includes(dateAsString) && // Если не попадает объявленным перенесенным выходным днем и
      (date.getDay() === 0 || date.getDay() === 6)) // если суббота или воскресенье
  ) {
    date.setDate(date.getDate() - 1);
    dateAsString = getDateFormat(date);
  }
  return date;
};
