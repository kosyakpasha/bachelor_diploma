const settingTeplate = require('./_settings.hbs');
const settingsCategoriesTeplate = require('./_settings-categories.hbs');
import { eventBus } from '../../eventBus';
import AbstractView from '../../abstract/AbstractView';
import { dataService } from '../data-service/data-service';

class SettingView extends AbstractView {
  constructor(template, templateCategory) {
    super();
    this.template = template;
    this.templateCategory = templateCategory;
    this.init();
  }

  init() { 
    eventBus.subscribe('callUpdateSettingsView', (settings) => { 
      this.settings = settings;

      if (location.href.match(/settings\/pomodoros/)) {
        this.renderTemplate();
      }

      if (location.href.match(/settings\/categories/)) {
        this.renderCategories();
      }

      this.pomodorosCategoriesTabs();
     });    
  }

  renderCategories() {
    let container = document.querySelector('.main__container');
    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.templateCategory());
  }

  pomodorosCategoriesTabs() {
    const container = document.querySelector('.settings-tabs__tabs-controls');
    const isSettingPomodorosPage = location.href.match(/settings\/pomodoros/);
    const isSettingCategoriesPage = location.href.match(/settings\/categories/);
    const isSettingsPage = location.href.match(/settings/);

    this.lightCurrentNavItem(isSettingsPage, '.icon-settings', '.header__settings-list-bar', 'settings-list-bar__icon--active');
    this.lightCurrentNavItem(isSettingPomodorosPage, '.tabs-controls__item--pomodoros', '.settings-tabs__tabs-controls', 'tabs-controls__item--active');
    this.lightCurrentNavItem(isSettingCategoriesPage, '.tabs-controls__item--categories', '.settings-tabs__tabs-controls', 'tabs-controls__item--active');

    this.lightNavItem('settings-tabs__tabs-controls', 'tabs-controls__item', 'tabs-controls__item--active');

    if (container === null) {
      return;
    }

    container.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('tabs-controls__item--pomodoros')) {
        history.pushState(null, null, '/settings/pomodoros');
      }

      if (target.classList.contains('tabs-controls__item--categories')) {
        history.pushState(null, null, '/settings/categories');
      }
    });
  }

  renderTemplate() {
    let container = document.querySelector('.main__container');
    container.innerHTML = '';
    container.insertAdjacentHTML('afterbegin', this.template());

    if (!this.settings) {
      return;
    }

    this.renderCharts(this.settings);
    this.getCustomSettings();
    this.lightNavItem('settings-tabs__tabs-controls', 'tabs-controls__item', 'tabs-controls__item--active');
  }

  getCustomSettings() {

    const buttonsContainer = document.querySelector('.setting-buttons');

    buttonsContainer.addEventListener('click', (e) => {

      this.target = e.target;

      if (location.href.match(/settings\/pomodoros/)) {
        const container = document.querySelector('.settings-list');
        const workTimeVal = container.querySelector('.settings-list--work-time .incr-decr__value').value;
        const workIterationVal = container.querySelector('.settings-list--work-iteration .incr-decr__value').value;
        const shortBreakVal = container.querySelector('.settings-list--short-break .incr-decr__value').value;
        const longBreakVal = container.querySelector('.settings-list--long-break .incr-decr__value').value;
        
        this.customSettings = {
          workTime: {
            value: parseInt(workTimeVal),
          },
          workIteration: {
            value: parseInt(workIterationVal),
          },
          shortBreak: {
            value: parseInt(shortBreakVal),
          },
          longBreak: {
            value: parseInt(longBreakVal),
          },
        };
        
        if (this.target.classList.contains('setting-buttons__btn_green')) {
          history.pushState(null, null, '/task-list');
          dataService.getFirebaseData();
          eventBus.post('callTaskListPage');
          eventBus.post('callTaskRender');
          
          const isTaskListPage = location.href.match(/task-list/);

          this.lightCurrentNavItem(isTaskListPage, '.icon-list', '.header__settings-list-bar', 'settings-list-bar__icon--active');

          eventBus.post('callGetCustomSettings', this.customSettings);
        }
   
        if (this.target.classList.contains('setting-buttons__btn_blue')) {
          history.pushState(null, null, '/task-list');
          dataService.getFirebaseData();
          eventBus.post('callTaskListPage');
          eventBus.post('callTaskRender');
          
          const isTaskListPage = location.href.match(/task-list/);

          this.lightCurrentNavItem(isTaskListPage, '.icon-list', '.header__settings-list-bar', 'settings-list-bar__icon--active');
        }
      }
    
      if (location.href.match(/settings\/categories/)) {
        if (this.target.classList.contains('setting-buttons__btn_blue')) {
          history.pushState(null, null, '/task-list');
          dataService.getFirebaseData();
          eventBus.post('callTaskListPage');
          eventBus.post('callTaskRender');
          
          const isTaskListPage = location.href.match(/task-list/);
          this.lightCurrentNavItem(isTaskListPage, '.icon-list', '.header__settings-list-bar', 'settings-list-bar__icon--active');
        }
      }
    });
  }

  renderCharts(state) {
    if (state === undefined) {
      return;
    }

    var settingsComponent = new SettingsComponent(state);

    //Examples of public API

    // settingsComponent.setSettings('workTime', 'step', 10);
    // settingsComponent.setSettings('workTime', 'value', 15);
    // settingsComponent.setSettings('shortBreak', 'max', 15);
    // settingsComponent.setSettings('longBreak', 'min', 1);

    function SettingsComponent(state) {
      var cycleBlock = document.querySelector('.cycle-block'),
          fragment = document.createDocumentFragment();

      init(state);

      function init(state) {
        var workTime = document.querySelector('.settings-list--work-time .incr-decr__value'),
            workIteration = document.querySelector('.settings-list--work-iteration .incr-decr__value'),
            shortBreak = document.querySelector('.settings-list--short-break .incr-decr__value'),
            longBreak = document.querySelector('.settings-list--long-break .incr-decr__value');
        workTime.value = state.workTime.value; 
        workIteration.value = state.workIteration.value;
        shortBreak.value = state.shortBreak.value;
        longBreak.value = state.longBreak.value;

        workTime.setAttribute("max", 25);
        workTime.setAttribute("min", 15);
        workIteration.setAttribute("max", 5);
        workIteration.setAttribute("min", 2);
        shortBreak.setAttribute("max", 5);
        shortBreak.setAttribute("min", 3);
        longBreak.setAttribute("max", 30);
        longBreak.setAttribute("min", 15);

        createEssences();
        generationCycle(workTime.value, workIteration.value, shortBreak.value, longBreak.value);
        generationTimeLine();

        disableButtonsPlusMinus(workTime, 'max');
        disableButtonsPlusMinus(workTime, 'min');
        disableButtonsPlusMinus(workIteration, 'max');
        disableButtonsPlusMinus(workIteration, 'min');
        disableButtonsPlusMinus(shortBreak, 'max');
        disableButtonsPlusMinus(shortBreak, 'min');
        disableButtonsPlusMinus(longBreak, 'max');
        disableButtonsPlusMinus(longBreak, 'min');
      } 
      
      function disableButtonsPlusMinus(elem, MaxOrMin) {
        if (MaxOrMin === 'min') {
          if (+elem.value == +elem.min) {
            elem.previousElementSibling.classList.add('incr-decr--disable');
          } else if (+elem.value != +elem.min) {
            elem.previousElementSibling.classList.remove('incr-decr--disable');
          }
        } else if (MaxOrMin === 'max') {
          if (+elem.value == +elem.max) {
            elem.nextElementSibling.classList.add('incr-decr--disable');
          } else if (+elem.value != +elem.max) {
            elem.nextElementSibling.classList.remove('incr-decr--disable');
          }
        }
      }
      
      function generationTimeLine() {
        var workTimeValue = document.querySelector('.settings-list--work-time .incr-decr__value').value, 
            workIterationValue = document.querySelector('.settings-list--work-iteration .incr-decr__value').value,
            shortBreakValue = document.querySelector('.settings-list--short-break .incr-decr__value').value,
            longBreakValue = document.querySelector('.settings-list--long-break .incr-decr__value').value,
            totalTime = (+workTimeValue * +workIterationValue + +shortBreakValue * (+workIterationValue - 1)) * 2 + +longBreakValue,
            fullCycle = +workTimeValue * +workIterationValue + +shortBreakValue * (+workIterationValue - 1) + +longBreakValue,
            cycleTime = document.querySelector('.cycle-time'),
            hours = parseInt(totalTime / 60, 0),
            minutes = totalTime - hours * 60,
            hoursFullCycle = parseInt(fullCycle / 60, 0),
            minutesFullCycle = fullCycle - hoursFullCycle * 60,
            timeLineItemLast = document.createElement("li"),
            timeLineItemLastSpan = document.createElement("span"),
            longBreakText = document.querySelector('.long-break__text');

        cycleTime.innerHTML = '';

        timeLineItemLast.classList.add("cycle-time__item");
        timeLineItemLastSpan.classList.add("cycle-time__text");

        longBreakText.innerHTML = "Full cycle: " + hoursFullCycle + 'h ' + minutesFullCycle + 'm';
        
        for(var t = 0; t < totalTime; t += 30) {
          var timeLineItem = document.createElement("li"),
              timeLineItemSpan = document.createElement("span"),
              lastHout = Math.floor(t / 60);

          timeLineItem.classList.add("cycle-time__item");
          timeLineItemSpan.classList.add("cycle-time__text");

          if (t === 0) {
            timeLineItemSpan.innerHTML = "0m";
          } else if (t === 30) {
            timeLineItemSpan.innerHTML = "30m";
          } else if (t % 60) {
            timeLineItemSpan.innerHTML = Math.floor(t / 60) + "h 30m";
          } else {
            timeLineItemSpan.innerHTML = Math.floor(t / 60) + "h";
          }

          timeLineItem.appendChild(timeLineItemSpan);
          cycleTime.appendChild(timeLineItem);
        }

        if(minutes != 0) {
          timeLineItemLastSpan.innerHTML = lastHout + "h " + minutes + "m";
        }

        timeLineItemLast.appendChild(timeLineItemLastSpan);
        cycleTime.appendChild(timeLineItemLast);

        cycleBlock.appendChild(cycleTime);
      }

      

      function generationCycle(workTime, workIteration, shortBreak, longBreak) {

        var cycleList = document.querySelector('.cycle-list'),
            k = 0.33,
            height = 10,
            workTimeBG = "#ffb200",
            shortBreakBG = "#57a6dc",
            longBreakBG = "#b470d0";

        cycleList.innerHTML = '';

        for(var i = 0; i < workIteration; i++) {
          var workTimeBlock = document.createElement("li");
          workTimeBlock.style.cssText = "background: " + workTimeBG + "; width: " + workTime * k + "%; height: " + height + "px; order: " + i + "; flex-grow: 1;";
          cycleList.appendChild(workTimeBlock);
        }

        for(var j = 0; j < workIteration - 1; j++) {
          var shortBreakBlock = document.createElement("li");
          shortBreakBlock.style.cssText = "background: " + shortBreakBG + "; width: " + shortBreak * k + "%; height: " + height + "px; order: " + j + "; flex-grow: 1;";
          cycleList.appendChild(shortBreakBlock);      
        }

        var longBreakBlock = document.createElement("li");
        longBreakBlock.style.cssText = "position: relative; background: " + longBreakBG + "; width: " + longBreak * k + "%; height: " + height + "; order: " + j + "; flex-grow: 1;";
        var longBreakText = document.createElement("span");
        longBreakText.classList.add("long-break__text");
        longBreakBlock.appendChild(longBreakText);
        cycleList.appendChild(longBreakBlock);

        for(var i = workIteration; i < workIteration * 2; i++) {
          var workTimeBlock = document.createElement("li");
          workTimeBlock.style.cssText = "background: " + workTimeBG + "; width: " + workTime * k + "%; height: " + height + "; order: " + i + "; flex-grow: 1;";
          cycleList.appendChild(workTimeBlock);
        }

        for(var j = workIteration; j < workIteration * 2 - 1; j++) {
          var shortBreakBlock = document.createElement("li");
          shortBreakBlock.style.cssText = "background: " + shortBreakBG + "; width: " + shortBreak * k + "%; height: " + height + "; order: " + j + "; flex-grow: 1;";
          cycleList.appendChild(shortBreakBlock);      
        }

        cycleBlock.appendChild(cycleList);
      }

      function Voter(options) {
        var elem = options.elem;
        var step = options.step;
        var voteElem = elem.querySelector('.incr-decr__value');

        elem.onclick = function (event) {
          var target = event.target;
          if (target.closest('.incr-decr__decr')) {
            voteDecrease(event, elem);
          } else if (target.closest('.incr-decr__incr')) {
            voteIncrease(event);
          }
        }

        elem.onmousedown = function () {
          return false;
        };

        function voteDecrease(event) {
          var currentTarget = event.currentTarget,
              target = event.target;

          if (+voteElem.value == +voteElem.min) {
            currentTarget.querySelector('.incr-decr__decr').classList.add('incr-decr--disable');
            return;
          } else if (+voteElem.value != +voteElem.min) {
            currentTarget.querySelector('.incr-decr__decr').classList.remove('incr-decr--disable');
          }

          voteElem.value = +parseInt(voteElem.value, 10) - step;

          var workTimeValue = document.querySelector('.settings-list--work-time .incr-decr__value').value,
              workIterationValue = document.querySelector('.settings-list--work-iteration .incr-decr__value').value,
              shortBreakValue = document.querySelector('.settings-list--short-break .incr-decr__value').value,
              longBreakValue = document.querySelector('.settings-list--long-break .incr-decr__value').value;
            
          generationCycle(workTimeValue, workIterationValue, shortBreakValue, longBreakValue);
          generationTimeLine();

        }

        function voteIncrease(event) {
          var currentTarget = event.currentTarget,
              target = event.target;

          if (+voteElem.value == +voteElem.max) {
            currentTarget.querySelector('.incr-decr__incr').classList.add('incr-decr--disable');
            return;
          } else if (+voteElem.value != +voteElem.min) {
            currentTarget.querySelector('.incr-decr__incr').classList.remove('incr-decr--disable');
          }

          voteElem.value = +parseInt(voteElem.value, 10) + step;    

          var workTimeValue = document.querySelector('.settings-list--work-time .incr-decr__value').value,
              workIterationValue = document.querySelector('.settings-list--work-iteration .incr-decr__value').value,
              shortBreakValue = document.querySelector('.settings-list--short-break .incr-decr__value').value,
              longBreakValue = document.querySelector('.settings-list--long-break .incr-decr__value').value;
            
          generationCycle(workTimeValue, workIterationValue, shortBreakValue, longBreakValue);
          generationTimeLine();
          
        }
      }

      function createEssences() {
        var voterWorkTime = new Voter({
          elem: document.querySelector('.settings-list--work-time'),
          step: 5
        });
    
        var voterWorkIteration = new Voter({
          elem: document.querySelector('.settings-list--work-iteration'),
          step: 1
        });
    
        var voterShortBreak = new Voter({
          elem: document.querySelector('.settings-list--short-break'),
          step: 1
        });
    
        var voterLongBreak = new Voter({
          elem: document.querySelector('.settings-list--long-break'),
          step: 5
        });
    
        cycleBlock.appendChild(fragment);
      }

      SettingsComponent.prototype.setSettings = function(nameCategory, option, value) {
        state[nameCategory][option] = value;
        init();
      }  
    }
  }

}

export let settingView = new SettingView(settingTeplate, settingsCategoriesTeplate);
