import $ from 'jquery';

$.fn.radialTimer = (params, callBack, isFinish = false) => {
  const timeS = params.time * 60;
  const finishTask = $(".finish-task")[0];
  const finishWorkBreak = $(".finish-work-break")[0];

  if (!$('.donut')[0]) {
    return;
  }

  $('.donut')[0].style.cssText = `animation-duration: ${timeS}s`;
  if (isFinish) {
    callBack(true);
    
    finishTask.currentTime = 0;
    finishTask.play();
  } else {
    $('.donut')[0].addEventListener('animationend', () => {
      callBack(true);

      finishWorkBreak.currentTime = 0;
      finishWorkBreak.play();
    });
  }
};
