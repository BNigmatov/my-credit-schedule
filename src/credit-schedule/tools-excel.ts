import { getDaysInMonth } from './tools-fn';

export const ЕСЛИ = (
  condition: boolean,
  returnIfTrue: any,
  returnIfFalse: any
): any => (condition ? returnIfTrue : returnIfFalse);

export const ДЕНЬ = (date: Date): number => date.getDate();
export const МЕСЯЦ = (date: Date): number => date.getMonth();
export const ГОД = (date: Date): number => date.getFullYear();
export const ДАТА = (year: number, month: number, date: number): Date =>
  new Date(year, month, date);

export const ДАТАМЕС = (date: Date, totalMonth: number = 0): Date => {
  // ДАТАМЕС
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + totalMonth);
  const daysInMonth = getDaysInMonth(d);
  const days = date.getDate();
  d.setDate(days > daysInMonth ? daysInMonth : days);
  return d;
};

export const ДЕНЬНЕД = (date: Date, type: number): number => {
  // ДЕНЬНЕД
  const d = new Date(date);
  let day = d.getDay();
  if (type === 16) {
    day = day + 2 > 7 ? day - 5 : day + 2;
  }
  return day;
};

export const КОНМЕСЯЦА = (date: Date, totalMonth: number = 0): Date => {
  // КОНМЕСЯЦА
  const d = new Date(date);
  d.setDate(1);
  // d.setHours(23, 59, 59, 999);
  d.setHours(0, 0, 0, 1);
  d.setMonth(d.getMonth() + 1 + totalMonth);
  d.setDate(d.getDate() - 1);
  return d;
};

export const ОКРУГЛ = (num: number, dec: number = 0): number => {
  const [sv, ev] = num.toString().split('e');
  return Number(
    Number(Math.round(parseFloat(sv + 'e' + dec)) + 'e-' + dec) +
      'e' +
      (ev || 0)
  );
};

export const ИЛИ = (
  cond1: boolean,
  cond2: boolean,
  cond3?: boolean
): boolean => {
  return cond1 || cond2 || cond3;
};

export const И = (
  cond1: boolean,
  cond2: boolean,
  cond3: boolean = true
): boolean => {
  return cond1 && cond2 && cond3;
};

export const pmt = (rate, nperiod, pv, fv, type) => {
  if (!fv) fv = 0;
  if (!type) type = 0;
  if (rate == 0) return -(pv + fv) / nperiod;
  var pvif = Math.pow(1 + rate, nperiod);
  var result = (rate / (pvif - 1)) * -(pv * pvif + fv);
  if (type == 1) {
    result /= 1 + rate;
  }
  return result;
};

export const ipmt = (pv, pmt, rate, per) => {
  var tmp = Math.pow(1 + rate, per);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
};

export const ОСПЛТ = (rate, per, nper, pv, fv?, type?) => {
  // ppmt
  fv = typeof fv !== 'undefined' ? fv : 0;
  type = typeof type !== 'undefined' ? type : 0;
  if (per < 1 || per >= nper + 1) return 0;
  var x = pmt(rate, nper, pv, fv, type);
  var y = ipmt(pv, x, rate, per - 1);
  return x - y;
};
