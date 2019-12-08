export default class AbstractView {
  constructor() {
    if (this.constructor === AbstractView) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // by click
  lightNavItem(containerClass, itemClass, activeClass) {
    const container = document.querySelector(`.${containerClass}`);

    if (container === null) {
      return;
    }

    container.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains(`${itemClass}`)) {
        const active = container.querySelector(`.${activeClass}`);

        if (active) active.classList.remove(`${activeClass}`);
        target.classList.add(`${activeClass}`);
      }
    });
  }


  // by load page
  lightCurrentNavItem(isCorrectPage, newActiveIconClass, containerClass, activeClass) {
    if (isCorrectPage) {
      const container = document.querySelector(containerClass);
      const oldActiveIcon = container.querySelector(`.${activeClass}`);
      const newActiveIcon = container.querySelector(newActiveIconClass);
      
      if (!oldActiveIcon) return;
      oldActiveIcon.classList.remove(activeClass);
      newActiveIcon.classList.add(activeClass);
    }
  }
}
