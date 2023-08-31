const express = require("express");
const app = express();
app.use(express.static(__dirname + "/FrontEnd"));

app.post("/newuser", async (req, res) => {
  const { firstname, lastname, email, username, password, age } = req.body;
  User.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    username: username,
    password: password,
    age: age,
  })
    .then((newUser) => {
      res.json({ id: newUser.id });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err: "there was an error" });
    });
});

app.get("/B", (req, res) => {
  res.json({});
});

app.get("/C", (req, res) => {
  res.json({});
});

app.get("/D", (req, res) => {
  res.json({});
});

app.listen(3000, () => {
  console.log("App has started on http://localhost:3000/");
});
