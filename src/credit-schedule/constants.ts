/**
 * Список дат которые попдают на выходные но признан как рабочий день. Формат: ДД.ММ.ГГГГ
 */
export const ACTION_STATUS_DATES_FOR_WORK: string[] = [
  // '17.07.2021',
  // '24.07.2021',
  // '08.01.2022',
  // '30.04.2022',
  // '07.05.2022',
  // '16.07.2022',
  // '07.01.2023',
];

/**
 * Список дат которые были объявлены как выходные. Формат: ДД.ММ.ГГГГ
 */
export const ACTION_STATUS_DATES_FOR_NOT_WORK: string[] = [
  // '31.12.2021',
  // '03.01.2022',
  // '04.01.2022',
  // '02.05.2022',
  // '03.05.2022',
  // '04.05.2022',
  // '11.07.2022',
  // '12.07.2022',
  // '01.09.2022',
  // '02.09.2022',
  // '08.12.2022',
  // '02.01.2023',
  // '03.01.2023',
  // '08.03.2023',
  // '20.03.2023',
  // '21.03.2023',
  // '22.03.2023',
  // '24.04.2023',
  // '01.06.2023',
  // '30.06.2023',
  // '01.09.2023',
  // '02.09.2023',
];

export const ACTION_STATUS_DATES_FOR_HOLIDAYS: string[] = [
  '01.01', // 1 января -	Новый год
  '14.01', // 14 января - День защитников Родины
  '08.03', // 8 марта - Женский день
  '21.03', // 21 марта - Навруз
  '09.05', // 9 мая - День памяти и почестей
  '01.09', // 1 сентября - День Независимости
  '01.10', // 1 октября - День учителя
  '08.12', // 8 декабря - День Конституции
];
