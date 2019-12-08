const notificationTeplate = require('./_notification.hbs');

class NotificationView {
  constructor(template) {
    this.template = template;
  }

  render() {
    const container = document.querySelector('.main__container');
    container.insertAdjacentHTML('afterbegin', this.template());
  }
}

const notificationView = new NotificationView(notificationTeplate);

export {notificationView};
