import {popupView} from './_popup-view';
import {popupModel} from './_popup-model';
import {eventBus} from '../../eventBus';
import {dataService} from '../data-service/data-service';


class PopupController {
  constructor() {
    this.init();
  }

  init() {
    eventBus.subscribe('callPopupPage', this.outPopup.bind(this));
    eventBus.subscribe('callRemovePopupControls', () => popupView.controlsRemovePopup());
    eventBus.subscribe('callSelectedTasksIdToRemove', IdArr => popupView.getSelectedIdToRemove(IdArr));
    eventBus.subscribe('callRemoveSelectedTasks', idArr => this.removeSelectedTasks(idArr));
  }

  outPopup(isAddPopup) {
    popupView.render(isAddPopup);
  }

  removeSelectedTasks(idArr) {
    idArr.forEach(element => {
      dataService.removeDataItem(element);
    });
  }
}

let popupController = new PopupController();