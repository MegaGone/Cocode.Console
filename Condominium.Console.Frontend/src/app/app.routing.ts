import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { getMainRoute } from './utils/menu';
import { AuthGuard } from './modules/auth/auth.guard';

const mainRoute = getMainRoute();

export const appRoutes: Route[] = [
    {
        path: 'auth',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
            { path: '**', pathMatch: 'full', redirectTo: 'sign-in' }
        ]
    },
    {
        path: 'administrador',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'usuarios', canActivate: [AuthGuard], loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule) },
            { path: 'residentes', canActivate: [AuthGuard], loadChildren: () => import('app/modules/admin/residents/residents.module').then(m => m.ResidentsModule) },
            { path: 'donaciones', canActivate: [AuthGuard], loadChildren: () => import('app/modules/admin/donations/donations.module').then(m => m.DonationsModule) },
            { path: 'planilla', canActivate: [AuthGuard], loadChildren: () => import('app/modules/admin/forms/forms.module').then(m => m.FormsModule) },
            { path: 'residentes-solventes', canActivate: [AuthGuard], loadChildren: () => import('app/modules/admin/solvents/solvents.module').then(m => m.SolventsModule) },
            { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
            { path: '**', pathMatch: 'full', redirectTo: 'usuarios' }
        ]
    },
    {
        path: 'operador',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'visitas', canActivate: [AuthGuard], loadChildren: () => import('app/modules/operator/visits/visits.module').then(m => m.VisitsModule) },
            { path: 'reportes-incidentes', canActivate: [AuthGuard], loadChildren: () => import('app/modules/operator/reports/reports.module').then(m => m.ReportsModule) },
            { path: '', pathMatch: 'full', redirectTo: 'visitas' },
            { path: '**', pathMatch: 'full', redirectTo: 'visitas' },
        ]
    },
    {
        path: 'residente',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'pagos', canActivate: [AuthGuard], loadChildren: () => import('app/modules/resident/payments/payments.module').then(m => m.PaymentsModule) },
            { path: '', pathMatch: 'full', redirectTo: 'pagos' },
            { path: '**', pathMatch: 'full', redirectTo: 'pagos' }
        ]
    },
    { path: '', pathMatch: 'full', redirectTo: `${mainRoute}` },
    { path: '**', pathMatch: 'full', redirectTo: `${mainRoute}` }
];