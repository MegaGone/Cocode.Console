import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitsRoutingModule } from './visits-routing.module';
import { VisitsComponent } from './visits.component';


@NgModule({
  declarations: [
    VisitsComponent
  ],
  imports: [
    CommonModule,
    VisitsRoutingModule
  ]
})
export class VisitsModule { }
