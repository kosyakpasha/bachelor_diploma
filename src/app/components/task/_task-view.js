const taskTeplate = require('./_task.hbs');
const doneTaskTeplate = require('./_tasks-done.hbs');
const dragToTheTop = require('./_drag-to-the-top.hbs');
const stayProductive = require('./_stay-productive-container.hbs');
import jQuery from 'jquery';
import customTooltip from '../plugins/customTooltip';
import {eventBus} from '../../eventBus';
import handelbarsHelper from '../handlebars-helpers/task-list-helpers';
import {dataService} from '../data-service/data-service';
import AbstractView from '../../abstract/AbstractView';
import {myFirebase} from '../communication/communication';

class TaskView extends AbstractView {
  constructor() {
    super();
    this.init();
  }

  init() {
    eventBus.subscribe('callSelectDeletedTasks', () => this.deleteSelectedTasks());
  }

  render(data) {
    const singleElem = document.querySelector('.task-list--global');

    if (singleElem) {
      return;
    }

    if (!data) {
      return;
    }

    const container = document.querySelector('.tabs-controls');
    const taskListDailyBlockCollection = document.querySelectorAll('div.task-list.task-list--daily .task-simple-template__img-add-tomato');

    if (!container) return;
    if (taskListDailyBlockCollection.length !== 1) {
      container.insertAdjacentHTML('afterend', taskTeplate(data));
    }
    

    const tasksDaily = document.querySelectorAll('.task-list-tabs__task-list.task-list--daily .task');
    const tasksDailyDone = document.querySelectorAll('.task-list--completed .task');
    const tasksGlobal = document.querySelectorAll('.task-list--global .task');
    const tasksDailyContainer = document.querySelector('.task-list-tabs__task-list.task-list--daily');
    const tasksGlobalContainer = document.querySelector('.task-list--global');
    const isTaskListPage = location.href.match(/task-list/);

    this.lightCurrentNavItem(isTaskListPage, '.icon-list', '.header__settings-list-bar', 'settings-list-bar__icon--active');

    if (tasksDaily.length === 0 && tasksDailyDone.length >= 1 && tasksGlobal.length >= 0) {
      tasksDailyContainer.insertAdjacentHTML('afterend', doneTaskTeplate());
    }

    if (tasksDaily.length === 0 && tasksDailyDone.length === 0 && tasksGlobal.length >= 1) {
      tasksDailyContainer.insertAdjacentHTML('afterend', dragToTheTop());
    }

    if (tasksDaily.length === 0 && tasksDailyDone.length === 0 && tasksGlobal.length === 0) {
      if (tasksGlobalContainer) tasksGlobalContainer.remove();
      if (taskListDailyBlockCollection.length === 1) return;

      tasksDailyContainer.insertAdjacentHTML('afterend', stayProductive());
    }

    eventBus.post('callRenderTrashIcon');
    eventBus.post('callCloseOpenGlobalList');
    eventBus.post('callSelectPriority');
    eventBus.post('callSelectToDoDone');

    jQuery('.container').customTooltip();
  }

  clearEmptyList() {
    const lists = document.querySelectorAll('.task-list-tabs__task-list');
    const emptySpace = 7;

    lists.forEach((item) => {
      if (item.innerHTML.length == emptySpace) {
        item.remove();
      }
    });
  }

