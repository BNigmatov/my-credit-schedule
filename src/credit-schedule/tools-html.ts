import { IScheduleRow } from './schedule.interfaces';
import { dateToStringFormat, thousandsSeparators } from './tools-fn';

export const creditScheduleArrayToHtml = (
  scheduleTable: IScheduleRow[]
): string => {
  let is_subsidiy: boolean;
  if (scheduleTable.length && scheduleTable[0].monthly_payment_gov > 0) {
    is_subsidiy = true;
  }
  const summa: IScheduleRow = scheduleTable.pop();
  const table: string[] = [];
  const row: string[] = [
    '<th>#</th>',
    '<th style="text-align: center;"> Қайтариш санаси </th>',
    '<th style="text-align: center;"> Кредит қолдиғи </th>',
    '<th style="text-align: center;"> Асосий қарзни қайтариш </th>',
    '<th style="text-align: center;"> Фоиз тўловларини қайтариш </th>',
  ];
  if (is_subsidiy) {
    row.push(
      '<th style="text-align: center;"> Покрывающий бюджетом (субсидия) </th>'
    );
    row.push('<th style="text-align: center;"> Мижоз тарафдан тўланадиган </th>');
  }
  row.push('<th style="text-align: center;">Жами тўланадиган сумма</th>');
  table.push(row.join(''));

  // Table Body:
  scheduleTable.forEach((item) => {
    const row: string[] = [
      '<td style="text-align: right;">' + item.month + '</td>',
      '<td style="text-align: right;">' +
        dateToStringFormat(item.payment_day) +
        '</td>',
      '<td style="text-align: right;">' +
        thousandsSeparators(item.balance) +
        '</td>',
      '<td style="text-align: right;">' +
        thousandsSeparators(item.loan) +
        '</td>',
      '<td style="text-align: right;">' +
        thousandsSeparators(item.percentage) +
        '</td>',
    ];
    if (is_subsidiy) {
      row.push(
        '<td style="text-align: right;">' +
          thousandsSeparators(item.monthly_payment_gov || 0) +
          '</td>'
      );
      row.push(
        '<td style="text-align: right;">' +
          thousandsSeparators(item.monthly_payment_client || 0) +
          '</td>'
      );
      // } else {
      //   item.monthly_payment = item.monthly_payment_client;
    }
    row.push(
      '<td style="text-align: right;">' +
        thousandsSeparators(item.monthly_payment) +
        '</td>'
    );
    table.push(row.join(''));
  });
  // Table Footer:
  const rowSumma: string[] = [
    '<th>&nbsp;</th>',
    '<th style="text-align: center;"> Жами: </th>',
    '<th style="text-align: right;">' +
      thousandsSeparators(summa.balance) +
      '</th>',
    '<th style="text-align: right;">' +
      thousandsSeparators(summa.loan) +
      '</th>',
    '<th style="text-align: right;">' +
      thousandsSeparators(summa.percentage) +
      '</th>',
  ];
  if (is_subsidiy) {
    rowSumma.push(
      '<th style="text-align: right;">' +
        thousandsSeparators(summa.monthly_payment_gov) +
        '</th>'
    );
    rowSumma.push(
      '<th style="text-align: right;">' +
        thousandsSeparators(summa.monthly_payment_client) +
        '</th>'
    );
  }
  rowSumma.push(
    '<th style="text-align: right;">' +
      thousandsSeparators(summa.monthly_payment) +
      '</th>'
  );
  table.push(rowSumma.join(''));

  return (
    '<table class="table" border="1">' +
    '<tr>' +
    table.join('</tr></tr>') +
    '</tr>' +
    '</table>'
  );
};
