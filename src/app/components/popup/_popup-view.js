const popupTeplate = require('./_popup.hbs');
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { dataService } from '../data-service/data-service';
import {eventBus} from '../../eventBus';

class PopupView {
  constructor(template) {
    this.template = template;
    this.status = {
      GLOBAL_LIST: true,
      DAILY_LIST: false,
      ACTIVE: false,
      COMPLETED: false
    };
  }

  render(isAddPopup) {
    const popup = document.querySelector('.popup');

    if (popup) return;

    const container = document.querySelector('.main__container');

    container.insertAdjacentHTML('afterbegin', this.template(isAddPopup));   
    
    if (isAddPopup.add) {
      const todatDate = new Date();
      const todayDay = todatDate.getDate();
      const todayYear = todatDate.getFullYear();
      const deadlineField = document.querySelector('#deadline');
      const zeroStr = '0';
      const todayMonth = (zeroStr + (todatDate.getMonth() + 1)).slice(-2);

      deadlineField.value = `${todayMonth}/${todayDay}/${todayYear}`;
      this.controllsPopup();
    } else {
      this.controllsEditPopup();
    }

    eventBus.subscribe('callEditTask', (currentTaskNonEditableData) => {
      this.editTaskId = currentTaskNonEditableData.taskId;
      this.currentCreateDate = currentTaskNonEditableData.currentCreateDate;
      this.currentStatus = currentTaskNonEditableData.currentStatus;
      this.currentTitle = currentTaskNonEditableData.currentTitle;
      this.currentDesc = currentTaskNonEditableData.currentDesc;
      this.currentCategory = currentTaskNonEditableData.currentCategory;
      this.currentPriority = currentTaskNonEditableData.currentPriority;
      this.currentDeadlineDate = currentTaskNonEditableData.currentDeadlineDate;
      this.currentEstimation = currentTaskNonEditableData.currentEstimation;

      const estimation = container.querySelector('.popup__estimation-list');
      const priority = container.querySelector('.sub-list--priority');
      const category = container.querySelector('.sub-list--category');
      const categoriesNodeList = category.querySelectorAll('input');
      const categoryChecked = category.querySelector('input:checked');
      const categoriesArr = [...categoriesNodeList];
      const categoriesArrNew = categoriesArr.filter(item => item.value === this.currentCategory);
      const estimationsNodeList = estimation.querySelectorAll('input');
      const estimationsArr = [...estimationsNodeList];
      const estimationsArrNew = estimationsArr.filter(item => item.value === this.currentEstimation);
      const prioritiesNodeList = priority.querySelectorAll('input');
      const priorityChecked = priority.querySelector('input:checked');
      const prioritiesArr = [...prioritiesNodeList];
      const prioritiesArrNew = prioritiesArr.filter(item => item.value === this.currentPriority);
      const deadlineArr = this.currentDeadlineDate.split('/');

      categoryChecked.removeAttribute('checked');
      categoriesArrNew[0].setAttribute('checked', 'checked');
      priorityChecked.removeAttribute('checked');
      prioritiesArrNew[0].setAttribute('checked', 'checked');
      estimationsArrNew[0].setAttribute('checked', 'checked');
      estimation.querySelector('input:checked').value = this.currentEstimation;
      container.querySelector('#title').value = this.currentTitle;
      container.querySelector('#description').value = this.currentDesc;
      container.querySelector('#deadline').value = `${deadlineArr[1]}/${deadlineArr[2]}/${deadlineArr[0]}`;
      priority.querySelector('input:checked').value = this.currentPriority;
      category.querySelector('input:checked').value = this.currentCategory;
    });
    eventBus.subscribe('callGetId', (taskId) => {this.getId(taskId)});
    
    $( "#deadline" ).datepicker();
  }

  removePopup() {
    const popups = document.querySelectorAll('.popup');
    const popupsArr = [...popups];

    popupsArr.map(item => item.remove());
  }

  getRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  getId(taskId) {
    this.taskId = taskId;
  }

  getSelectedIdToRemove(idArr) {
    this.idArr = idArr;
  }

  getPopupData(id = this.getRandomId(), createDateArg = Date.now(), currentStatusArg = this.status) {
    if (!document.querySelector('.popup__content')) return;
    const container = document.querySelector('.popup__content');
    const estimation = container.querySelector('.popup__estimation-list');
    const estimationVal = estimation.querySelector('input:checked').value;
    const title = container.querySelector('.popup-label__title').value;
    const description = container.querySelector('.popup-label__description').value; 
    const deadline = container.querySelector('#deadline').value; 
    const priority = container.querySelector('.sub-list--priority');
    const prioritynVal = priority.querySelector('input:checked').value;
    const category = container.querySelector('.sub-list--category');
    const categoryVal = category.querySelector('input:checked').value;
    const dataPopup = {};
    const todatDate = new Date();
    const todayDay = todatDate.getDate();
    const todayYear = todatDate.getFullYear();
    const zeroStr = '0';
    const todayMonth = (zeroStr + (todatDate.getMonth() + 1)).slice(-2);

    dataPopup.id = id;

    dataPopup.title = title;
    dataPopup.description = description;
    dataPopup.categoryId = categoryVal;
    dataPopup.priority = prioritynVal;
    dataPopup.estimation = estimationVal;
    if (deadline === '') {
      dataPopup.deadlineDate = `${todayYear}-${todayMonth}-${todayDay}`; 
    } else {
      const deadlineArr = deadline.split('/');

      dataPopup.deadlineDate = `${deadlineArr[2]}/${deadlineArr[0]}/${deadlineArr[1]}`;
    }

    dataPopup.status = currentStatusArg;
    dataPopup.createDate = createDateArg;
    dataPopup.completedCount = 0;
    dataPopup.failedPomodoros = 0;
    dataPopup.completeDate = null;
    eventBus.post('callPopupData', dataPopup);
  }

  controllsEditPopup() {
    const popup = document.querySelector('.popup');
    const that = this;

    popup.addEventListener('click', (e) => {
      if (e.target.classList.contains('icon-check')) {
        this.getPopupData(that.editTaskId, that.currentCreateDate, that.currentStatus);
        this.removePopup();
        dataService.getFirebaseData();
        eventBus.post('callRenderTaskListPage');
      }
      if (e.target.classList.contains('icon-close')) {
        this.removePopup(); 
      }
      if (e.target.classList.contains('popup__left-icon')) {
        eventBus.post('callDeleteTaskFromPopup', that.taskId);
        this.removePopup();
        dataService.getFirebaseData();
        eventBus.post('callRenderTaskListPage');
      }
    });
  }

  controllsPopup() {
    const popup = document.querySelector('.popup');
    const that = this;

    popup.addEventListener('click', (e) => {
      if (e.target.classList.contains('icon-close')) {
        this.removePopup(); 
      }
      if (e.target.classList.contains('icon-check')) {
        this.getPopupData();
        this.removePopup(); 
        dataService.getFirebaseData();
        eventBus.post('callRenderTaskListPage');
      }
    });
  }

  controlsRemovePopup() {
    const popup = document.querySelector('.popup');
    const that = this;

    popup.addEventListener('click', (e) => {
      if (e.target.classList.contains('setting-buttons__btn_blue')) {
        this.removePopup(); 
      }
      if (e.target.classList.contains('setting-buttons__btn_red')) {
        eventBus.post('callRemoveSelectedTasks', that.idArr);
        this.removePopup(); 
        dataService.getFirebaseData();
        eventBus.post('callRenderTaskListPage');
      }
    });
  }
}

const popupView = new PopupView(popupTeplate);

export {popupView};
