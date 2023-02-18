import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { createCreditScheduleArray } from '../credit-schedule/schedule';
import { creditScheduleArrayToHtml } from '../credit-schedule/tools-html';

const LOCAL_STORAGE_ID = 'my-schedule';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  formValues: any = {
    date: new Date('2023-01-23'),
    period: 240,
    procent: 17,
    summa: 100000000,
    privileged: 0,
    day_of_month: 7,
    is_not_annuitet: false,
    gov_percentage: 0,
    gov_period: 60,
  };

  form: FormGroup;
  innerHTML: SafeHtml;
  typeCalc: 'andam' | 'anipot' | 'Уменьшение';

  constructor(
    protected sanitizer: DomSanitizer,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      date: new FormControl(0, [Validators.required]),
      period: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(1200),
      ]),
      procent: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(99),
      ]),
      summa: new FormControl(0, [Validators.required, Validators.min(1000000)]),
      privileged: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(99),
      ]),
      day_of_month: new FormControl(0, [
        Validators.required,
        Validators.min(1),
        Validators.max(30),
      ]),
      is_not_annuitet: new FormControl(false, [Validators.required]),
      gov_percentage: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(99),
      ]),
      gov_period: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(999),
      ]),
    });
  }

  ngOnInit(): void {
    const localValues: string = localStorage.getItem(LOCAL_STORAGE_ID);
    if (localValues) {
      let savedValues: any;
      try {
        savedValues = JSON.parse(localValues);
      } catch (error) {
        console.error(
          'Ошибка при чтении данных с localStorage[' + LOCAL_STORAGE_ID + ']=',
          localValues
        );
      }
      if (savedValues) {
        // this.formValues = savedValues;
        for (const key in savedValues) {
          if (Object.prototype.hasOwnProperty.call(savedValues, key)) {
            if (['date'].includes(key)) {
              this.formValues[key] = new Date(savedValues[key]);
            } else {
              this.formValues[key] = savedValues[key];
            }
          }
        }
      }
    }
    this.form.patchValue(this.formValues);

    this.form.valueChanges.subscribe((values) => {
      this.formValues = values;
      localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(this.formValues));
      this.render();
    });

    this.render();
  }

  render(): void {
    this.typeCalc = this.formValues.is_not_annuitet
      ? 'Уменьшение'
      : this.formValues.period > 36 || this.formValues.procent > 25
      ? 'anipot'
      : 'andam';
    this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(
      creditScheduleArrayToHtml(
        createCreditScheduleArray(
          this.formValues.date,
          this.formValues.period,
          this.formValues.procent,
          this.formValues.summa,
          this.formValues.day_of_month,
          this.formValues.is_not_annuitet,
          this.formValues.privileged,
          this.formValues.gov_percentage,
          this.formValues.gov_period
        )
      )
    );
    this._changeDetectorRef.markForCheck();
  }
}
