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

describe('DatePickerComponent', () => {
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
      fixture.detectChanges();
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
    fixture.componentInstance.label = 'Test Date';
    fixture.detectChanges();
    expect(labelElement.textContent).toEqual(fixture.componentInstance.label);
  });

  it('should transmit date in yyyyMMDD format', async () => {
    const input = await loader.getHarness(MatDatepickerInputHarness);
    fixture.componentInstance.registerOnChange(
      (date: string) => expect(date).toEqual('20200101')
    );
    await input.setValue('1/1/2020');
  });
});
