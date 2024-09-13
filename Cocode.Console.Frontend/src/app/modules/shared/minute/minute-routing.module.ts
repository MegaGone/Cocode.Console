import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinuteComponent } from './minute.component';

const routes: Routes = [
    {
        path: '',
        component: MinuteComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MinuteRoutingModule {}
