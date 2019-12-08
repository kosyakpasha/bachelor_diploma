import $ from 'jquery';
import 'jquery-ui/ui/widgets/tooltip';

$.fn.customTooltip = () => {
  $(() => {
    $(document).tooltip({
      show: { effect: "blind", duration: 800 },
      position: {
        my: 'center+40 top+40',
        at: 'right top'
      },
      track: true,
      hide: { effect: "blind", duration: 800 }
    });
  });
}
