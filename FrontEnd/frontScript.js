const form = document.getElementById("registerForm");

form.addEventListener("submit", (event) => {
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
      });
});
