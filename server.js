const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/FrontEnd"));
const { Users, Items } = require("./models");
const { Op } = require("sequelize");

//CREATE NEW USER - Working
app.post("/newuser", (req, res) => {
  const { firstname, lastname, email, username, password, age } = req.body;
  Users.create({
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

//FIND ALL USERS - Working, have not linked with items yet
app.get("/users", (req, res) => {
  Users.findAll({
    attributes: ["id", "firstname", "lastname", "email"],
    // include: [
    //   {
    //     model: items,
    //     attributes: ["location", "cost", "bywhen", "name"],
    //   },
    // ],
  }).then((users) => {
    console.log(users);

    res.json(users);
  });
});

//GET User by first or last name
app.post("/users/search", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  const { search } = req.body;
  console.log(search);

  Users.findAll({
    attributes: ["id", "firstname", "lastname", "email", "age"],
    where: {
      [Op.or]: [
        {
          firstname: {
            [Op.iLike]: "%" + search + "%",
          },
        },
        {
          lastname: {
            [Op.iLike]: "%" + search + "%",
          },
        },
      ],
    },
  }).then((users) => {
    res.json(users);
  });
});

//DELETE USER -- Incomplete until we solve the ID issue
// app.delete("/users/:id", (req, res) => {
//   User.destroy({
//     where: {
//       id: req.params.id,
//     },
//   }).then((results) => {
//     console.log(results);
//     res.json({});
//   });
// });

app.listen(3000, () => {
  console.log("App has started on http://localhost:3000/");
});
