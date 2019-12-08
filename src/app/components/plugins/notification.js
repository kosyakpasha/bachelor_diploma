import $ from 'jquery';

$.fn.notification = (type, text, showTime) => {
  const notificationTemplate =    `
    <div class="notification notification--${type}">
      <span class="notification__icon icon-tomato-success"></span>
      <div class="notification__content">
        <p class="notification__text">
          ${text}
        </p>
        <button class="notification__button">
          <span class="notification__icon icon-close"></span>
        </button>
      </div>
    </div>
  `;
  const showTimeMs = showTime * 1000;

  $('.container').append( notificationTemplate );

  setTimeout(() => { 
    $('.notification').fadeOut('slow', () => { $('.notification').remove(); });
   }, showTimeMs);

   $('.notification__icon.icon-close').on( "click", () => {
    $('.notification').fadeOut('slow', () => { $('.notification').remove(); });
   });
}
