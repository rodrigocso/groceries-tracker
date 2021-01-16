import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Brand } from '../../../core/model/brand';
import { ItemDto } from '../../../core/model/item';
import { Product } from '../../../core/model/product';
import { BrandService } from '../../service/brand.service';
import { ItemService } from '../../service/item.service';
import { ProductService } from '../../service/product.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  componentDestroyed$ = new Subject();

  brandCtrl = new FormControl();
  productCtrl = new FormControl();
  packageSizeCtrl = new FormControl();
  unitCtrl = new FormControl();

  items$: Observable<ItemDto[]> = EMPTY;
  units = ['g', 'kg', 'cL', 'mL', 'un', 'L'];

  form = this.fb.group({
    id: null,
    product: this.fb.group({
      id: null,
      brand: this.fb.group({
        id: null,
        name: this.brandCtrl
      }),
      name: this.productCtrl
    }),
    packageSize: this.packageSizeCtrl,
    unit: this.unitCtrl
  });

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private itemService: ItemService,
    private productService: ProductService) { }

  get fetchBrandsFn(): (query: string) => Observable<Brand[]> {
    return this.brandService.findBrandsByName.bind(this.brandService);
  }

  get fetchProductsFn(): (query: string) => Observable<Product[]> {
    return this.productService.findProductsByNameAndBrandId.bind(this.productService, this.brandCtrl.value);
  }

  get brandNameGetter(): (brand: Brand) => string {
    return (brand) => brand.name;
  }

  get productNameGetter(): (product: Product) => string {
    return (product) => product.name;
  }

  get productBrandNameGetter(): (product: Product) => string {
    return (product) => product?.brand.name;
  }

  ngOnInit(): void {
    this.productCtrl.disable();
    this.brandCtrl.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(brand => {
        if (!brand) {
          this.productCtrl.disable();
        } else {
          this.productCtrl.enable();
        }
      });
    this.productCtrl.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((product: Product) => {
        if (product?.id) {
          this.items$ = this.itemService.findItemsByProduct(product.id);
        } else {
          this.items$ = EMPTY;
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onAddBrandClicked(name: string): void {
    this.brandService.addOne({ name }).subscribe(brand => this.brandCtrl.setValue(brand));
  }

  onAddProductClicked(name: string): void {
    this.productService.addOne({ brand: this.brandCtrl.value, name: name })
      .subscribe(product => this.productCtrl.setValue(product));
  }
}
