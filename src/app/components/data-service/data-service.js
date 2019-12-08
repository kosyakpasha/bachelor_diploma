import {sessionStore} from '../session-store/session-store';
import {myFirebase} from '../communication/communication';
import { eventBus } from '../../eventBus';

class DataService {

  setSettings(settings) {
    return myFirebase.setSettings(settings);
  }

  getFirstVisitResult() {
    return sessionStore.getResult();
  }

  getFirebaseData() {
    return myFirebase.getCollection();
  }

  getFirebaseDataReports() {
    return myFirebase.getCollectionReports();
  }

  setFirebaseData(newData) {
    return myFirebase.setCollection(newData);
  }

  removeDataItem(taskId) {
    return myFirebase.deleteCollection(taskId);
  }

  updateStatus(taskId, newStatus, renderPage) {
    myFirebase.updateStatus(taskId, newStatus, renderPage);
  }

  updatePomodoroCounts(taskId, completedCount, failedPomodoros, newEstimation) {
    myFirebase.updatePomodoroCounts(taskId, completedCount, failedPomodoros, newEstimation);
  }

  setCompleteDate(taskId) {
    myFirebase.setCompleteDate(taskId);
  }
}

const dataService = new DataService();

export { dataService };