import $ from 'jquery';
import * as store from './store';


const updateWelcomeNotification = () => {
  const loginTime     = store.getLoginTime();
  const relativeTime  = loginTime.toRelative();
  const { firstName } = store.getUserInfo();

  $("#welcome-notification-text")
    .contents()
    .filter(
      (_, element) => element.nodeType === 3
    )
    .remove()
  ;
  $("#welcome-notification-text")
    .prepend(`Bienvenue ${firstName}!`)
  ;

  $("#welcome-notification-time").text(relativeTime);
}


$(".all-notifications1").click(
  () => updateWelcomeNotification()
);
