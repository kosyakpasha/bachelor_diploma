import firebase from 'firebase/app';
import '@firebase/firestore';
import jQuery from 'jquery';
import { eventBus } from '../../eventBus';
import notification from '../plugins/notification';

class Firebase {
  constructor() {

    const config = {
      apiKey: 'AIzaSyAcigLelh_cws9vRpoDaf_1fW91dbvSeZ0',
      authDomain: 'productivity-app-e6bcf.firebaseapp.com',
      databaseURL: 'https://productivity-app-e6bcf.firebaseio.com',
      projectId: 'productivity-app-e6bcf',
      storageBucket: 'productivity-app-e6bcf.appspot.com',
      messagingSenderId: '868540846456',
    }

    firebase.initializeApp(config);

    this.db = firebase.firestore();
    this.init();
  }

  init() {
    eventBus.subscribe('callGetUpdatedData', (updatedData) => this.getUpdatedData(updatedData));
  }

  getSettings() {
    this.db.collection('settings').get().then((querySnapshot) => {
      return querySnapshot.docs[0].data();
    })
      .then((data) => {
        eventBus.post('callGetSettings', data);
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  }

  setSettings(settings) {
    this.db.collection('settings').doc('settings').set(settings).then((data) => {
      jQuery('.container').notification('success', 'Settings was successfully saved', 4);
    }).catch((error) => {
      console.error('Error: ' + error);
    });
  }

  getCollectionReports() {
    this.db.collection('task-collection').get().then((querySnapshot) => {
      let data = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      eventBus.post('GetData.reports', data);
    }).catch((error) => {
      console.error('Error: ' + error);
    });
  }

  getCollection() {
    this.db.collection('task-collection').get().then((querySnapshot) => {
      let data = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      eventBus.post('GetData.taskList', data);
    }).catch((error) => {
      console.error('Error: ' + error);
    });
  }

  setCollection(nameData) {
    this.db.collection('task-collection').doc(nameData.id).set(nameData).then((data) => {
      jQuery('.container').notification('success', 'Your task was successfully saved', 4);
    }).catch((error) => {
      jQuery('.container').notification('warning', 'Unable to save settings. Try again later ', 4);
    });
  }

  deleteCollection(nameData) {
    this.db.collection('task-collection').doc(nameData).delete().then((data) => {
      jQuery('.container').notification('success', 'Your task was successfully removed', 4);
    }).catch((error) => {
      jQuery('.container').notification('warning', 'Unable to remove task. Try again later ', 4);
    });;
  }

  getUpdatedData(updatedData) {
    this.updatedData = updatedData;
  }

  setCompleteDate(taskId) {    
    let sfDocRef = this.db.collection('task-collection').doc(taskId);
    let that = this;

    return this.db.runTransaction((transaction) => {
      return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
              throw 'Document does not exist!';
          }
          transaction.update(sfDocRef, { 
            completeDate: Date.now()
           });
        });
      }).catch((error) => {
        console.error('Error: ' + error);
      });
  }

  updateStatus(taskId, newStatus, renderPage) {
    if (location.href.match(/task-list/)) {
      eventBus.post('callDailyTaskRender', this.updatedData);
    }
   
    let sfDocRef = this.db.collection('task-collection').doc(taskId);
    let that = this;

    return this.db.runTransaction((transaction) => {
      return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
              throw 'Document does not exist!';
          }
          transaction.update(sfDocRef, { 
            status: newStatus
           });
        });
      }).then(function() {
          that.getCollection();
          if (renderPage === 'task-list') {
            jQuery('.container').notification('info', 'You task was moved to the daily task list', 4);
            eventBus.post('callRenderTaskListPage');
          }
      }).catch(function(error) {
        jQuery('.container').notification('warning', 'Unable to move to the daily task list. Try again later', 4);
      });
  }

  updatePomodoroCounts(taskId, completedCount, failedPomodoros, newEstimation) {
    const sfDocRef = this.db.collection('task-collection').doc(taskId);
    const that = this;

    return this.db.runTransaction((transaction) => {
      return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
              throw 'Document does not exist!';
          }
          transaction.update(sfDocRef, { 
            completedCount: completedCount,
            failedPomodoros: failedPomodoros,
            estimation: newEstimation,
           });
        });
      }).catch(function(error) {
        jQuery('.container').notification('warning', 'Unable to mark pomodoro/task as completed. Try again later', 4);
      });
  }

}

export const myFirebase = new Firebase();
