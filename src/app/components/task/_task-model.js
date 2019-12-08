import { eventBus } from '../../eventBus';
import { dataService } from '../data-service/data-service';

class TaskModel {
  constructor() {
    this.taskData = [];
    this.init();
    this.dailyStatus = {
      ACTIVE: false,
      COMPLETED: false,
      DAILY_LIST: true,
      GLOBAL_LIST: false,
    };
    this.activeStatus = {
      ACTIVE: true,
      COMPLETED: false,
      DAILY_LIST: false,
      GLOBAL_LIST: false,
    };
  }

  init() {
    eventBus.subscribe('callTaskId', (taskId) => this.updateStatus(taskId, this.dailyStatus, 'task-list'));
    eventBus.subscribe('callTaskIdForTimer', (taskId) => this.updateStatus(taskId, this.activeStatus));
  }

  setTask(dataPopup) {
    dataService.setFirebaseData(dataPopup);
  }

  updateStatus(taskId, newStatus, renderPage) {
    dataService.updateStatus(taskId, newStatus, renderPage);
  }

  removeTask(taskId) {
    dataService.removeDataItem(taskId);
  }

  getTask(data) {
    if (data != undefined) {
      let work = [];
      let education = [];
      let hobby = [];
      let sport = [];
      let other = [];
      let completed = [];
      let daily = [];
      let global = [];
      let active = [];


      data.forEach((item) => {
        if (item.status.COMPLETED == true) {
          completed.push(item);
        } else if (item.status.GLOBAL_LIST !== true) {
          daily.push(item);
        } else if (item.categoryId === 'work') {
          work.push(item);
        } else if (item.categoryId === 'education') {
          education.push(item);
        } else if (item.categoryId === 'hobby') {
          hobby.push(item);
        } else if (item.categoryId === 'sport') {
          sport.push(item);
        } else if (item.categoryId === 'other') {
          other.push(item);
        }
      });
      
      global = [work, education, hobby, sport, other];

      const dataObj = {
        completed: completed,
        daily: daily,
        global: global,
        active: active
      }

      if (location.href.match(/task-list/)) {
        eventBus.post('callTaskRender', dataObj);
        eventBus.post('callClearEmptyList');
        eventBus.post('callReplaceToDaily');
        eventBus.post('callEditTaskPopup');
        eventBus.post('callOpenTimer');
      }
      
      eventBus.post('callGetUpdatedData', data);

    }
  }
}

const taskModel = new TaskModel();

export {taskModel};