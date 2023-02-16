const TOKEN = "token";
const BASE_URL = "http://localhost:4000/";

function saveToken(token) {
  localStorage.setItem(TOKEN, JSON.stringify(token));
}

function getToken() {
  return JSON.parse(localStorage.getItem(TOKEN));
}

function removeToken() {
  localStorage.removeItem(TOKEN);
}

async function apiCall(endpoint, method = "GET", data) {
  const token = await getToken();
  return await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authentication: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

//MOBILE-MENU
jQuery("button.navbar-toggle").click(function () {
  jQuery("body").toggleClass("nav-open");
  jQuery("html").toggleClass("overflow-hidden");
});

// APIs call
$("#login").submit(async (event) => {
  event.preventDefault();
  const userName = $("#username").val();
  const password = $("#password").val();

  apiCall(
    "login",
    "POST",
    JSON.stringify({
      email_signataire: userName,
      password,
    })
  )
    .then((data) => {
      const { accessToken } = data;
      saveToken(accessToken);
      window.location.href = "account.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#updateUser").submit(async (event) => {
  event.preventDefault();
  const first_name = $("#firstName").val();
  const last_name = $("#lastName").val();
  const email_signataire_new = $("#email").val();
  const address = $("#address").val();

  apiCall(
    "updateUser",
    "PUT",
    JSON.stringify({
      email_signataire_new,
      last_name,
      first_name,
      address,
    })
  )
    .then((data) => {
      console.log("Data", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#resetPassword").submit(async (event) => {
  event.preventDefault();
  const email_compta = $("#userEmail").val();
  const old_password = $("#oldPassword").val();
  const new_password = $("#newPassword").val();

  apiCall(
    "changepassword",
    "POST",
    JSON.stringify({
      email_compta,
      old_password,
      new_password,
    })
  )
    .then((data) => {
      console.log("Data", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

$("#updateBillingInfo").submit(async (event) => {
  event.preventDefault();
  // const email_compta = $("#billingEmail").val();
  const iban = $("#iban").val();
  apiCall(
    "updateBillingInfo",
    "POST",
    JSON.stringify({
      iban,
    })
  )
    .then((data) => {
      console.log("Data", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

async function getUserInfo() {
  apiCall("user")
    .then((data) => {
      const { user } = data;
      $("#firstName").val(user.first_name);
      $("#lastName").val(user.last_name);
      $("#email").val(user.email_signataire);
      $("#address").val(user.address);
      $("#userEmail").val(user.email_signataire);
      $("#billingEmail").val(user.email_signataire);
      $("#iban").val(user.iban);
      $("#userName").html(`${user.first_name} ${user.last_name}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getSubscriptionList() {
  apiCall("subscription")
    .then(({ data }) => {
      const text = data?.map(
        (item) => `
            <tr>
              <td>${item.Investisseur}</td>
              <td>${item.Produit}</td>
              <td>${item.Montant} €</td>
              <td>${item.Date}</td>
              <td>${item.Num_ODDO}</td>
              <td><a href="#">${item.attestation}</a></td>
           </tr>`
      );
      $("#subscriptions").html(text);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

$(document).ready(function () {
  if (window.location.pathname.includes("account.html")) {
    getUserInfo();
  }
  if (window.location.pathname.includes("list-of-subscribers.html")) {
    getSubscriptionList();
  }
});

function disconnect() {
  removeToken();
  window.location.href = "/login.html";
}
