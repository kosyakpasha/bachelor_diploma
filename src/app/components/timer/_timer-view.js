import jQuery from 'jquery';
import { eventBus } from '../../eventBus';
import handelbarsHelper from '../handlebars-helpers/timer-helpers';
import radialTimer from '../plugins/radialTimer';
import notification from '../plugins/notification';
import customTooltip from '../plugins/customTooltip';

const timerTeplate = require('./_timer.hbs');

class TimerView {
  render(data) {
    if (!data) {
      return;
    }

    this.taskId = data.id;
    this.workIteration = data.workIteration.value;

    const containerHeader = document.querySelector('.header__settings-list-bar');
    const activeIcon = containerHeader.querySelector('.settings-list-bar__icon--active');
    const container = document.querySelector('.main__container');
    const trashIcon = document.querySelector('.settings-list-bar__item--trash');

    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', timerTeplate(data));
    trashIcon.classList.add('settings-list-bar__item--hidden');

    if (activeIcon && location.href.match(/timer/)) {
      activeIcon.classList.remove('settings-list-bar__icon--active');
    }

    this.activeControls(data);

    jQuery('.container').customTooltip();
  }

  colorRing(data) {
    const timerRing = document.querySelector('.timer__info');

    if (!data) {
      return;
    }

    timerRing.classList.add(`timer__${data.categoryId}`);
  }

