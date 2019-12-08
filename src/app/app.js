import 'babel-polyfill';
import { eventBus } from './eventBus';

/* root component starts here */
export * from 'assets/less/main.less'; 

/* header component */
export * from './components/header';

/* setting component */
export * from './components/settings';

/* report component */
export * from './components/report';

/* timer component */
export * from './components/timer';

/* task list component */
export * from './components/task-list';

/* popup component */
export * from './components/popup';

/* notification component */
export * from './components/notification';

/* task component */
export * from './components/task';

/* router component */
import { router } from './router';


class MainController {
  constructor() {
    this.init();
  }

  init() {
    this.tooltipFix();

    // configuration
    router.config({ mode: 'history'});
    
    eventBus.post('callHeaderPage');

    // adding routes
    router
      .add(/report/, function() {
        eventBus.post('callReportPage');
      })
      .add(/settings/, function() {
        eventBus.post('callSettingPage');
      })
      .add(/task-list/, function() {
        eventBus.post('callGetData');
        eventBus.post('callTaskListPage');
      })
      .add(/timer/, function() {
        eventBus.post('callTimerPage');
      })
      .add(function() {
        eventBus.post('callGetData');
        history.pushState(null, null, '/task-list');
        eventBus.post('callTaskListPage');
      })
      .check().listen();
  }

  tooltipFix() {
    document.addEventListener('click', () => {
      const tooltip = document.querySelector('.ui-tooltip');

      if (tooltip) tooltip.remove();
    });
  }
}

const mainController = new MainController();