/* eslint-disable max-len */
import { IScheduleRow } from './schedule.interfaces';
import {
  ГОД,
  ДАТА,
  ДАТАМЕС,
  ДЕНЬ,
  ДЕНЬНЕД,
  ЕСЛИ,
  И,
  ИЛИ,
  КОНМЕСЯЦА,
  МЕСЯЦ,
  ОКРУГЛ,
  ОСПЛТ,
} from './tools-excel';
import { addDay, diffDays, getPayDate } from './tools-fn';

export const createCreditScheduleArray = (
  creditDate,
  creditPeriod,
  creditPercentage,
  creditSumma,
  dayOfMonth = 10,
  isNotAnnuitet = false,
  privilegedPeriod = 0,
  govCreditPercentage,
  govCreditPeriod
) => {
  // Муддати 36 ой (36 ҳам киради)гача ва % и 25% (25 ҳам киради)га ча бўлган кредитлар Андамда чиқиши керак, мазкур муддат ва фоиздан ошганда аннипотека графиги чиқиши керак
  const typeCalc: 'andam' | 'anipot' = isNotAnnuitet
    ? 'andam'
    : creditPeriod > 36 || creditPercentage > 25
    ? 'anipot'
    : 'andam';
  const givenDate: Date = new Date(creditDate);
  givenDate.setHours(0, 0, 0, 0);
  if (givenDate.getDate() > 20 && !privilegedPeriod) {
    // Если больше 20 го числа
    privilegedPeriod++;
  }
  const finishDate1: Date = new Date(givenDate);
  finishDate1.setMonth(finishDate1.getMonth() + creditPeriod);
  let finishDate: Date = new Date(finishDate1);
  finishDate.setDate(finishDate.getDate() - 1);
  finishDate = getPayDate(finishDate);
  // if (finishDate1.getMonth() > finishDate.getMonth()) {
  if (finishDate1.getDate() < finishDate.getDate()) {
    creditPeriod--;
  }

  const table: IScheduleRow[] = [];

  let lastRow: IScheduleRow = {
    month: 0,
    payment_day: getPayDate(КОНМЕСЯЦА(givenDate)),
    balance: creditSumma, // Остаток по кредиту - Кредит қолдиғи
    loan: 0, // Основной долг - Асосий қарзни қайтариш
    percentage: 0, // Проценты - Фоиз тўловларини қайтариш
    monthly_payment: 0, // Сумма выплаты - Жами тўланадиган сумма
  };

  const isCalcAsIpoteka =
    creditPeriod > 240 ||
    (!isNotAnnuitet &&
      privilegedPeriod === 0 &&
      (creditPeriod > 36 || (creditPeriod > 30 && creditPercentage > 26)));
  const days = diffDays(lastRow.payment_day, givenDate);
  const xxxx0 = isCalcAsIpoteka
    ? creditPercentage / 100 / 12
    : (creditPercentage / 100 / 365) * days;
  lastRow.percentage = ОКРУГЛ(lastRow.balance * xxxx0, 2);
  lastRow.monthly_payment = lastRow.loan + lastRow.percentage;
  if (govCreditPeriod > 0 && govCreditPercentage > 0) {
    lastRow.monthly_payment_gov =
      lastRow.percentage * (govCreditPercentage / creditPercentage);
    lastRow.monthly_payment_client =
      lastRow.monthly_payment - lastRow.monthly_payment_gov;
  } else {
    lastRow.monthly_payment_gov = 0;
  }

  if (typeCalc === 'anipot') {
    lastRow.payment_day = new Date(creditDate);
    // lastRow.payment_day.setDate(lastRow.payment_day.getDate() - 1);
    lastRow.percentage = 0;
    lastRow.monthly_payment = 0;
    lastRow.monthly_payment_gov = 0;
    lastRow.monthly_payment_client = 0;
    // privilegedPeriod--; // ?????????????????????????????????????
  } else {
    table.push(lastRow);
  }

  const summa: IScheduleRow = {
    month: 1,
    balance: creditSumma,
    loan: 0,
    percentage: lastRow.percentage,
    monthly_payment: lastRow.monthly_payment,
    monthly_payment_gov: lastRow.monthly_payment_gov,
    monthly_payment_client: lastRow.monthly_payment_client,
  };

  let G8;
  if (isNotAnnuitet) {
    // Уменшение
    // =+ОКРУГЛ(b!B9/(ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));b!$B$5-1;b!$B$5)-ЕСЛИ(ДЕНЬ(b!$B$1)>20;ЕСЛИ(b!$B$6=0;0+1;b!$B$6);b!$B$6));2)
    G8 = ОКРУГЛ(
      creditSumma /
        (creditPeriod -
          ЕСЛИ(
            ДЕНЬ(givenDate) > 20,
            ЕСЛИ(privilegedPeriod === 0, 0 + 1, privilegedPeriod),
            privilegedPeriod
          )),
      2
    );
  } else {
    // Анdam
    // =ОКРУГЛ(b!B9*(ОКРУГЛ(b!B7%/12;7)+(ОКРУГЛ(b!B7%/12;7))/((1+(ОКРУГЛ(b!B7%/12;7)))^(ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));b!$B$5-1;b!$B$5)-ЕСЛИ(ДЕНЬ(b!$B$1)>20;ЕСЛИ(b!$B$6=0;0+1;b!$B$6);b!$B$6))-1));2)
    const percentageMonth = ОКРУГЛ(creditPercentage / 100 / 12, 7);
    G8 = ОКРУГЛ(
      creditSumma *
        (percentageMonth +
          percentageMonth /
            (Math.pow(
              1 + percentageMonth,
              creditPeriod -
                ЕСЛИ(
                  ДЕНЬ(givenDate) > 20,
                  ЕСЛИ(privilegedPeriod === 0, 1, privilegedPeriod),
                  privilegedPeriod
                )
            ) -
              1)),
      2
    );
  }
  givenDate.setDate(dayOfMonth);

  while (lastRow.month < creditPeriod && lastRow.loan < lastRow.balance) {
    const row: IScheduleRow = {
      month: lastRow.month + 1,
      balance: lastRow.balance - lastRow.loan,
    } as IScheduleRow;
    givenDate.setMonth(givenDate.getMonth() + 1);
    row.payment_day = getPayDate(givenDate);
    if (row.month === creditPeriod) {
      // Последняя оплата должна быть на один день меньше от старта
      // row.payment_day.setDate(creditDate.getDate() - 1);
      // row.payment_day = getPayDate(row.payment_day);
      row.payment_day = finishDate;
    }

    const xxxx2 = isCalcAsIpoteka
      ? creditPercentage / 100 / 12
      : (creditPercentage / 100 / 365) *
        diffDays(row.payment_day, lastRow.payment_day);
    row.percentage = ЕСЛИ(
      row.month <= creditPeriod,
      ОКРУГЛ(
        ((row.balance * creditPercentage) / 100 / 365) *
          diffDays(row.payment_day, lastRow.payment_day),
        2
      ),
      ''
    );
    // row.percentage = ЕСЛИ(
    //   row.month <= creditPeriod,
    //   ОКРУГЛ(row.balance * xxxx2, 2),
    //   0
    // );

    if (isNotAnnuitet) {
      // Уменшение
      // =ЕСЛИ(A7<>"";ЕСЛИ(A7>ЕСЛИ(ДЕНЬ(b!$B$1)>20;ЕСЛИ(b!$B$6=0;0+1;b!$B$6);b!$B$6);ЕСЛИ(A7=ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));b!$B$5-1;b!$B$5);C7;$G$6);"");"")
      row.loan = ЕСЛИ(
        row.month <= creditPeriod,
        ЕСЛИ(
          row.month >
            ЕСЛИ(
              ДЕНЬ(givenDate) > 20,
              ЕСЛИ(privilegedPeriod === 0, 0 + 1, privilegedPeriod),
              privilegedPeriod
            ),
          ЕСЛИ(row.month === creditPeriod, row.balance, G8),
          0
        ),
        0
      );
    } else if (typeCalc === 'andam') {
      // Анdam
      // =+ЕСЛИ(A7<=ЕСЛИ(ДЕНЬ(b!$B$1)>20;ЕСЛИ(b!$B$6=0;0+1;b!$B$6);b!$B$6);"";ЕСЛИ(A7<>"";ЕСЛИ(A7=ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));b!$B$5-1;b!$B$5);C7;ЕСЛИ($G$6>E7;$G$6-E7;""));""));
      row.loan = ЕСЛИ(
        row.month <=
          ЕСЛИ(
            ДЕНЬ(givenDate) > 20,
            ЕСЛИ(privilegedPeriod === 0, 0 + 1, privilegedPeriod),
            privilegedPeriod
          ),
        0,
        ЕСЛИ(
          row.month <= creditPeriod,
          ЕСЛИ(
            row.month === creditPeriod,
            row.balance,
            ЕСЛИ(G8 > row.percentage, G8 - row.percentage, 0)
          ),
          0
        )
      );
    } else {
      // anipot (2)
      // =+ЕСЛИ(A7<=ЕСЛИ(ДЕНЬ(b!$B$1)>20;ЕСЛИ(b!$B$6=0;0+1;b!$B$6);b!$B$6);"";ЕСЛИ(A7<>"";ЕСЛИ(A7=ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));b!$B$5-1;b!$B$5);C7;ЕСЛИ(ИЛИ(ДЕНЬ(b!$B$1)=1;И(ДЕНЬ(b!$B$1)=2;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)>=6);И(ДЕНЬ(b!$B$1)=3;ДЕНЬНЕД(ДАТАМЕС(b!$B$1;b!$B$5)-1;2)=7));-ОКРУГЛ(ОСПЛТ(b!$B$7%/12;A7-b!$B$6;b!$B$5-b!$B$6-1;b!$B$9;);2);-ОКРУГЛ(ОСПЛТ(b!$B$7%/12;A7-b!$B$6;b!$B$5-b!$B$6;b!$B$9;);2)));""))
      row.loan = ЕСЛИ(
        row.month <=
          ЕСЛИ(
            ДЕНЬ(givenDate) > 20,
            ЕСЛИ(privilegedPeriod === 0, 0 + 1, privilegedPeriod),
            privilegedPeriod
          ),
        0,
        ЕСЛИ(
          row.month > 0,
          ЕСЛИ(
            row.month === creditPeriod,
            row.balance,
            ЕСЛИ(
              ИЛИ(
                ДЕНЬ(givenDate) === 1,
                И(
                  ДЕНЬ(givenDate) === 2,
                  ДЕНЬНЕД(addDay(ДАТАМЕС(givenDate, creditPeriod), -1), 2) >= 6
                ),
                И(
                  ДЕНЬ(givenDate) === 3,
                  ДЕНЬНЕД(addDay(ДАТАМЕС(givenDate, creditPeriod), -1), 2) === 7
                )
              ),
              -ОКРУГЛ(
                ОСПЛТ(
                  creditPercentage / 100 / 12,
                  row.month - privilegedPeriod,
                  creditPeriod - privilegedPeriod - 1,
                  creditSumma
                ),
                2
              ),
              -ОКРУГЛ(
                ОСПЛТ(
                  creditPercentage / 100 / 12,
                  row.month - privilegedPeriod,
                  creditPeriod - privilegedPeriod,
                  creditSumma
                ),
                2
              )
            )
          ),
          0
        )
      );
    }

    row.monthly_payment = ЕСЛИ(
      row.month <= creditPeriod,
      ЕСЛИ(row.loan > 0, row.percentage + row.loan, row.percentage),
      0
    );
    // row.monthly_payment =
    //   row.loan === 0 ? row.percentage : row.percentage + row.loan;

    // Чтобы не переходил на отрицательные цифры:
    // if (row.loan > row.balance) {
    //   row.loan = row.balance;
    // }

    if (
      govCreditPeriod > 0 &&
      govCreditPercentage > 0 &&
      govCreditPeriod >= row.month
    ) {
      row.monthly_payment_gov = ОКРУГЛ(
        ОКРУГЛ(govCreditPercentage / creditPercentage, 7) * row.percentage,
        2
      );
      row.monthly_payment_client =
        row.monthly_payment - row.monthly_payment_gov;
      // row.percentage - row.monthly_payment_gov;
    } else {
      row.monthly_payment_client = row.monthly_payment;
    }

    table.push(row);
    lastRow = { ...row };

    summa.month++;
    summa.balance = row.loan > 0 ? row.balance - row.loan : row.balance;
    summa.loan += +row.loan;
    summa.percentage += row.percentage;
    summa.monthly_payment += row.monthly_payment;
    summa.monthly_payment_gov += row.monthly_payment_gov || 0;
    summa.monthly_payment_client += row.monthly_payment_client || 0;
  }
  // if (initialAmmount) {
  //   summa.monthly_payment += initialAmmount;
  // }
  table.push(summa);
  return table;
};
