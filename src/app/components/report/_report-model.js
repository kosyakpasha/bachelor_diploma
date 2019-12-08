import { dataService } from '../data-service/data-service';
import { eventBus } from '../../eventBus';

class ReportModel {
  getData() {
    dataService.getFirebaseDataReports();
  }

  dataSort(data) {
    this.completedTasks = data.filter(task => task.completeDate !== null);

    this.urgentArr = this.getUrgent(this.completedTasks);
    this.hightArr = this.getHight(this.completedTasks);
    this.middleArr = this.getMiddle(this.completedTasks);
    this.lowArr = this.getLow(this.completedTasks);
    this.failedArr = this.getFailed(this.completedTasks);
    this.todayDatesArr = this.getDatesArr(1);
    this.weekDatesArr = this.getDatesArr(7);
    this.monthDatesArr = this.getDatesArr(30);

    let dayDataTasks;
    let dayDataPomodoros;
    let weekDataTasks;
    let weekDataPomodoros;
    let monthDataTasks;
    let monthDataPomodoros;

    this.parseUrl();

    if (this.typeTaskPomo === 'tasks' && this.typeData === 'day') {
      dayDataTasks = this.dayDataForRender(this.getTodayTasks(this.urgentArr), this.getTodayTasks(this.hightArr), 
      this.getTodayTasks(this.middleArr), this.getTodayTasks(this.lowArr), this.getTodayTasks(this.failedArr), 'Tasks');
    }

    if (this.typeTaskPomo === 'pomodoros' && this.typeData === 'day') {
      dayDataPomodoros = this.dayDataForRender(this.getTodayPomodoros(this.urgentArr), this.getTodayPomodoros(this.hightArr), 
      this.getTodayPomodoros(this.middleArr), this.getTodayPomodoros(this.lowArr), this.getTodayPomodoros(this.failedArr), 'Pomodoros');
    }

    if (this.typeTaskPomo === 'tasks' && this.typeData === 'week') {
      weekDataTasks = this.weekDataForRender(this.getWeekTasks(this.urgentArr), this.getWeekTasks(this.hightArr), 
      this.getWeekTasks(this.middleArr), this.getWeekTasks(this.lowArr), this.getWeekTasks(this.failedArr), this.weekDatesArr, 'Tasks');
    }

    if (this.typeTaskPomo === 'pomodoros' && this.typeData === 'week') {
      weekDataPomodoros = this.weekDataForRender(this.getWeekPomodoros(this.urgentArr), this.getWeekPomodoros(this.hightArr), 
      this.getWeekPomodoros(this.middleArr), this.getWeekPomodoros(this.lowArr), this.getWeekPomodoros(this.failedArr), this.weekDatesArr, 'Pomodoros');
    }

    if (this.typeTaskPomo === 'tasks' && this.typeData === 'month') {
      monthDataTasks = this.monthDataForRender(this.getMonthTasks(this.urgentArr), this.getMonthTasks(this.hightArr), 
      this.getMonthTasks(this.middleArr), this.getMonthTasks(this.lowArr), this.getMonthTasks(this.failedArr), this.monthDatesArr, 'Tasks');
    }

    if (this.typeTaskPomo === 'pomodoros' && this.typeData === 'month') {
      monthDataPomodoros = this.monthDataForRender(this.getMonthPomodoros(this.urgentArr), this.getMonthPomodoros(this.hightArr), 
      this.getMonthPomodoros(this.middleArr), this.getMonthPomodoros(this.lowArr), this.getMonthPomodoros(this.failedArr), this.monthDatesArr, 'Pomodoros');
    }

    switch (this.typeTaskPomo) {
      case 'tasks':
        switch (this.typeData) {
          case 'day':
            return dayDataTasks;
          case 'week':
            return weekDataTasks;
          case 'month':
            return monthDataTasks;
          default:
            break;
        }
        break;
      case 'pomodoros':
        switch (this.typeData) {
          case 'day':
            return dayDataPomodoros;
          case 'week':
            return weekDataPomodoros;
          case 'month':
            return monthDataPomodoros;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  
  getTodayTasks(tasksArr) {
    return this.todayDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });
      
      return tasksArrNew.length;
    });
  }

  getWeekTasks(tasksArr) {
    return this.weekDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });
      
      return tasksArrNew.length;
    });
  }

  getMonthTasks(tasksArr) {
    return this.monthDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });

      return tasksArrNew.length;
    });
  }

  getTodayPomodoros(tasksArr) {
    const estimationArr = this.todayDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });
     
      return tasksArrNew.map(task => task.estimation);
    });
    let estimationSum = 0;
    const estimationSumArr = [];

    estimationArr[0].map((item) => {
      estimationSum += item;
    });

    estimationSumArr[0] = estimationSum;

    return estimationSumArr;
  }

  getWeekPomodoros(tasksArr) {
    const weekPomodorosArr = this.weekDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });

      return tasksArrNew.map(task => task.estimation);
    });

    weekPomodorosArr.map(item => item.length === 0 ? item[0] = 0 : item);

    weekPomodorosArr.map((item) => {
      let pomodorosSum = 0;

      item.map((subItem) => {
        pomodorosSum += subItem;
      });

      item.length = 1;
      item[0] = pomodorosSum;
    });

    return weekPomodorosArr;
  }

  getMonthPomodoros(tasksArr) {
    const monthPomodorosArr = this.monthDatesArr.map((day) => {
      const tasksArrNew = tasksArr.filter((task) => {
        const currentDate = new Date(day);
        const completeDate = new Date(task.completeDate);
        
        return currentDate.setHours(0, 0, 0, 0) === completeDate.setHours(0, 0, 0, 0);
      });

      return tasksArrNew.map(task => task.estimation);
    });

    monthPomodorosArr.map(item => item.length === 0 ? item[0] = 0 : item);

    monthPomodorosArr.map((item) => {
      let pomodorosSum = 0;

      item.map((subItem) => {
        pomodorosSum += subItem;
      });

      item.length = 1;
      item[0] = pomodorosSum;
    });

    return monthPomodorosArr;
  }

  getDatesArr(amountOfDay) {
    const todayDay = new Date().getDate();
    const datesArray = [];

    for (let i = 0; i < amountOfDay; i++) {
      const date = new Date();

      date.setDate(todayDay - i);
      date.setHours(0, 0, 0, 0);

      datesArray.push(date.getTime());
    }
    return datesArray;
  }

  getUrgent(completedTasks) {
    return completedTasks.filter(task => task.priority === 'urgent');
  }

  getHight(completedTasks) {
    return completedTasks.filter(task => task.priority === 'hight');
  }

  getMiddle(completedTasks) {
    return completedTasks.filter(task => task.priority === 'middle');
  }

  getLow(completedTasks) {
    return completedTasks.filter(task => task.priority === 'low');
  }

  getFailed(completedTasks) {
    return completedTasks.filter(task => task.failedPomodoros > task.completedCount);
  }

  dayDataForRender(urgent = 0, hight = 0, medium = 0, low = 0, failed = 0, popupText) {
    const dayData = {
      chart: {
        type: 'column'
      },
      yAxis: {
        min: 0,
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },
      xAxis: {
        categories: ['URGENT', 'HIGHT', 'MIDDLE', 'LOW', 'Failed'],
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },
      legend: {
        enabled: false
      },

      tooltip: {
        formatter: function() {
            return this.point.name + '<br/>' +
              popupText + ': ' + this.point.y;
          }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      colors: ['#f15a4a', '#fea741', '#fddc43', '#1abb9b', '#8da5b8'],
      "series": [
        {
          "data": [
            {
              "name": "URGENT",
              "y": urgent[0],
              "color": "#f15a4a" 
            },
            {
              "name": "HIGHT",
              "y": hight[0],
              "color": "#fea741" 
            },
            {
              "name": "MIDDLE",
              "y": medium[0],
              "color": "#fddc43" 
            },
            {
              "name": "LOW",
              "y": low[0],
              "color": "#1abb9b" 
            },
            {
              "name": "FAILED",
              "y": failed[0],
              "color": "#8da5b8" 
            },
          ]
        }
      ]
    };

    return dayData;
  }

  weekDataForRender(urgent = [], hight = [], medium = [], low = [], failed = [], datesArr, popupText) {
    const categoriesArr = [];

    datesArr.map((date) => {
      const dateStr = new Date(date).toString();

      categoriesArr.push(dateStr.slice(0, 3));
    });

    const weekData = {
      chart: {
        type: 'column'
      },

      yAxis: {
        min: 0,
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },

      xAxis: {
        categories: categoriesArr,
        min: 0,
        max: 6,
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },

      legend: {
        enabled: false
      },

      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },

      tooltip: {
        formatter: function() {
            return this.series.name + '<br/>' +
              popupText + ': ' + this.point.y;
          }
      },

      colors: ['#f15a4a', '#fea741', '#fddc43', '#1abb9b', '#8da5b8'],

      series: [{
        name: 'URGENT',
        data: urgent,
        stack: 'left'
      }, {
        name: 'HIGHT',
        data: hight,
        stack: 'left'
      }, {
        name: 'MIDDLE',
        data: medium,
        stack: 'left'
      }, {
        name: 'LOW',
        data: low,
        stack: 'left'
      }, {
        name: 'FAILED',
        data: failed,
        stack: 'right'
      }]
    };
    
    return weekData;
  }

  monthDataForRender(urgent = [], hight = [], medium = [], low = [], failed = [], datesArr, popupText) {
    const categoriesArr = [];

    datesArr.map((date) => {
      const dateStr = new Date(date).toString();

      categoriesArr.push(dateStr.slice(8, 10));
    });

    const monthData = {
      chart: {
        type: 'column'
      },
  
      yAxis: {
        min: 0,
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },
  
      xAxis: {
        min: 0,
        max: 29,
        categories: categoriesArr,
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },
  
      legend: {
        enabled: false
      },
  
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
  
      tooltip: {
        formatter: function() {
            return this.series.name + '<br/>' +
              popupText + ': ' + this.point.y;
          }
      },
  
      colors: ['#f15a4a', '#fea741', '#fddc43', '#1abb9b', '#8da5b8'],
  
      series: [{
        name: 'URGENT',
        data: urgent,
        stack: 'center'
      }, {
        name: 'HIGHT',
        data: hight,
        stack: 'center'
      }, {
        name: 'MIDDLE',
        data: medium,
        stack: 'center'
      }, {
        name: 'LOW',
        data: low,
        stack: 'center'
      }, {
        name: 'FAILED',
        data: failed,
        stack: 'center'
      }]
    };

    return monthData;
  }

  parseUrl() {
    const url = location.href;
    const typeTaskPomo = url.match(/([a-z])\w+$/g)[0]
    const typeDataArr = url.match(/\/.+?\//g);
    const typeData = typeDataArr[typeDataArr.length - 1].slice(1).slice(0, -1);

    this.typeTaskPomo = typeTaskPomo;
    this.typeData = typeData;
  }
}

const reportModel = new ReportModel();

export {reportModel};
