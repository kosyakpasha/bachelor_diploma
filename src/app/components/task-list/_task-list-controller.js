import {taskListView} from './_task-list-view';
import {taskListModel} from './_task-list-model';
import {eventBus} from '../../eventBus';


class TaskListController {
  constructor(taskListView, taskListrModel) {
    this.taskListView = taskListView;
    this.taskListrModel = taskListrModel;
    this.init();
  }

  init() {
    eventBus.subscribe('callTaskListPage', this.outTaskList.bind(this));
  }

  outTaskList() {
   if(this.taskListrModel.dataService.getFirstVisitResult() === true) {
      this.taskListView.renderFirstTimePageTeplate();
      this.taskListView.renderAddFirstTask();
    } else {
      this.taskListView.render();
    }
  }
}

const taskListController = new TaskListController(taskListView, taskListModel);
export {taskListController};

