import { timerView } from './_timer-view';
import { timerModel } from './_timer-model';
import { eventBus } from '../../eventBus';


class TimerController {
  constructor() {
    this.init();
  }

  init() {
    timerModel.getSettings();
    eventBus.subscribe('callTimerPageModel', (taskId) => {
      this.data = timerModel.getData(taskId);
    });
    eventBus.subscribe('callTimerPage', () => { 
      timerView.render(this.data);
      timerView.colorRing(this.data);
    });
    eventBus.subscribe('changeCompleteDate', (taskId) => {
      timerModel.setCompleteDate(taskId);
    });
  }
}

const timerController = new TimerController();