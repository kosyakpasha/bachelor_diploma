import { settingView } from './_settings-view';
import { settingModel } from './_settings-model';
import { eventBus } from '../../eventBus';


class SettingController {
  constructor() {
    this.init();
  }

  init() {
    this.settingHandler = this.outSetting.bind(this);
    eventBus.subscribe('callSettingPage', this.settingHandler);

    settingModel.getSettings();
    eventBus.subscribe('callGetCustomSettings', (settings) => {
      this.setCustomSettings(settings);
    });
  }

  outSetting() {
    settingModel.getSettings();
    settingView.renderCharts();
  }

  setCustomSettings(settings) {
    settingModel.setSettings(settings);
  }
}

export const settingController = new SettingController();
