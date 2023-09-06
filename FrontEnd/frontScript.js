const register = document.getElementById("registerForm");
const login = document.getElementById("loginform");

register.addEventListener("submit", (event) => {
  event.preventDefault();
    fetch("/newuser", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        firstname: event.target.firstname.value,
        lastname: event.target.lastname.value,
        email: event.target.email.value,
        username: event.target.username.value,
        password: event.target.password.value,
        age: event.target.age.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.href = "http://localhost:3000/userdashboard";
      });
});

document.getElementById("loginform").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;
  const body = {
    username: username,
    password: password,
  };

  fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success){
        window.location.href = "http://localhost:3000/userdashboard";
      } else {
        alert("Incorrect credentials");
      }
    });
});
