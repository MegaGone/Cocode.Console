import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReportsComponent } from './reports.component';
import { ListComponent } from './list/list.component';
import { SuggestionModule } from 'app/modules/neighbor/suggestion/suggestion.module';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarService } from 'app/utils';

@NgModule({
    declarations: [ReportsComponent, ListComponent],
    imports: [
        SharedModule,
        ReportsRoutingModule,
        SuggestionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
    ],
})
export class ReportsModule {}
