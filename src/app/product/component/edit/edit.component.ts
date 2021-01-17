import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

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
    this.itemForm.disable();

    this.brandCtrl.statusChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => this.brandCtrl.valid ? this.productCtrl.enable({ emitEvent: false }) : this.productCtrl.disable());

    this.productCtrl.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((productId: number) => {
        if (productId) {
          this.itemForm.enable({ emitEvent: false });
          this.items$ = this.itemService.findItemsByProduct(productId)
            .pipe(tap(items => this.unitCtrl.setValue(items?.[0]?.unit)));
        } else {
          this.itemForm.disable();
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
        this.productForm.patchValue(product);
        this.productCtrl.setValue(product);
      });
  }
}
