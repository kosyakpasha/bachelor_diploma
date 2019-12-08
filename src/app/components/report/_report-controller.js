import { reportView } from './_report-view';
import { reportModel } from './_report-model';
import { eventBus } from '../../eventBus';

class ReportController {
  constructor() {
    this.init();
  }

  init() {
    this.reportHandler = this.outReport.bind(this);
    eventBus.subscribe('callReportPage', this.reportHandler);
  }

  outReport() {
    reportModel.getData();
    reportView.render();

    const promiseReportData = new Promise((resolve, reject) => {
      eventBus.subscribe('GetData.reports', (data) => {
        const result = data;

        resolve(result);
      });
    });

    promiseReportData.then((result) => {
      const chartsData = reportModel.dataSort(result);

      reportView.renderCharts(chartsData);
    });
  }
}

const reportController = new ReportController();
