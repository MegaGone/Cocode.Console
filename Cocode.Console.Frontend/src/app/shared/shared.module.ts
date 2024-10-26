import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectFilterComponent } from './select-filter/select-filter.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatIconModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerComponent,
        MatSnackBarModule,
        SelectFilterComponent,
    ],
    declarations: [SpinnerComponent, SelectFilterComponent],
})
export class SharedModule {}
