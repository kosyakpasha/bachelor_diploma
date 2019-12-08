const headerTeplate = require('./_header.hbs');
import jQuery from 'jquery';
import customTooltip from '../plugins/customTooltip';
import {eventBus} from '../../eventBus';
import AbstractView from '../../abstract/AbstractView';

class HeaderView extends AbstractView {
  constructor(template) {
    super();
    this.template = template;
    this.init();
  }

  init() {
    eventBus.subscribe('callRenderTrashIcon', () => this.renderTrashIcon());
  }

  render() {
    const container = document.querySelector('.header__settings-list-bar');
    const that = this;

    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.template());

    function debounce(func, wait, immediate) {
      let timeout;
      return () => {
        const context = this; 
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
  
    const myEfficientFn = debounce(() => {
      const header = document.querySelector('.header');
      const addBtn = document.querySelector('.settings-list-bar__item--add');
      const sticky = header.offsetTop;
  
      if (window.pageYOffset > sticky) {
        header.classList.add('header--fixed');
        addBtn.classList.remove('settings-list-bar__item--hidden');
      } else {
        header.classList.remove('header--fixed');
        addBtn.classList.add('settings-list-bar__item--hidden');
      }
    }, 50);

    window.addEventListener('scroll', myEfficientFn);
    
    container.addEventListener('click', (e) => {
      let trashIcon = document.querySelector('.settings-list-bar__item--trash');
      this.target = e.target;
      
      if (this.target.classList.contains('icon-settings')) {
        history.pushState(null, null, '/settings/pomodoros');
        trashIcon.classList.add('settings-list-bar__item--hidden');
      } else if (this.target.classList.contains('icon-statistics')) {
        history.pushState(null, null, '/reports/day/tasks');
        trashIcon.classList.add('settings-list-bar__item--hidden');
      } else if (this.target.classList.contains('icon-list')) {
        eventBus.post('callGetData');
        history.pushState(null, null, '/task-list');
        this.renderTrashIcon();
      } else if (this.target.classList.contains('icon-add')) {
        eventBus.post('callPopupPage', {add: true});
      } else if (this.target.classList.contains('icon__num')) {
        eventBus.post('callPopupPage', {remove: true});
        eventBus.post('callRemovePopupControls');
        const selectedTasksIdToRemove = [];
        const selectedElementsToRemove = document.querySelectorAll('.task--delete-cancel-close');

        selectedElementsToRemove.forEach((item) => {
          selectedTasksIdToRemove.push(item.getAttribute('data-id'));
        });
        eventBus.post('callSelectedTasksIdToRemove', selectedTasksIdToRemove);
      } else if (this.target.classList.contains('icon-trash')) {
        const tasks = document.querySelectorAll('.task');

        tasks.forEach((item) => {
          item.classList.toggle('task--delete-cancel');
          item.classList.toggle('task--delete-cancel-trash');
        })
        eventBus.post('callSelectDeletedTasks');
        that.renderTrashIcon();
      }
    });

    const isSettingPage = location.href.match(/settings/);
    const isTaskListPage = location.href.match(/task-list/);
    const isReportPage = location.href.match(/report/);
    
    this.lightCurrentNavItem(isSettingPage, '.icon-settings', '.header__settings-list-bar', 'settings-list-bar__icon--active');
    this.lightCurrentNavItem(isReportPage, '.icon-statistics', '.header__settings-list-bar', 'settings-list-bar__icon--active');
    this.lightCurrentNavItem(isTaskListPage, '.icon-list', '.header__settings-list-bar', 'settings-list-bar__icon--active');

    this.lightNavItem('header__settings-list-bar', 'settings-list-bar__icon', 'settings-list-bar__icon--active');

    jQuery('.container').customTooltip();
  }

  renderTrashIcon() {
    const tasks = document.querySelectorAll('.task');
    const trashIcon = document.querySelector('.settings-list-bar__item--trash');
    const trashIconNum = document.querySelector('.settings-list-bar__item--trash .icon');
    const taskTrashIcons = document.querySelectorAll('.task--delete-cancel-close');
    
    if (tasks.length === 0) {
      trashIcon.classList.add('settings-list-bar__item--hidden');
    } else {
      trashIcon.classList.remove('settings-list-bar__item--hidden');
    }

    if (taskTrashIcons.length > 0) {
      trashIconNum.classList.add('icon__num');
    } else if (taskTrashIcons.length === 0) {
      trashIconNum.classList.remove('icon__num');
    }

    trashIconNum.setAttribute('data-content', `${taskTrashIcons.length}`);

    eventBus.post('callSelectDeselect');
  }
}

const headerView = new HeaderView(headerTeplate);

export { headerView };
