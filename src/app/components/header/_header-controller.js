import {headerView} from './_header-view';
import {headerModel} from './_header-model';
import {eventBus} from '../../eventBus';
import { dataService } from '../data-service/data-service';


class HeaderController {
  constructor(headerView, headerModel, eventBus) {
    this.headerView = headerView;
    this.eventBus = eventBus;
    this.init();
  }

  init() {
    this.headerHandler = this.outHeader.bind(this);
    eventBus.subscribe("callHeaderPage", this.headerHandler);
    eventBus.subscribe("callGetData", this.getData);
    eventBus.subscribe('callRenderTrashIcon', headerView.renderTrashIcon);
    eventBus.subscribe('callTrashNumUpdate', () => {headerView.renderTrashIcon()});
  }

  outHeader() {
    this.headerView.render();
  }

  getData() {
    dataService.getFirebaseData();
  }
}

let headerController = new HeaderController(headerView);