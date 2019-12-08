import { eventBus } from "../../eventBus";
import { dataService } from '../data-service/data-service';
import {myFirebase} from '../communication/communication';

class TimerModel {
  constructor() {
    this.init();
    this.dailyStatus = {
      ACTIVE: false,
      COMPLETED: false,
      DAILY_LIST: true,
      GLOBAL_LIST: false,
    };
    this.completedStatus = {
      ACTIVE: false,
      COMPLETED: true,
      DAILY_LIST: false,
      GLOBAL_LIST: false,
    };
  }

  init() {
    this.getSettings();
    eventBus.subscribe('getDataForTimer', (data) => { this.data = data; });
    eventBus.subscribe('callTaskInfoForTimer', (taskInfoForTimer) => { this.taskInfoForTimer = taskInfoForTimer; });
    eventBus.subscribe('callGetSettings', (settings) => { this.settings = settings; });
    eventBus.subscribe('callCompletedTask', (taskId) => { this.updateStatus(taskId, this.completedStatus, 'timer'); });
    eventBus.subscribe('callTaskIdFromTimer', (taskId) => { this.updateStatus(taskId, this.dailyStatus); });
    eventBus.subscribe('callUpdatePomodoroCounts', (pomodoroCountsData) => {
      this.updatePomodoroCounts(pomodoroCountsData.taskId, pomodoroCountsData.completedCount, pomodoroCountsData.failedPomodoros, pomodoroCountsData.newEstimation);
    });
  }

  updatePomodoroCounts(taskId, completedCount, failedPomodoros, newEstimation) {
    dataService.updatePomodoroCounts(taskId, completedCount, failedPomodoros, newEstimation);
  }

  updateStatus(taskId, newStatus, renderPage) {
    dataService.updateStatus(taskId, newStatus, renderPage);
  }

  setCompleteDate(taskId) {
    dataService.setCompleteDate(taskId);
  }

  getData(taskId) {
    const activeTask = this.data.filter((task) => {
      return task.id === taskId;
    });

    const timerInfo = Object.assign(activeTask[0], this.taskInfoForTimer, this.settings);

    return timerInfo;
  }

  getSettings() {
    myFirebase.getSettings();
  }
}

const timerModel = new TimerModel();

export { timerModel };