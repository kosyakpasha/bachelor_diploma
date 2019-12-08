const Handlebars = require('handlebars/runtime');

function whatDay(dataObj, type) {
  const todatDate = new Date();
  const todayDay = todatDate.getDate();
  const todayYear = todatDate.getFullYear();
  const todayMonth = todatDate.getMonth() + 1;
  const year = parseInt(dataObj.deadlineDate.slice(0, 4));
  const months = parseInt(dataObj.deadlineDate.slice(-5, -3));
  const day = parseInt(dataObj.deadlineDate.slice(-2));

  if (type == 'isToday') {
    const isToday = todayDay == day && todayYear == year && todayMonth == months;

    if (isToday) {
      return true;
    } else {
      return false;
    }
  } else if (type == 'isTomorrow') {
    const isTomorrow = (todayDay > day && todayMonth >= months || todayYear > year);

    if (isTomorrow ) {
      return true;
    } else {
      return false;
    }
  }
}

Handlebars.registerHelper('getDate', (dataObj) => {
  const day = parseInt(dataObj.deadlineDate.slice(-2));
  const months = parseInt(dataObj.deadlineDate.slice(-5, -3));
  const monthsArr = [ 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December' ];
  const template = `        
  <div class='task__date-label'>
    <span class='task__date-num'>${day}</span>
    <span class='task__date-text'>${monthsArr[months - 1]}</span>
  </div>`;
  const templateToday = `        
    <div class='task__date-label'>
      <span class='task__date-text'>TODAY</span>
    </div>`;

  if (whatDay(dataObj, 'isToday')) {
    return new Handlebars.SafeString(
      templateToday
    )
  } else {
    return new Handlebars.SafeString(
      template
    )
  }
});

Handlebars.registerHelper('getEstimation', (dataObj) => {
  return parseInt(dataObj.estimation);
});

Handlebars.registerHelper('getPriority', (dataObj) => {
  return dataObj.priority;
});

Handlebars.registerHelper('getCategories', (dataObj) => {
  return dataObj.categoryId;
});

Handlebars.registerHelper('isGlobalTaskUl', (dataObj) => {
  if (dataObj.status.GLOBAL_LIST == true) {
    return new Handlebars.SafeString(
      `global-list-tabs__global-list`
    )
  }
});

Handlebars.registerHelper('isGlobalTaskLi', function(dataObj) {
  if (dataObj.status.GLOBAL_LIST == true) {
    return new Handlebars.SafeString(
      `task--global`
    )
  }
});

Handlebars.registerHelper('getOverdueClass', function(dataObj) {
  if (whatDay(dataObj, 'isTomorrow')) {
    return new Handlebars.SafeString(
      `task--overdue`
    )
  }
});