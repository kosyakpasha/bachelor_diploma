const Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('getEstimate', function(dataObj) {
  if(!dataObj) {
    return;
  }

  const estimationTemplate = `    
    <li class="timer__estimate-item timer__estimate-pomodoro">
      <button class="timer__estimate-button">
      </button>
    </li>`;

  let estimationTemplateFull = '';

  for(let i = 0; i < dataObj.estimation - 1; i++) {
    estimationTemplateFull += estimationTemplate;
  }

  return new Handlebars.SafeString(
    estimationTemplateFull
  )
});