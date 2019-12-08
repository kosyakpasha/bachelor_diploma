import jQuery from 'jquery';
import customTooltip from '../plugins/customTooltip';
import { eventBus } from '../../eventBus';
import AbstractView from '../../abstract/AbstractView';

const taskListTeplate = require('./_task-list.hbs');
const addYourFirstTaskTemplate = require('./_add-your-first-task.hbs');
const firstTimePageTeplate = require('./_first-time-page.hbs');

class TaskListView extends AbstractView {
  constructor(template, addYourFirstTaskTemplate, firstTimePageTeplate) {
    super();
    this.template = template;
    this.addYourFirstTaskTemplate = addYourFirstTaskTemplate;
    this.firstTimePageTeplate = firstTimePageTeplate;
    this.init();
  }

  init() {
    eventBus.subscribe('callRenderTaskListPage', this.render.bind(this));
  }

  render() {
    const container = document.querySelector('.main__container');

    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.template());
    this.callPopupPage();
    jQuery('.container').customTooltip();
  }

  renderAddFirstTask() {
    const container = document.querySelector('.main__container');
    const buttonBlock = document.querySelector('.setting-buttons'); 
    const renderAddFirstFunc = this.addYourFirstTaskTemplate.bind(this);

    buttonBlock.addEventListener("click", (e) => {
      this.target = e.target;

      if (this.target.classList.contains('setting-buttons__btn_skip')) {
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', renderAddFirstFunc());
      }
      if (this.target.classList.contains('setting-buttons__btn_go-to')) {
        history.pushState(null, null, '/settings/pomodoros');
        eventBus.post('callSettingPage');

        const isSettingPage = location.href.match(/settings/);
        
        this.lightCurrentNavItem(isSettingPage, '.icon-settings', '.header__settings-list-bar', 'settings-list-bar__icon--active');
      }
    });
  }

  renderFirstTimePageTeplate() {
    const container = document.querySelector('.main__container');

    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.firstTimePageTeplate());
  }

  callPopupPage() {
    const plusBtn = document.querySelector('.main__icon--add');

    plusBtn.addEventListener('click', () => {
      eventBus.post('callPopupPage', {add: true});
    });
  }
}

const taskListView = new TaskListView(taskListTeplate, addYourFirstTaskTemplate, firstTimePageTeplate);

export {taskListView};