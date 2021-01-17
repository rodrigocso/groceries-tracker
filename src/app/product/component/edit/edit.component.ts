import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Brand } from '../../../core/model/brand';
import { ItemDto } from '../../../core/model/item';
import { Product } from '../../../core/model/product';
import { BrandService } from '../../../core/service/brand.service';
import { ItemService } from '../../../core/service/item.service';
import { ProductService } from '../../../core/service/product.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  componentDestroyed$ = new Subject();

  brandCtrl = new FormControl(null, Validators.required);
  productCtrl = new FormControl(null, Validators.required);
  packageSizeCtrl = new FormControl(null, Validators.required);
  unitCtrl = new FormControl(null, Validators.required);

  items$: Observable<ItemDto[]> = EMPTY;
  units = ['g', 'kg', 'mL', 'cL', 'L', 'un'];

  productForm = this.fb.group({
    id: [null, Validators.required],
    name: [null, Validators.required],
    brandId: this.brandCtrl
  });

  itemForm = this.fb.group({
    productId: this.productCtrl,
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
    this.packageSizeCtrl.disable();
    this.unitCtrl.disable();

    this.brandCtrl.statusChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        if (this.brandCtrl.valid) {
          this.productCtrl.enable();
        } else {
          this.productCtrl.reset();
          this.productCtrl.disable({ emitEvent: false });
        }
      });

    this.productCtrl.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        distinctUntilChanged()
      )
      .subscribe((productId: number) => {
        if (this.productCtrl.valid) {
          this.packageSizeCtrl.enable();
          this.unitCtrl.enable();
          this.items$ = this.itemService.findItemsByProduct(productId);
        } else {
          this.packageSizeCtrl.reset();
          this.packageSizeCtrl.disable();
          this.unitCtrl.reset();
          this.unitCtrl.disable();
          this.items$ = EMPTY;
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onAddBrandClicked(name: string): void {
    this.brandService.addOne({ name })
      .subscribe(brand => this.brandCtrl.setValue(brand, { emitEvent: false }));
  }

  onAddPackagingClick(): void {
    this.itemService.addOne(this.itemForm.value)
      .subscribe(item => this.items$ = this.itemService.findItemsByProduct(item.productId));
    this.packageSizeCtrl.reset();
  }

  onAddProductClicked(name: string): void {
    this.productForm.patchValue({ name });
    this.productService.addOne(this.productForm.value)
      .subscribe(product => {
        this.productForm.patchValue({ id: product.id });
        this.productCtrl.setValue(product);
      });
  }
}
