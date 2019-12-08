import { dataService } from '../data-service/data-service';
import { eventBus } from '../../eventBus';
import { myFirebase } from '../communication/communication';

class SettingModel {
  constructor(data) {
    this.data = data;
    this.init();
  }

  init() {
    eventBus.subscribe('callGetSettings', (settings) => {
      eventBus.post('callUpdateSettingsView', settings);
      this.settings = settings;
    });
  }

  setSettings(settings) {
    dataService.setSettings(settings);
  }

  getSettings() {
    myFirebase.getSettings();
  }
}

export let settingModel = new SettingModel();