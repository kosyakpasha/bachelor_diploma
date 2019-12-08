import {notificationView} from './_notification-view';
import {notificationModel} from './_notification-model';
import {eventBus} from '../../eventBus';


class NotificationController {
  constructor(notificationView, notificationModel, eventBus) {
    this.notificationView = notificationView;
    this.eventBus = eventBus;
    this.init();
  }

  init() {
    this.notificationHandler = this.outNotification.bind(this);
    eventBus.subscribe("callNotificationPage", this.notificationHandler);
  }

  outNotification() {
    this.notificationView.render();
  }
}

let notificationController = new NotificationController(notificationView);