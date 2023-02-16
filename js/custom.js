// $(document).ready(function () {
//   //DataTable
//   jQuery("#example").DataTable();
// });

const TOKEN = "token";
function saveToken(token) {
  localStorage.setItem(TOKEN, JSON.stringify(token));
}

function getToken() {
  return JSON.parse(localStorage.getItem(TOKEN));
}

function removeToken() {
  localStorage.removeItem(TOKEN);
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
  await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_signataire: userName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { accessToken } = data;
      saveToken(accessToken);
      window.location.href = "account.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  event.preventDefault();
});

$("#updateUser").submit(async (event) => {
  event.preventDefault();
  const first_name = $("#firstName").val();
  const last_name = $("#lastName").val();
  const email_compta = $("#email").val();
  const address = $("#address").val();
  const token = await getToken();

  fetch("http://localhost:4000/updateUser", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authentication: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email_compta,
      last_name,
      first_name,
      address,
    }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error:", error);
    });
});

function disconnect() {
  removeToken();
  window.location.href = "/login.html";
}
