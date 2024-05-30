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
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
            { path: '**', pathMatch: 'full', redirectTo: 'sign-in' },
        ],
    },
    {
        path: 'administrador',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'usuarios',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
            {
                path: 'historial-pagos',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/neighbor/payment/payment.module').then(
                        (m) => m.PaymentModule
                    ),
            },
            {
                path: 'reportes',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/reports/reports.module').then(
                        (m) => m.ReportsModule
                    ),
            },
            {
                path: 'servicios',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/services/services.module').then(
                        (m) => m.ServicesModule
                    ),
            },
            { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
            { path: '**', pathMatch: 'full', redirectTo: 'usuarios' },
        ],
    },
    {
        path: 'residente',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'pagos',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/neighbor/payment/payment.module').then(
                        (m) => m.PaymentModule
                    ),
            },
            { path: '', pathMatch: 'full', redirectTo: 'pagos' },
            { path: '**', pathMatch: 'full', redirectTo: 'pagos' },
        ],
    },
    { path: '', pathMatch: 'full', redirectTo: `${mainRoute}` },
    { path: '**', pathMatch: 'full', redirectTo: `${mainRoute}` },
];
