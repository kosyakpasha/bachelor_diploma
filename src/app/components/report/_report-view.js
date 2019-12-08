import jQuery from 'jquery';
import customTooltip from '../plugins/customTooltip';
import { eventBus } from '../../eventBus';
import AbstractView from '../../abstract/AbstractView';
import Highcharts from '../../../../node_modules/highcharts';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const reportTeplate = require('./_report.hbs');

class ReportView extends AbstractView {
  constructor(template) {
    super();
    this.template = template;
  }

  render() {
    const isReportPage = location.href.match(/report/);
    const container = document.querySelector('.main__container');

    this.lightCurrentNavItem(isReportPage, '.icon-statistics', '.header__settings-list-bar', 'settings-list-bar__icon--active');
    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.template());
    this.reportTabsControlls();

    jQuery('.container').customTooltip();
    const arrowLeft = container.querySelector('.icon-arrow-left');

    arrowLeft.addEventListener('click', () => {
      const activeIcon = document.querySelector('.settings-list-bar__icon--active');
      const taskListIcon = document.querySelector('.icon-list');

      if (activeIcon) {
        activeIcon.classList.remove('settings-list-bar__icon--active');
      }

      taskListIcon.classList.add('settings-list-bar__icon--active');
      eventBus.post('callGetData');
      history.pushState(null, null, '/task-list');
      eventBus.post('callTaskListPage');
    });
  }

  renderCharts(chartObj) {
    const container = document.querySelector('.report__container');

    Highcharts.chart(container, chartObj);
  }

  reportTabsControlls() {
    const url = location.href;
    const container = document.querySelector('.main__container');
    const tabTop = container.querySelector('.tabs-controls--report-top');
    const tabBottom = container.querySelector('.tabs-controls--report-bottom');
    const isTasksTabLink = url.match(/tasks/);
    const isPomodorosTabLink = url.match(/pomodoros/);
    const isDayTabLink = url.match(/day/);
    const isWeekTabLink = url.match(/week/);
    const isMonthTabLink = url.match(/month/);

    tabTop.addEventListener('click', (event) => {
      const tabBottomActive = container.querySelector('.tabs-controls--report-bottom .tabs-controls__item--active');
      const isTasksTab = tabBottomActive.getAttribute('data-report-tab-type') === 'tasks';
      const isPomodorosTab = tabBottomActive.getAttribute('data-report-tab-type') === 'pomodoros';

      if (isTasksTab) {
        this.changeUrlReportTopTab(event, 'tasks');
      } else if (isPomodorosTab) {
        this.changeUrlReportTopTab(event, 'pomodoros');
      }
    });

    tabBottom.addEventListener('click', (event) => {
      const tabTopActive = container.querySelector('.tabs-controls--report-top .tabs-controls__item--active');
      const isDayTab = tabTopActive.getAttribute('data-report-tab-type') === 'day';
      const isWeekTab = tabTopActive.getAttribute('data-report-tab-type') === 'week';
      const isMonthTab = tabTopActive.getAttribute('data-report-tab-type') === 'month';

      if (isDayTab) {
        this.changeUrlReportBottomTab(event, 'day');
      } else if (isWeekTab) {
        this.changeUrlReportBottomTab(event, 'week');
      } else if (isMonthTab) {
        this.changeUrlReportBottomTab(event, 'month');
      }
    });

    this.lightCurrentNavItem(isTasksTabLink, '.tasks-tab', '.tabs-controls--report-bottom', 'tabs-controls__item--active');
    this.lightCurrentNavItem(isPomodorosTabLink, '.pomodoros-tab', '.tabs-controls--report-bottom', 'tabs-controls__item--active');
    this.lightCurrentNavItem(isDayTabLink, '.day-tab', '.tabs-controls--report-top', 'tabs-controls__item--active');
    this.lightCurrentNavItem(isWeekTabLink, '.week-tab', '.tabs-controls--report-top', 'tabs-controls__item--active');
    this.lightCurrentNavItem(isMonthTabLink, '.month-tab', '.tabs-controls--report-top', 'tabs-controls__item--active');
  }

  changeUrlReportTopTab(event, typeTask) {
    const target = event.target;

    if (target.getAttribute('data-report-tab-type') === 'day') {
      history.pushState(null, null, `/reports/day/${typeTask}`);
    }

    if (target.getAttribute('data-report-tab-type') === 'week') {
      history.pushState(null, null, `/reports/week/${typeTask}`);
    }

    if (target.getAttribute('data-report-tab-type') === 'month') {
      history.pushState(null, null, `/reports/month/${typeTask}`);
    }
  }

  changeUrlReportBottomTab(event, typeDate) {
    const target = event.target;

    if (target.getAttribute('data-report-tab-type') === 'pomodoros') {
      history.pushState(null, null, `/reports/${typeDate}/pomodoros`);
    }

    if (target.getAttribute('data-report-tab-type') === 'tasks') {
      history.pushState(null, null, `/reports/${typeDate}/tasks`);
    }
  }
}

let reportView = new ReportView(reportTeplate);

export { reportView };