  replaceToDaily() {
    const container = document.querySelector('.task-list-tabs');

    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('icon-arrows-up')) {
        let taskId = target.closest('.task').getAttribute("data-id");
        eventBus.post('callTaskId', taskId);
      }
    });
  }

  openTimer() {
    const container = document.querySelector('.task-list-tabs');
    
    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('icon-timer')) {
        const taskId = target.closest('.task').getAttribute("data-id");
        const currentTaskBlock = target.closest('.task');
        const currentTitle = currentTaskBlock.querySelector('.task__title').innerHTML.trim();
        const currentDesc = currentTaskBlock.querySelector('.task__desc').innerHTML.trim();
        const dataForTimer = {
          title: currentTitle,
          desc: currentDesc,
        };

        myFirebase.getSettings();
        history.pushState(null, null, '/timer');
        eventBus.post('callTaskInfoForTimer', dataForTimer);
        eventBus.post('callTaskIdForTimer', taskId);
        eventBus.post('callTimerPage');
        eventBus.post('callTimerPageModel', taskId);
      }
    });
  }

  editTask() {
    const container = document.querySelector('.task-list-tabs');
    
    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('icon-edit')) {
        let taskId = target.closest('.task').getAttribute('data-id');

        eventBus.post('callPopupPage', { edit: true });
        eventBus.post('callEditTaskId', taskId);
        eventBus.post('callGetId', taskId);
      }
    });
  }

  deleteSelectedTasks() {
    const container = document.querySelector('.task-list-tabs');
    
    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('task__date-icon-trash')) {
        target.closest('li').classList.remove('task--delete-cancel-trash');
        target.closest('li').classList.add('task--delete-cancel-close');
        eventBus.post('callRenderTrashIcon');
      }

      if (target.classList.contains('task__date-icon-close')) {
        target.closest('li').classList.remove('task--delete-cancel-close');
        target.closest('li').classList.add('task--delete-cancel-trash');
        eventBus.post('callRenderTrashIcon');
      }
    });
  }

  selectDeselect() {
    const iconNum = document.querySelector('.task--delete-cancel');

    if (iconNum) {
      const container = document.querySelector('.task-list-tabs');
      const globalContainer = container.querySelector('.task-list--global');
      const dailyContainer = container.querySelector('.task-list--daily');
      const globalTaskDeleteCancelTrash = globalContainer.querySelectorAll('.task--delete-cancel-trash');
      const dailyTaskDeleteCancelTrash = dailyContainer.querySelectorAll('.task--delete-cancel-trash');
      const globalSelectDeselect = globalContainer.querySelector('.tabs-controls--global');
      const dailySelectDeselect = dailyContainer.querySelector('.tabs-controls--daily');
      const allGlobalTasks = container.querySelectorAll('.task-list--global .task');
      const allDailyTasks = container.querySelectorAll('.task-list--daily .task');

      if (globalTaskDeleteCancelTrash.length != allGlobalTasks.length) {
        globalSelectDeselect.classList.remove('tabs-controls--global-hidden');
      } else {
        globalSelectDeselect.classList.add('tabs-controls--global-hidden');
      }

      if (dailyTaskDeleteCancelTrash.length != allDailyTasks.length) {
        dailySelectDeselect.classList.remove('tabs-controls--daily-hidden');
      } else {
        dailySelectDeselect.classList.add('tabs-controls--daily-hidden');
      }
      
      if (!container) return;

      container.addEventListener('click', (e) => {
        let target = e.target;

        if (target.classList.contains('tabs-controls__item-daily-select')) {
          dailyTaskDeleteCancelTrash.forEach((elem) => {
            elem.classList.remove('task--delete-cancel-trash');
            elem.classList.add('task--delete-cancel-close');
          });
          eventBus.post('callTrashNumUpdate');
        }
        if (target.classList.contains('tabs-controls__item-daily-deselect')) {
          dailyTaskDeleteCancelTrash.forEach((elem) => {
            elem.classList.remove('task--delete-cancel-close');
            elem.classList.add('task--delete-cancel-trash');
          });
          eventBus.post('callTrashNumUpdate');
        }
        if (target.classList.contains('tabs-controls__item-global-select')) {
          globalTaskDeleteCancelTrash.forEach((elem) => {
            elem.classList.remove('task--delete-cancel-trash');
            elem.classList.add('task--delete-cancel-close');
          });
          eventBus.post('callTrashNumUpdate');
        }
        if (target.classList.contains('tabs-controls__item-global-deselect')) {
          globalTaskDeleteCancelTrash.forEach((elem) => {
            elem.classList.remove('task--delete-cancel-close');
            elem.classList.add('task--delete-cancel-trash');
          });
          eventBus.post('callTrashNumUpdate');
        }
      });
    }
  }

  closeOpenGlobalList() {
    const container = document.querySelector('.task-list-tabs');
    
    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('global-list__button')) {
        target.classList.toggle('global-list__button--close');
      }
    });
  }

  selectPriority() {
    this.lightNavItem('tabs-controls--priority', 'tabs-controls__item', 'tabs-controls__item--active');
    const container = document.querySelector('.tabs-controls--priority');

    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;
      let visibleItems = document.querySelectorAll(`.task-list--global .task[data-priority="${target.innerHTML.replace(/\s/g, '').toLowerCase()}"]`);
      let allItems = document.querySelectorAll(`.task-list--global .task`);
      
      allItems.forEach(element => {
        element.classList.remove('task-visible')
        element.classList.add('task-hidden');
      });

      if(visibleItems) {
        visibleItems.forEach(element => {
          element.classList.add('task-visible');
        });
      }

      if (target.innerHTML.replace(/\s/g, '') == 'All') {
        allItems.forEach(element => {
          element.classList.remove('task-hidden');
          element.classList.add('task-visible');
        });
      }

      const nonLabedTask = document.querySelectorAll('.task-list .task-visible');
      const labedTask = document.querySelector('.task-list .task-visible');

      if (labedTask) labedTask.classList.add('task-add-label');

      for (let i = 1; i < nonLabedTask.length; i++) {
        nonLabedTask[i].classList.add('task-remove-label')
      }

      let listsOfTasks = document.querySelectorAll('.task-list-tabs__task-list.task-list--global');

      listsOfTasks.forEach((el) => {
        function isAllEmpty(elem) {
          return !elem.classList.contains('task-visible');
        }
        let listsOfTasksArr = [...el.children];

        if (listsOfTasksArr.every(isAllEmpty)) {
          el.classList.add('task-list--hidden');
        } else {
          el.classList.remove('task-list--hidden');
        }
      });
    });
  }

  selectToDoDone() {
    this.lightNavItem('tabs-controls--todo-done', 'tabs-controls__item', 'tabs-controls__item--active');

    const container = document.querySelector('.tabs-controls--todo-done');
    
    if (!container) return;

    container.addEventListener('click', (e) => {
      let target = e.target;
      
      if (target.classList.contains('tabs-controls__item-done')) {
        const completedList = document.querySelector('.task-list--daily-wrapper');
        const toDoList = document.querySelector('.task-list--comleted-wrapper');
      
        toDoList.classList.remove('task-list--hidden');
        completedList.classList.add('task-list--hidden');
      }

      if (target.classList.contains('tabs-controls__item-todo')) {
        const completedList = document.querySelector('.task-list--daily-wrapper');
        const toDoList = document.querySelector('.task-list--comleted-wrapper');

        toDoList.classList.add('task-list--hidden');
        completedList.classList.remove('task-list--hidden');
      }
    });
  }
}

const taskView = new TaskView();

export {taskView};
