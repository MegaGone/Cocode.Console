import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WageComponent } from './wage.component';

const routes: Routes = [
    {
        path: '',
        component: WageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WageRoutingModule {}
