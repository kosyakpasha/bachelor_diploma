import {dataService} from '../data-service/data-service';

class TaskListModel {
  constructor(dataService) {
    this.dataService = dataService;
  }
}

const taskListModel = new TaskListModel(dataService);

export {taskListModel};