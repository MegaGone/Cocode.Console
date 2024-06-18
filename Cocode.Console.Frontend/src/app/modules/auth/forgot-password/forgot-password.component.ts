import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from './forgot-password.service';
import { Subject, takeUntil } from 'rxjs';
import { SnackBarService } from 'app/utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<void>;

    public isLoading: boolean;
    public stepOneForm: FormGroup;
    public showRecoverForm: boolean;

    public stepTwoForm: FormGroup;
    private _passwordRegex: RegExp;

    constructor(
        private readonly _router: Router,
        private readonly _formbuilder: FormBuilder,
        private readonly _snackbar: SnackBarService,
        private readonly _service: ForgotPasswordService
    ) {
        this.showRecoverForm = false;
        this._unsubscribeAll = new Subject();
        this._passwordRegex = new RegExp(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        );
    }

    ngOnInit(): void {
        this._initStepOneForm();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _initStepOneForm(): void {
        this.stepOneForm = this._formbuilder.group({
            email: ['', [Validators.required, Validators.email]],
            dpi: [
                '',
                [
                    Validators.required,
                    Validators.minLength(13),
                    Validators.maxLength(13),
                ],
            ],
        });
    }

    private _initPasswordForm(): void {
        this.stepTwoForm = this._formbuilder.group(
            {
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(this._passwordRegex),
                    ],
                ],
                matchPassword: ['', [Validators.required]],
            },
            {
                validators: [this._matchPassword('password', 'matchPassword')],
            }
        );
    }

    private _matchPassword(
        passwordControl: string,
        passwordMatchControl: string
    ) {
        return (formGroup: FormGroup) => {
            const password = formGroup.controls[passwordControl];
            const passwordMatch = formGroup.controls[passwordMatchControl];

            if (passwordMatch.errors && !passwordMatch.errors.MustMatch) return;

            password.value != passwordMatch.value
                ? passwordMatch.setErrors({ mustMatch: true })
                : passwordMatch.setErrors(null);
        };
    }

    public onValidateEmail(): void {
        try {
            this.isLoading = true;

            if (this.stepOneForm.invalid)
                return Object.values(this.stepOneForm.controls).forEach((c) =>
                    c.markAsTouched()
                );

            this._service
                .validateUser(this.stepOneForm.value)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((exists: boolean) => {
                    if (exists) {
                        this._initPasswordForm();
                        return (this.showRecoverForm = true);
                    }

                    this._snackbar.open('No se ha encontrado el usuario.');
                });
        } catch (error) {
        } finally {
            this.isLoading = false;
        }
    }

    public onResetPassword(): void {
        try {
            this.isLoading = true;

            if (this.stepTwoForm.invalid)
                return Object.values(this.stepTwoForm.controls).forEach((c) =>
                    c.markAsTouched()
                );

            this._service
                .restorePassword({
                    ...this.stepOneForm.value,
                    ...this.stepTwoForm.value,
                })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((wasRestored: boolean) => {
                    let message: string = !wasRestored
                        ? 'Ha ocurrido un error al reiniciar la contraseña.'
                        : 'Contraseña restablecida correctamente.';

                    this._snackbar.open(message);
                    if (wasRestored) {
                        this._router.navigate(['auth/sign-in']);
                    }
                });
        } catch (error) {
        } finally {
            this.isLoading = false;
        }
    }
}
