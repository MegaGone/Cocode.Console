import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../user.service';
import { ReplaySubject, takeUntil, Observable, merge, switchMap, map } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'app/interfaces';
import { SnackBarService, translateRole } from 'app/utils';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialog/dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

  private _unsubscribeAll: ReplaySubject<number> = new ReplaySubject(1);

  @ViewChild(MatPaginator) public _paginator: MatPaginator;
  @ViewChild(MatSort) public _sort: MatSort;

  public users$: Observable<User[]>;
  public users: User[] = [];
  public flashMessage: 'success' | 'error' | null = null;
  public loading: boolean;
  public diameter: number = 100;

  // MAT PAGINATOR
  public pageSize: number = 10;
  public page: number = 1;
  public count: number = 0;
  public pages: number = 0;
  public pageSizeOptions: number[] = [10, 15, 25];

  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public _fuseConfirmationService: FuseConfirmationService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.onListenDialog();
  }

  getUsers() {
    this.loading = true;
    this._userService.getUsers({ roleId: 0, page: 1, pageSize: this.pageSize }).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.users$ = this._userService.users$;
      this.users = res.users;
      this.page = res.page;
      this.count = res.total;
      this.pages = res.pages;

      this.loading = false
      this._changeDetectorRef.markForCheck();
    });
  }

  openDialog(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { user }
    });

    dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
      this.getUsers();
    });
  }

  onListenDialog() {
    this._userService.onFoo.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.getUsers()
    })
  }

  deleteUser(userId: number) {

    const confirmation = this._fuseConfirmationService.open({
      title: 'Eliminar usuario',
      message: '¿Está seguro de eliminar el usuario?',
      actions: {
        confirm: {
          label: 'Eliminar'
        },
        cancel: {
          label: 'Cancelar'
        }
      }
    });

    confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {

      if (res === 'confirmed') {
        this._userService.deleteUser(userId).pipe(takeUntil(this._unsubscribeAll)).subscribe((code) => {

          if (code == 201) {
            this.getUsers();
            return this._snackBarService.open('El usuario se ha eliminado.');
          }

          return this._snackBarService.open('Ha ocurrido en error al eliminar el usuario.');
        });  
      }

    });
  }

  translateRole(role: number): string {
    return translateRole(role);
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      this._sort.sort({
        id: 'DisplayName',
        start: 'asc',
        disableClear: true
      });

      this._changeDetectorRef.markForCheck();

      merge(this._sort.sortChange, this._paginator.page).pipe(
        switchMap(() => {
          this.loading = true;
          this.pageSize = this._paginator.pageSize

          return this._userService.getUsers({ roleId: 0, page: this._paginator.pageIndex + 1, pageSize: this._paginator.pageSize });
        }),
        map(() => this.loading = false)
      ).pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }
}
