import { TestBed, ComponentFixture, waitForAsync, inject } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchSelectorComponent } from './search-selector.component';

interface Hero {
  id: number;
  name: string;
  powers?: string[];
  realName: string;
}

describe('SearchSelectorComponent', () => {
  let fixture: ComponentFixture<SearchSelectorComponent<Hero>>;
  let loader: HarnessLoader;
  let overlayContainer: OverlayContainer;
  let searchSelector: SearchSelectorComponent<Hero>;

  const HEROES: Hero[] = [
    { id: 1, name: 'Wolverine', powers: ['Healing Factor', 'Superhuman senses'], realName: 'Logan' },
    { id: 2, name: 'Hawkeye', realName: 'Clint Barton' },
    { id: 3, name: 'Hulk', powers: ['Invulnerability', 'Super strength'], realName: 'Bruce Banner' }
  ];
  const fetchFn = (query: string) => of(HEROES)
    .pipe(
      map(heroes => heroes.filter(h => h.name.startsWith(query, 0)))
    );
  const outputFn = (hero: Hero) => hero.id;
  const primaryTextFn = (hero: Hero) => hero.name;
  const secondaryTextFn = (hero: Hero) => hero.powers?.join(', ') || 'Useless';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatAutocompleteModule, FormsModule, ReactiveFormsModule],
        declarations: [SearchSelectorComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent<SearchSelectorComponent<Hero>>(SearchSelectorComponent);
    searchSelector = fixture.componentInstance;
    searchSelector.fetchFn = fetchFn;
    searchSelector.outputFn = outputFn;
    searchSelector.primaryTextFn = primaryTextFn;
    searchSelector.secondaryTextFn = secondaryTextFn;
    loader = TestbedHarnessEnvironment.loader(fixture);
    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
    })();
  });

  afterEach(() => {
    searchSelector.ngOnDestroy();
    searchSelector = null!;
    overlayContainer.ngOnDestroy();
    overlayContainer = null!;
  });

  it('should create', async () => {
    expect(searchSelector).toBeTruthy();
  });

  it('it should implement ControlValueAccessor.registerOnTouched', async () => {
    const onTouched = jasmine.createSpy('onTouched');
    searchSelector.registerOnTouched(onTouched);

    const input = await loader.getHarness(MatAutocompleteHarness);
    expect(await input.isFocused()).toBe(false);
    await input.focus();
    expect(await input.isFocused()).toBe(true);
    await input.blur();
    expect(await input.isFocused()).toBe(false);
    expect(onTouched).toHaveBeenCalled();
  });

  it('should implement ControlValueAccessor.writeValue', () => {
    searchSelector.writeValue(HEROES[2]);
    fixture.detectChanges();

    const searchSelectorEl: HTMLElement = fixture.nativeElement;
    const matLabel: HTMLElement | null = searchSelectorEl.querySelector('mat-label');
    const readOnlyInput: HTMLInputElement | null = searchSelectorEl.querySelector('input[readonly]');

    expect(matLabel?.textContent).toBe(secondaryTextFn(HEROES[2]));
    expect(readOnlyInput?.value).toBe(primaryTextFn(HEROES[2]));
    expect(searchSelector.value).toBe(HEROES[2]);
  });

  it('should implement ControlValueAccessor.registerOnChange', async () => {
    const onChange = jasmine.createSpy('onChange');
    searchSelector.registerOnChange(onChange);

    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Wol');
    await input.focus();

    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();
    expect(onChange).toHaveBeenCalledOnceWith(outputFn(HEROES[0]));
  });

  it('should implement ControlValueAccessor.setDisabledState', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness);

    searchSelector.setDisabledState(true);
    expect(await input.isDisabled()).toBe(true);

    searchSelector.setDisabledState(false);
    expect(await input.isDisabled()).toBe(false);
  });

  it('should throw an error when fetchFn is not provided', () => {
    searchSelector.fetchFn = undefined!;
    expect(() => fixture.detectChanges()).toThrowError('fetchFn was not provided.');
  });

  it('should throw an error when primaryTextFn is not provided', () => {
    searchSelector.primaryTextFn = undefined!;
    expect(() => fixture.detectChanges()).toThrowError('primaryTextFn was not provided.');
  });

  it('should fetch records using query from input', async () => {
    spyOn(searchSelector, 'fetchFn');

    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hawk');
    await input.focus();

    expect(searchSelector.fetchFn).toHaveBeenCalledWith('Hawk');
  });

  it('should display primary and secondary texts in search results', async () => {   
    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hawk');
    await input.focus();
    const options = await input.getOptions();

    expect(options.length).toBe(1);
    expect(overlayContainer.getContainerElement().querySelector('div.ss-primary')?.textContent).toBe('Hawkeye');
    expect(overlayContainer.getContainerElement().querySelector('div.ss-secondary')?.textContent).toBe('Useless');
  });

  it('should be able to select an option and have it displayed', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hu');
    await input.focus();

    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();
    const searchSelectorEl: HTMLElement = fixture.nativeElement;
    const matLabel: HTMLElement | null = searchSelectorEl.querySelector('mat-label');
    const readOnlyInput: HTMLInputElement | null = searchSelectorEl.querySelector('input[readonly]');
    
    expect(matLabel?.textContent).toBe(secondaryTextFn(HEROES[2]));
    expect(readOnlyInput?.value).toBe(primaryTextFn(HEROES[2]));
    expect(searchSelector.value).toBe(HEROES[2]);
  });

  it('should allow the label to be always displayed after selection', async () => {
    searchSelector.alwaysShowLabel = true;
    searchSelector.label = 'Selected Hero';

    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hu');
    await input.focus();

    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();
    const searchSelectorEl: HTMLElement = fixture.nativeElement;
    const matLabel: HTMLElement | null = searchSelectorEl.querySelector('mat-label');
    
    expect(matLabel?.textContent).toBe('Selected Hero');
  });

  it('it should clear search results and input after an option is selected', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness);
    
    await input.enterText('Wol');
    await input.focus();
    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();

    expect(searchSelector.inputCtrl.value).toBeFalsy();
    expect(searchSelector.searchResults$).toBe(EMPTY);
  });
});
