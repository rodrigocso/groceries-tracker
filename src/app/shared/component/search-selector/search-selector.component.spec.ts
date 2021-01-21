import { TestBed, ComponentFixture, waitForAsync, inject } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchSelectorComponent } from './search-selector.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Hero {
  id: number;
  name: string;
  powers?: string[];
  realName: string;
}

describe('SearchSelectorComponent', () => {
  let fixture: ComponentFixture<SearchSelectorComponent>;
  let loader: HarnessLoader;
  let overlayContainer: OverlayContainer;

  const HEROES: Hero[] = [
    { id: 1, name: 'Wolverine', powers: ['Healing Factor', 'Superhuman senses'], realName: 'Logan' },
    { id: 2, name: 'Hawkeye', realName: 'Clint Barton' },
    { id: 3, name: 'Hulk', powers: ['Invulnerability', 'Super strength'], realName: 'Bruce Banner' }
  ];
  const fetchFn = (query: string) => of(HEROES)
    .pipe(
      map(heroes => heroes.filter(h => h.name.startsWith(query, 0)))
    );
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
    fixture = TestBed.createComponent(SearchSelectorComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
    })();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    overlayContainer = null!;
  });

  it('should display primary and secondary texts in search results', async () => {
    fixture.componentInstance.fetchFn = fetchFn;
    fixture.componentInstance.primaryTextFn = primaryTextFn;
    fixture.componentInstance.secondaryTextFn = secondaryTextFn;
    fixture.componentInstance.ngOnInit();
    
    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hawk');
    await input.focus();
    const options = await input.getOptions();

    expect(options.length).toBe(1);
    expect(overlayContainer.getContainerElement().querySelector('div.ss-primary')?.textContent).toBe('Hawkeye');
    expect(overlayContainer.getContainerElement().querySelector('div.ss-secondary')?.textContent).toBe('Useless');
  });

  it('should be able to select an option and have it displayed', async () => {
    fixture.componentInstance.fetchFn = fetchFn;
    fixture.componentInstance.primaryTextFn = primaryTextFn;
    fixture.componentInstance.secondaryTextFn = secondaryTextFn;
    fixture.componentInstance.ngOnInit();

    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hu');
    await input.focus();

    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();
    const searchSelectorEl: HTMLElement = fixture.nativeElement;
    const matLabel: HTMLElement | null = searchSelectorEl.querySelector('mat-label');
    const readOnlyInput: HTMLInputElement | null = searchSelectorEl.querySelector('input[readonly]');
    
    expect(matLabel?.textContent).toBe(secondaryTextFn(HEROES[2]));
    expect(readOnlyInput?.value).toBe('Hulk');
    expect(fixture.componentInstance.value).toBe(HEROES[2]);
  });

  it('should allow the label to be always displayed after selection', async () => {
    fixture.componentInstance.alwaysShowLabel = true;
    fixture.componentInstance.label = 'Selected Hero';
    fixture.componentInstance.fetchFn = fetchFn;
    fixture.componentInstance.primaryTextFn = primaryTextFn;
    fixture.componentInstance.secondaryTextFn = secondaryTextFn;
    fixture.componentInstance.ngOnInit();

    const input = await loader.getHarness(MatAutocompleteHarness);
    await input.enterText('Hu');
    await input.focus();

    (overlayContainer.getContainerElement().querySelector('mat-option') as HTMLElement).click();
    const searchSelectorEl: HTMLElement = fixture.nativeElement;
    const matLabel: HTMLElement | null = searchSelectorEl.querySelector('mat-label');
    
    expect(matLabel?.textContent).toBe('Selected Hero');
  });
});
