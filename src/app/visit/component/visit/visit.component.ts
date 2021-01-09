import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Item } from '../../../core/model/item';
import { VisitService } from '../../service/visit.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  item = new FormControl();
  items$ = new Observable<Item[]>();

  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
    this.item.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.items$ = this.visitService.findProductsByNameOrBrand(query);
    });
  }
}
