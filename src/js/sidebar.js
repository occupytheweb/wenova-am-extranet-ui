import $ from 'jquery';
import {logout} from "./auth.js";


export const navRouteKeyToIdMap = {
  account:     "nav-account",
  subscribers: "nav-subscribers",
  payments:    "nav-payments",
}


export const highlightActiveRoute = (routeKey) => {
  const id = `#${navRouteKeyToIdMap[routeKey]}`;

  $(id).addClass("active");
}


$("#disconnect").click(
  () => {
    logout();
  }
)
