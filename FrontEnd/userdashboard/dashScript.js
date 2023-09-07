const header = document.getElementById("header");
const bucketlist = document.getElementById("bucketList");

window.addEventListener("load", (event) => {
  event.preventDefault();
  fetch("/userloginload")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(("Session Data:", data.sessionData));
      header.innerHTML = `<h2>Welcome to your Bucket List Dash Board, ${data.sessionData.user.username}, or shall I call you ${data.sessionData.user.firstname} ${data.sessionData.user.lastname}!!!</h2>`;
    });
});
