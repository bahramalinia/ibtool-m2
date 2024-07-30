//Get and Set logged in user name in topbar
async function getUserData(sso) {
  let user;
  console.log("---localStorage: ", localStorage);
  const url = `${localStorage.getItem("backEndIP")}/getUser/${sso}`;
  console.log("--- url: ", url);
  await fetch(url, {
    // mode: 'no-cors' // 'cors' by default
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      user = result;
    });
  return user;
}

async function setUserNameInTopbar() {
  console.log("---- localStorage: ", localStorage);
  const user = await getUserData(localStorage.getItem("CURRENT_USER_SSO"));
  document.getElementById(
    "topbarUserName"
  ).innerText = `${user.firstName} ${user.lastName}`;
}

function setFronEndIP() {
  //   localStorage.setItem("backEndIP", "http://localhost:8080");
  localStorage.setItem("backEndIP", "http://13.39.211.1:8080");
  //  localStorage.setItem('backEndIP', 'http://3.213.71.116:8080');
  console.log("setting front end ip");
}
