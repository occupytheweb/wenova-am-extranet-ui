import {highlightActiveRoute} from "./sidebar";
import * as store from "./store";
import $ from "jquery";


export const updateLayoutUi = (routeKey) => {
  highlightActiveRoute(routeKey);

  const {
    firstName,
    lastName,
  } = store.getUserInfo();

  $("#userName").html(`${firstName} ${lastName}`);
}
