import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import * as moment from 'moment';

describe('DatePickerComponent', () => {
  let datePicker: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatDatepickerModule,
          NoopAnimationsModule,
          MatMomentDateModule,
          FormsModule,
          ReactiveFormsModule
        ],
        declarations: [DatePickerComponent],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(DatePickerComponent);
      datePicker = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
    })
  );

  it('should load all datepicker input harnesses', async () => {
    const inputs = await loader.getAllHarnesses(MatDatepickerInputHarness);
    expect(inputs.length).toBe(1);
  });

  it('should set the input value', async () => {
    const input = await loader.getHarness(MatDatepickerInputHarness);
    expect(await input.getValue()).toBeFalsy();

    await input.setValue('1/1/2020');
    expect(await input.getValue()).toBe('1/1/2020');
  });

  it('should set the label value', async () => {
    const labelElement: HTMLElement = fixture.nativeElement.querySelector('mat-label');
    datePicker.label = 'Test Date';
    fixture.detectChanges();
    expect(labelElement.textContent).toEqual(datePicker.label);
  });

  it('should transmit date in yyyyMMDD format', async () => {
    const input = await loader.getHarness(MatDatepickerInputHarness);
    datePicker.registerOnChange(
      (date: string) => expect(date).toEqual('20200101')
    );
    await input.setValue('1/1/2020');
  });

  it('it should implement ControlValueAccessor.registerOnTouched', async () => {
    const onTouched = jasmine.createSpy('onTouched');
    datePicker.registerOnTouched(onTouched);

    const input = await loader.getHarness(MatDatepickerInputHarness);
    expect(await input.isFocused()).toBe(false);
    await input.focus();
    expect(await input.isFocused()).toBe(true);
    await input.blur();
    expect(await input.isFocused()).toBe(false);
    expect(onTouched).toHaveBeenCalled();
  });

  it('should implement ControlValueAccessor.writeValue', async () => {
    const date = '01/01/2021';
    datePicker.writeValue(date);
    fixture.detectChanges();

    const input = await loader.getHarness(MatDatepickerInputHarness);
    expect(await input.getValue()).toBe(moment(date, 'MM/DD/yyyy').format('l'));
  });

  it('should implement ControlValueAccessor.registerOnChange', async () => {
    const onChange = jasmine.createSpy('onChange');
    datePicker.registerOnChange(onChange);

    const input = await loader.getHarness(MatDatepickerInputHarness);
    await input.setValue('1/1/2020');

    expect(onChange).toHaveBeenCalledOnceWith('20200101');
  });

  it('should implement ControlValueAccessor.setDisabledState', async () => {
    const input = await loader.getHarness(MatDatepickerInputHarness);
    
    datePicker.setDisabledState(true);
    expect(await input.isDisabled()).toBe(true);

    datePicker.setDisabledState(false);
    expect(await input.isDisabled()).toBe(false);
  });
});
