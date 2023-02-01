import {highlightActiveRoute, navRouteKeyToIdMap} from "./sidebar";
import * as store from "./store";
import $ from "jquery";


const updateSectionTitle = (routeKey) => {
  const routeId = navRouteKeyToIdMap[routeKey];

  const sectionTitle = $(`#${routeId}`).data("section-title");
  $("#section-title").text(sectionTitle);
};


export const updateLayoutUi = (routeKey) => {
  highlightActiveRoute(routeKey);
  updateSectionTitle(routeKey);

  const {
    firstName,
    lastName,
  } = store.getUserInfo();

  $("#userName").html(`${firstName} ${lastName}`);
}
