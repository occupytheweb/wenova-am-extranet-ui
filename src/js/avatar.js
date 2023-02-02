import $ from 'jquery';
import * as store from './store';

const updateAvatar = (firstName, lastName) => {
  const avatarUrl = `https://ui-avatars.com/api/?background=23233d&color=fff&name=${firstName}+${lastName}`;

  const avatar = $("#user-avatar");
  avatar.attr("src", avatarUrl);
  avatar.removeClass("d-none");
};


export const updateAvatarWithDetailsFromStore = () => {
  const {
    firstName,
    lastName,
  } = store.getUserInfo();

  if (!!firstName && !!lastName) {
    updateAvatar(firstName, lastName);
  }
}


$(
  () => {
    updateAvatarWithDetailsFromStore();
  }
);
