import { AsyncPipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConsentDto, ConsentScope } from '../../models/consent.dto';

interface ConsentGroupVm {
  scope: ConsentScope;
  consents: ConsentDto[];
}

@Component({
  selector: 'app-client-step-consents',
  imports: [AsyncPipe, ReactiveFormsModule, ProgressSpinnerModule, CheckboxModule],
  templateUrl: './client-step-consents.component.html',
})
export class ClientStepConsentsComponent implements OnInit {
  readonly consents$ = input.required<Observable<ConsentDto[]>>();
  readonly consentsForm = input.required<FormRecord<FormControl<boolean>>>();

  protected groupedConsents$!: Observable<ConsentGroupVm[]>;
  protected requiredMissingCount$!: Observable<number>;

  ngOnInit(): void {
    this.groupedConsents$ = this.consents$().pipe(
      map((consents) => {
        const grouped = new Map<ConsentScope, ConsentDto[]>();
        for (const consent of consents) {
          grouped.set(consent.scope, [...(grouped.get(consent.scope) ?? []), consent]);
        }
        return Array.from(grouped.entries()).map(([scope, items]) => ({
          scope,
          consents: items,
        }));
      }),
    );

    this.requiredMissingCount$ = combineLatest([
      this.consents$(),
      this.consentsForm().valueChanges.pipe(startWith(this.consentsForm().getRawValue())),
    ]).pipe(
      map(([consents, formValue]) => {
        return consents.filter((consent) => consent.required && !formValue[consent.code]).length;
      }),
    );
  }
}
