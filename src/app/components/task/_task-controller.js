import { taskView } from './_task-view';
import { taskModel } from './_task-model';
import { eventBus } from '../../eventBus';
import { dataService } from '../data-service/data-service';

class TaskController {
  constructor() {
    this.init();
  }

  init() {
    if (location.href.match(/task-list/)) {
      eventBus.subscribe('callRenderTaskListPage', taskView.render.bind(this));
    }

    eventBus.subscribe('callDailyTaskRender', taskView.render.bind(this));
    eventBus.subscribe('callTaskListPage', taskView.render.bind(this));
    eventBus.subscribe('callTaskRender', data => taskView.render(data));

    eventBus.subscribe('callEditTaskPopup', () => taskView.editTask());
    eventBus.subscribe('callClearEmptyList', () => taskView.clearEmptyList());
    eventBus.subscribe('callReplaceToDaily', () => taskView.replaceToDaily());
    eventBus.subscribe('callOpenTimer', () => taskView.openTimer());
    eventBus.subscribe('callPopupData', this.outTask.bind(this));

    eventBus.subscribe('GetData.taskList', data => taskModel.getTask(data));
    eventBus.subscribe('callDeleteTaskFromPopup', taskId => this.deleteTaskFromPopup(taskId));
    eventBus.subscribe('callEditTaskId', taskId => this.getDataForEditTask(taskId));
    eventBus.subscribe('GetData.taskList', data => this.getData(data));
    eventBus.subscribe('callSelectDeselect', () => taskView.selectDeselect());
    eventBus.subscribe('callCloseOpenGlobalList', () => taskView.closeOpenGlobalList());
    eventBus.subscribe('callSelectPriority', () => taskView.selectPriority());
    eventBus.subscribe('callSelectToDoDone', () => taskView.selectToDoDone());

    eventBus.subscribe('GetData.taskList', (taskId) => {
      eventBus.post('getDataForTimer', taskId);
    });
  }

  outTask(dataPopup) {
    taskModel.setTask(dataPopup);
    taskModel.getTask();
  }

  deleteTaskFromPopup(taskId) {
    dataService.removeDataItem(taskId);
  }

  getData(data) {
    this.data = data;
  }

  getDataForEditTask(taskId) {

    const currentTask = this.data.find((elem) => {
      return elem.id === taskId
    });

    const currentTaskNonEditableData = {
      taskId: taskId,
      currentCreateDate: currentTask.createDate,
      currentStatus: currentTask.status,
      currentTitle: currentTask.title,
      currentDesc: currentTask.description,
      currentCategory: currentTask.categoryId,
      currentPriority: currentTask.priority,
      currentDeadlineDate: currentTask.deadlineDate,
      currentEstimation: currentTask.estimation,
    }

    eventBus.post('callEditTask', currentTaskNonEditableData);
  }
}

const taskController = new TaskController();
