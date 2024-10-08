import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import {
    INotification,
    Notification,
} from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications',
})
export class NotificationsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel')
    private _notificationsPanel: TemplateRef<any>;

    notifications: INotification[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to notification changes
        this.getNotifications();
        this.loadNotifications();
    }

    getNotifications() {
        this._userService.user$.subscribe((res) => {
            if (res && res?.role === 3) {
                this._notificationsService
                    .getAll(res.email)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe();
            }
        });
    }

    loadNotifications() {
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: INotification[]) => {
                // Load the notifications
                this.notifications = notifications;

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(
            new TemplatePortal(this._notificationsPanel, this._viewContainerRef)
        );
    }

    /**
     * Close the notifications panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        // this._notificationsService.markAllAsRead().subscribe();
    }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: INotification): void {
        this._notificationsService
            .updateNotification(notification.id)
            .subscribe((status) => {
                if (status !== 200) return;

                const index = this.notifications.findIndex(
                    (n) => n.id === notification.id
                );

                if (index !== -1) {
                    this.notifications[index].viewed =
                        !this.notifications[index].viewed;
                }

                this._calculateUnreadCount();
            });
    }

    translateNotificationType(type: number): string {
        return this._notificationsService.translateNotificationType(type);
    }

    /**
     * Delete the given notification
     */
    delete(notification: INotification): void {
        this._notificationsService
            .deleteNotification(notification.id)
            .subscribe((res) => {
                if (res !== 200) return;

                const index = this.notifications.findIndex(
                    (n) => n.id === notification.id
                );

                if (index !== -1) this.notifications.splice(index, 1);

                this._calculateUnreadCount();
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(
                    this._notificationsOrigin._elementRef.nativeElement
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.notifications && this.notifications.length) {
            count = this.notifications.filter(
                (notification) => !notification.viewed
            ).length;
        }

        this.unreadCount = count;
        this._changeDetectorRef.markForCheck();
        // this._changeDetectorRef.detectChanges();
    }
}
