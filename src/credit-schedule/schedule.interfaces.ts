export interface IScheduleRow {
  month: number;
  payment_day?: Date;
  balance: number;
  loan: number;
  percentage: number;

  /**
   * Итого гашение за месяц
   */
  monthly_payment: number;
  
  /**
   * Бюджет коплайдиган кисми (субсидия)
   */
  monthly_payment_gov?: number;

  /**
   * Мижоз тарафдан туланадиган
   */
  monthly_payment_client?: number;
}
