import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../payment.service';
import { SnackBarService, transformDate } from 'app/utils';
import { UserService as SessionService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { IPayment, IService } from 'app/interfaces';
import { ServicesService } from 'app/modules/admin/services/services.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class PaymentDialog implements OnInit {
    public user: User;

    public form: FormGroup;
    public isNew: boolean = true;
    private _unsubscribeAll: Subject<any>;
    public months: { description: string; value: number }[];

    public showImage: boolean = false;
    public noImageChanged: boolean;
    public base64Image: string | undefined;
    public invalidExtention: boolean = false;
    public invalidSize: boolean = false;

    public homeAddress: string;
    public amounts: { description: string; value: number }[];

    public services: Array<IService>;
    public services$: Observable<Array<IService>>;

    public selectedService: IService;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _fb: FormBuilder,
        private readonly _session: SessionService,
        private readonly _service: PaymentService,
        private readonly _snackbar: SnackBarService,
        private readonly _services: ServicesService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _dialogRef: MatDialogRef<PaymentDialog>
    ) {
        this.months = [];
        this.amounts = [];
        this.services = [];
        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this._onGetSession();
        this.getMoths();
        this.getAmounts();
        this._getServices();
        this.initForm();

        if (this.data?.payment) this.setForm(this.data.payment);
    }

    public initForm() {
        this.isNew = true;
        this.form = this._fb.group({
            userId: [this.user?.id, [Validators.required]],
            amount: ['', [Validators.required]],
            month: ['', [Validators.required]],
            description: ['', [Validators.required]],
            payedAt: [''],
            email: [this.user?.email],
            serviceId: ['', [Validators.required]],
        });
    }

    private _onGetSession() {
        this._session.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
    }

    private setForm(payment: IPayment) {
        this.isNew = false;
        this.noImageChanged = true;

        this.form.patchValue({
            id: payment.id,
            amount: payment.amount,
            userId: payment?.userId,
            month: parseInt(payment.month),
            description: payment.description,
            payedAt: this.convertDate(payment.payedAt),
        });

        if (payment?.photo) {
            this.base64Image = payment?.photo;
        }
    }

    private _getServices(): void {
        this._services
            .findServices({ page: 1, pageSize: 100 })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.services = res?.services;
            });

        this.services$ = this._services.services$;
    }

    public registerPayment() {
        if (this.form.invalid)
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service.createPayment(this.form.value).subscribe((res) => {
            if (res == 403) {
                const month = this.months.find(
                    (m) => m.value == this.form.controls.month?.value
                ).description;
                return this._snackbar.open(
                    `Ya existe un pago registrado para el mes de ${month}.`
                );
            }

            if (res == 200) {
                this.onClose(true);
                return this._snackbar.open(
                    'Se ha registrado el pago exitósamente.'
                );
            }

            return this._snackbar.open(
                'Ha ocurrido un error al registrar el pago.'
            );
        });
    }

    public onFileSelected(event: any): void {
        if (event.target.files && event.target.files[0]) {
            // Size Filter Bytes
            const max_size = 2000000;
            const allowed_types = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
            ];

            if (event.target.files[0].size > max_size) {
                this.invalidSize = true;
                return;
            }

            if (!allowed_types.includes(event.target.files[0].type)) {
                this.invalidExtention = true;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.invalidSize = false;
                this.invalidExtention = false;
                this.base64Image = e.target.result;
                this.form.addControl(
                    'photo',
                    this._fb.control(this.base64Image)
                );
                this.noImageChanged = false;
                this._changeDetectorRef.markForCheck();
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    public convertDate(date: string): string {
        return transformDate(date);
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    public onlyPositiveNumbers(event: any) {
        const inputValue = event.target.value + event.key;
        if (isNaN(inputValue) || Number(inputValue) <= 0) {
            event.preventDefault();
        }
    }

    public getMoths() {
        this.months = this._service.getMonths();
    }

    public getAmounts() {
        this.amounts = this._service.getAmounts();
    }

    public onClose(wasSuccess: boolean = false) {
        this._dialogRef.close(wasSuccess);
    }

    public onOptionSelection($event: MatSelectChange) {
        const selectedService = this.services.find((s) => s.id == $event.value);
        if (selectedService)
            this.form.patchValue({ amount: selectedService.Price });
    }
}
