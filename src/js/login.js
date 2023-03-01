import $ from "jquery";
import {authenticate, profile} from "./auth";
import {notifyOnApiError} from "./api-client";
import * as store from "./store";


const authenticateAndNavigate = async (credentials) => authenticate(credentials)
  .then(notifyOnApiError)
  .then(response => response.json())
  .then(
    data => {
      const { token } = data;
      store.saveToken(token);

      return data;
    }
  )
  .then(() => profile())
  .then(
    profile => {
      window.location.href = "/";
      return profile;
    }
  )
;


$("#login").submit(
  async (event) => {
    event.preventDefault();

    const email    = $("#email").val();
    const password = $("#password").val();

    await authenticateAndNavigate({
      email,
      password,
    });
  }
)
