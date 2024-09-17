import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { WageService } from '../wage.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IWage } from 'app/interfaces';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SnackBarService, transformDate } from 'app/utils';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'wage-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
    @ViewChild(MatSort) public _sort: MatSort;
    @ViewChild(MatPaginator) public _paginator: MatPaginator;

    public loading: boolean;
    public wages: IWage[] = [];
    public wages$: Observable<IWage[]>;

    public page: number = 1;
    public count: number = 0;
    public pages: number = 0;
    public pageSize: number = 10;
    public pageSizeOptions: number[] = [10, 15, 25];

    private _unsubscribeAll: Subject<any>;

    constructor(
        private readonly _wage: WageService,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _snackbar: SnackBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._onGetWages();
        this._onListenDialog();
    }

    public convertDate(date: string): string {
        return transformDate(date);
    }

    private _onGetWages(page: number = 1, pageSize: number = 10) {
        try {
            this.loading = true;
            this._wage
                .findWages({ page, pageSize })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res) => {
                    this.loading = false;
                    this.page = res.page;
                    this.count = res.total;
                    this.pages = res.pages;
                    this.wages = res.wages;
                    this._cdr.markForCheck();
                });

            this.wages$ = this._wage.wages$;
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    }

    public payWage(id: number) {
        this._wage
            .updateState({ id, status: 2 })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                const message: string =
                    res === 200
                        ? 'Se ha actualizado el estado del jornal exitósamente.'
                        : 'Ha ocurrido un error al marcar como pagado el jornal.';

                this._snackbar.open(message);
                if (res === 200) this._onGetWages();
            });
    }

    public removeWage(id: number) {
        this._wage
            .delete(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                const message: string =
                    res === 200
                        ? 'Se ha eliminado jornal exitósamente.'
                        : 'Ha ocurrido un error al eliminar el jornal.';

                this._snackbar.open(message);
                if (res === 200) this._onGetWages();
            });
    }

    private _onListenDialog() {
        this._wage.dialogStatus
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => this._onGetWages(this.page, this.pageSize));
    }
}