  activeControls(data) {
    const donutTemplate = `
      <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
        <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" stroke-width="3" stroke-dashoffset="25"></circle>
      </svg>`;
    const container = document.querySelector('.timer');
    const donutContainer = container.querySelector('.timer__info');
    const addIcon = container.querySelector('.timer__estimate-item--add');
    const arrowRight = container.querySelector('.icon-arrow-right');
    const arrowLeft = container.querySelector('.icon-arrow-left');
    const startBtn = container.querySelector('.setting-buttons__start');
    const failPomodorosBtn = container.querySelector('.setting-buttons__fail-pomodoros');
    const finishPomodorosBtn = container.querySelector('.setting-buttons__finish-pomodoros');
    const startPomodorosBtn = container.querySelector('.setting-buttons__start-pomodoros');
    const finishTaskBtn = container.querySelector('.setting-buttons__finish-task');
    const firstText = container.querySelector('.timer__first-text');
    const timeWork = container.querySelector('.timer__time-work');
    const timeBreak = container.querySelector('.timer__time-break');
    const timeBreakLong = container.querySelector('.timer__time-break-long');
    const breakIsOver = container.querySelector('.timer__last-text--break-is-over');
    const completedTask = container.querySelector('.timer__last-text--completed-task');
    const header = document.querySelector('.header');
    const donutSegment = container.querySelector('.donut-segment');
    const that = this;
    const leftArrowHandler = function () {
      const taskListIcon = document.querySelector('.icon-list');

      taskListIcon.classList.add('settings-list-bar__icon--active');
      eventBus.post('callGetData');
      history.pushState(null, null, '/task-list');
      eventBus.post('callTaskListPage');
    };
    const changeStatusToDailyBack = function () {
      eventBus.post('callTaskIdFromTimer', that.taskId);
    };

    arrowLeft.addEventListener('click', leftArrowHandler);
    arrowLeft.addEventListener('click', changeStatusToDailyBack);
    
    container.addEventListener('click', (e) => {
      let pomodoroCountsData = {};
      const target = e.target;
      var settingButtonsStartHandler = (isCallBack = false) => {

        if (isCallBack === true || target.classList.contains('setting-buttons__start')) {
          addIcon.classList.remove('timer--hidden');
          arrowLeft.classList.add('timer--hidden');
          startBtn.classList.add('timer--hidden');
          failPomodorosBtn.classList.remove('timer--hidden');
          finishPomodorosBtn.classList.remove('timer--hidden');
          firstText.classList.add('timer--hidden');
          timeWork.classList.remove('timer--hidden');
          header.classList.add('header--hidden');
          donutContainer.insertAdjacentHTML('afterBegin', donutTemplate);
          jQuery('.donut').radialTimer({ time: data.workTime.value }, settingButtonsFinishPomodorosHandler);
        }
      };
      var settingButtonsFailPomodorosHandler = (isCallBack = false) => {
        if (isCallBack === true || target.classList.contains('setting-buttons__fail-pomodoros')) {
          const donut = donutContainer.querySelector('.donut');
          const activeEstimate = container.querySelector('.active-estimate');
          const estimatePomodorosLength = container.querySelectorAll('.timer__estimate-pomodoro').length;
          const estimatePomodorosFinishedLength = container.querySelectorAll('.timer__estimate-pomodoro-finished').length;
          const estimatePomodorosFailedLength = container.querySelectorAll('.timer__estimate-pomodoro-failed').length;

          donut.remove();
          donutContainer.insertAdjacentHTML('afterBegin', donutTemplate);
          timeWork.classList.add('timer--hidden');
          timeBreak.classList.remove('timer--hidden');
          failPomodorosBtn.classList.add('timer--hidden');
          finishPomodorosBtn.classList.add('timer--hidden');
          startPomodorosBtn.classList.remove('timer--hidden');
          addIcon.classList.add('timer--hidden');
          activeEstimate.classList.remove('timer__estimate-pomodoro-finished');
          activeEstimate.classList.add('timer__estimate-pomodoro-failed');
          activeEstimate.classList.remove('active-estimate');
          activeEstimate.nextElementSibling.classList.add('active-estimate');
  
          if ((estimatePomodorosFailedLength + estimatePomodorosFinishedLength + 1) % this.workIteration === 0) {
            timeWork.classList.add('timer--hidden');
            timeBreak.classList.add('timer--hidden');
            timeBreakLong.classList.remove('timer--hidden');
            jQuery('.donut').radialTimer({ time: data.longBreak.value }, settingButtonsStartPomodorosHandler);
            jQuery('.container').notification('warning', 'Long break started, please have a rest!', 4);
            
          } else {
            timeBreak.classList.remove('timer--hidden');
            timeBreakLong.classList.add('timer--hidden');
            jQuery('.donut').radialTimer({ time: data.shortBreak.value }, settingButtonsStartPomodorosHandler);
          }

          if (estimatePomodorosLength === estimatePomodorosFailedLength + estimatePomodorosFinishedLength + 1) {
            timeBreakLong.classList.add('timer--hidden');
            timeWork.classList.add('timer--hidden');
            timeBreak.classList.add('timer--hidden');
            completedTask.classList.remove('timer--hidden');
            arrowRight.classList.remove('timer--hidden');
            arrowLeft.classList.remove('timer--hidden');
            finishTaskBtn.classList.add('timer--hidden');
            startPomodorosBtn.classList.add('timer--hidden');

            jQuery('.donut').radialTimer({ time: data.shortBreak.value }, settingButtonsFinishTaskHandler, true);
            jQuery('.container').notification('success', 'You finished pomodoro!', 4);
            eventBus.post('changeCompleteDate', data.id);
  
            pomodoroCountsData = {
              taskId: this.taskId,
              completedCount: container.querySelectorAll('.timer__estimate-pomodoro-finished').length,
              failedPomodoros: container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
              newEstimation: container.querySelectorAll('.timer__estimate-pomodoro-finished').length + container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
            };
    
            eventBus.post('callCompletedTask', this.taskId);
            header.classList.remove('header--hidden');
            eventBus.post('callUpdatePomodoroCounts', pomodoroCountsData);
            arrowLeft.removeEventListener('click', changeStatusToDailyBack);
          }
        }
      };
      var settingButtonsFinishPomodorosHandler = (isCallBack = false) => {
        if (isCallBack === true || target.classList.contains('setting-buttons__finish-pomodoros')) {
          const donut = donutContainer.querySelector('.donut');
          const activeEstimate = container.querySelector('.active-estimate');
          const estimatePomodorosLength = container.querySelectorAll('.timer__estimate-pomodoro').length;
          const estimatePomodorosFinishedLength = container.querySelectorAll('.timer__estimate-pomodoro-finished').length;
          const estimatePomodorosFailedLength = container.querySelectorAll('.timer__estimate-pomodoro-failed').length;

          donut.remove();
          donutContainer.insertAdjacentHTML('afterBegin', donutTemplate);
          timeWork.classList.add('timer--hidden');
          timeBreak.classList.remove('timer--hidden');
          failPomodorosBtn.classList.add('timer--hidden');
          finishPomodorosBtn.classList.add('timer--hidden');
          addIcon.classList.add('timer--hidden');
          startPomodorosBtn.classList.remove('timer--hidden');
          finishTaskBtn.classList.remove('timer--hidden');
          activeEstimate.classList.remove('timer__estimate-pomodoro-failed');
          activeEstimate.classList.add('timer__estimate-pomodoro-finished');
          activeEstimate.classList.remove('active-estimate');
          activeEstimate.nextElementSibling.classList.add('active-estimate');

          jQuery('.container').notification('info', 'You finished pomodoro!', 4);

          if ((estimatePomodorosFailedLength + estimatePomodorosFinishedLength + 1) % this.workIteration === 0) {
            timeWork.classList.add('timer--hidden');
            timeBreak.classList.add('timer--hidden');
            timeBreakLong.classList.remove('timer--hidden');
            jQuery('.donut').radialTimer({ time: data.longBreak.value }, settingButtonsStartPomodorosHandler);
            jQuery('.container').notification('warning', 'Long break started, please have a rest!', 4);
          } else {
            timeBreak.classList.remove('timer--hidden');
            timeBreakLong.classList.add('timer--hidden');
            jQuery('.donut').radialTimer({ time: data.shortBreak.value }, settingButtonsStartPomodorosHandler);
          }

          if (estimatePomodorosLength === estimatePomodorosFailedLength + estimatePomodorosFinishedLength + 1) {
            timeWork.classList.add('timer--hidden');
            timeBreak.classList.add('timer--hidden');
            completedTask.classList.remove('timer--hidden');
            arrowRight.classList.remove('timer--hidden');
            arrowLeft.classList.remove('timer--hidden');
            finishTaskBtn.classList.add('timer--hidden');
            startPomodorosBtn.classList.add('timer--hidden');

            jQuery('.donut').radialTimer({ time: data.shortBreak.value }, settingButtonsFinishTaskHandler, true);
            jQuery('.container').notification('success', 'You finished pomodoro!', 4);
            eventBus.post('changeCompleteDate', data.id);

            pomodoroCountsData = {
              taskId: this.taskId,
              completedCount: container.querySelectorAll('.timer__estimate-pomodoro-finished').length,
              failedPomodoros: container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
              newEstimation: container.querySelectorAll('.timer__estimate-pomodoro-finished').length + container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
            };
            
            eventBus.post('callCompletedTask', this.taskId);
            header.classList.remove('header--hidden');
            eventBus.post('callUpdatePomodoroCounts', pomodoroCountsData);
          }
        }
      };
      var settingButtonsStartPomodorosHandler = (isCallBack = false) => {
        if (isCallBack === true || target.classList.contains('setting-buttons__start-pomodoros')) {
          const donut = donutContainer.querySelector('.donut');
          
          donut.remove();
          donutContainer.insertAdjacentHTML('afterBegin', donutTemplate);
          timeWork.classList.remove('timer--hidden');
          timeBreak.classList.add('timer--hidden');
          addIcon.classList.add('timer--hidden');
          startPomodorosBtn.classList.add('timer--hidden');
          failPomodorosBtn.classList.remove('timer--hidden');
          finishPomodorosBtn.classList.remove('timer--hidden');
          addIcon.classList.remove('timer--hidden');
          finishTaskBtn.classList.add('timer--hidden');
          timeBreakLong.classList.add('timer--hidden');

          jQuery('.donut').radialTimer({ time: data.workTime.value }, settingButtonsFinishPomodorosHandler);
        }
      };
      var settingButtonsFinishTaskHandler = (isCallBack = false) => {
        if (isCallBack === true || target.classList.contains('setting-buttons__finish-task')) {
          const donut = donutContainer.querySelector('.donut');
          
          donut.remove();
          timeWork.classList.add('timer--hidden');
          timeBreak.classList.add('timer--hidden');
          timeBreakLong.classList.add('timer--hidden');
          completedTask.classList.remove('timer--hidden');
          arrowRight.classList.remove('timer--hidden');
          arrowLeft.classList.remove('timer--hidden');
          finishTaskBtn.classList.add('timer--hidden');
          startPomodorosBtn.classList.add('timer--hidden');
          
          jQuery('.donut').radialTimer({ time: data.shortBreak.value }, settingButtonsFinishTaskHandler, true);
          eventBus.post('changeCompleteDate', data.id);
  
          pomodoroCountsData = {
            taskId: this.taskId,
            completedCount: container.querySelectorAll('.timer__estimate-pomodoro-finished').length,
            failedPomodoros: container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
            newEstimation: container.querySelectorAll('.timer__estimate-pomodoro-finished').length + container.querySelectorAll('.timer__estimate-pomodoro-failed').length,
          };
  
          eventBus.post('callCompletedTask', this.taskId);
          header.classList.remove('header--hidden');
          eventBus.post('callUpdatePomodoroCounts', pomodoroCountsData);
        }
      };

      if (!completedTask.classList.contains('timer--hidden')) {
        timeBreakLong.classList.add('timer--hidden');
      }

      settingButtonsStartHandler();
      settingButtonsFailPomodorosHandler();
      settingButtonsFinishPomodorosHandler();
      settingButtonsStartPomodorosHandler();
      settingButtonsFinishTaskHandler();

      if (target.classList.contains('icon-arrow-right')) {
        const activeIcon = document.querySelector('.settings-list-bar__icon--active');
        const taskListIcon = document.querySelector('.icon-statistics');

        if (activeIcon) {
          activeIcon.classList.remove('settings-list-bar__icon--active');
        }

        taskListIcon.classList.add('settings-list-bar__icon--active');
        history.pushState(null, null, '/reports/day/tasks');
        eventBus.post('callReportPage');
      }

      if (target.classList.contains('timer__estimate-item--add')) {
        const pomodoroTemplate = `
          <li class="timer__estimate-item timer__estimate-pomodoro">
            <button class="timer__estimate-button">
            </button>
          </li>
        `;
        const estimatePomodorosLength = container.querySelectorAll('.timer__estimate-pomodoro').length;

        if (estimatePomodorosLength + 2 > 10) {
          addIcon.classList.add('timer--hidden');
        }

        addIcon.insertAdjacentHTML('beforebegin', pomodoroTemplate);
      }
    });
  }
}

const timerView = new TimerView();

export { timerView };
