import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService as SessionService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { fuseAnimations } from '@fuse/animations';
import { SuggestionService } from './suggestion.service';
import { SnackBarService } from 'app/utils';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IReport } from 'app/interfaces';

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SuggestionComponent implements OnInit {
    public isNew: boolean;
    public form: FormGroup;
    public user: User;

    private _unsubscribeAll: Subject<any>;

    public showImage: boolean;
    public invalidSize: boolean;
    public noImageChanged: boolean;
    public invalidExtention: boolean;
    public base64Image: string | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: IReport,
        private readonly _fb: FormBuilder,
        private readonly _session: SessionService,
        private readonly _snackbar: SnackBarService,
        private readonly _service: SuggestionService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.isNew = true;
        this.showImage = false;
        this.invalidSize = false;
        this.invalidExtention = false;
        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this._initForm();
        this.onGetSession();

        if (this.data) this.setForm(this.data);
    }

    private _initForm() {
        this.isNew = true;
        this.form = this._fb.group({
            user: [],
            description: ['', [Validators.required]],
            incidentName: ['', [Validators.required]],
        });
    }

    private setForm(report: IReport) {
        this.isNew = false;
        this.noImageChanged = true;

        this.form.patchValue({
            id: report.id,
            user: report.user,
            incidentName: report.incidentName,
            description: report.description,
        });

        if (report?.incidentEvidence) {
            this.base64Image = report?.incidentEvidence;
        }
    }

    private onGetSession() {
        this._session.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
    }

    public createReport() {
        if (this.form.invalid || this.invalidExtention || this.invalidSize)
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );

        const { description, incidentName, incidentEvidence } =
            this.form.getRawValue();

        const report: IReport = {
            user: this.user.email,
            description: description,
            incidentName: incidentName,
            incidentEvidence: incidentEvidence,
        };

        this._service
            .createReport(report)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.onClose();

                if (res == 200) {
                    return this._snackbar.open(
                        'El reporte se ha registrado exitósamente.'
                    );
                }

                return this._snackbar.open(
                    'Ha ocurrido un error al registrar el reporte.'
                );
            });
    }

    public onFileSelected(event: any): void {
        if (event.target.files && event.target.files[0]) {
            // Size Filter Bytes
            const max_size = 2000000;
            const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];

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
                    'incidentEvidence',
                    this._fb.control(this.base64Image)
                );
                this.noImageChanged = false;
                this._changeDetectorRef.markForCheck();
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    public onClose(): void {
        return this._service.onCloseDialog();
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
}
