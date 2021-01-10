import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appSearchDisplay]'
})
export class SearchDisplayDirective {
  constructor(public template: TemplateRef<{$implicit: any}>) { }
}