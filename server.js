const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/FrontEnd"));
const { Users, Items } = require("./models");
const { Op } = require("sequelize");

//PROFILE BACKEND///////////////////////////////////////////
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


// DELETE USER
app.delete("/users/:id", (req, res) => {
  Users.destroy({
    where: {
      id: req.params.id,
    },
  }).then((results) => {
    console.log(results);
    res.json({});
  });
});


//BUCKETLIST BACKEND//////////////////////////////////
//CREATE NEW ITEM - Working
app.post("/newitem", (req, res) => {
  const { location, cost, bywhen, name } = req.body;
  Items.create({
    location: location,
    cost: cost,
    bywhen: bywhen,
    name: name,
  })
    .then((newItem) => {
      res.json({ id: newItem.id });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err: "there was an error" });
    });
});


//FIND ALL Items - Working, have not linked with items yet
app.get("/Items", (req, res) => {
  Items.findAll({
    attributes: ["id", "location", "cost", "bywhen", "name"],

  }).then((users) => {
    console.log(users);

    res.json(users);
  });
});


//GET Items by LOCATION or BYWHEN
app.post("/items/search", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  const { search } = req.body;
  console.log(search);

  Items.findAll({
    attributes: ["id", "location", "cost", "bywhen", "name"],
    where: {
      [Op.or]: [
        {
          location: {
            [Op.iLike]: "%" + search + "%",
          },
        },
        {
          bywhen: {
            [Op.iLike]: "%" + search + "%",
          },
        },
      ],
    },
  }).then((users) => {
    res.json(users);
  });
});


//GET Items by LOCATION or BYWHEN
app.post("/items/search", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  const { search } = req.body;
  console.log(search);

  Items.findAll({
    attributes: ["id", "location", "cost", "bywhen", "name"],
    where: {
      [Op.or]: [
        {
          location: {
            [Op.iLike]: "%" + search + "%",
          },
        },
        {
          bywhen: {
            [Op.iLike]: "%" + search + "%",
          },
        },
      ],
    },
  }).then((users) => {
    res.json(users);
  });
});


app.put("/items/:id", (req, res) => {

  const { location, cost, bywhen, name } = req.body;
  const { id } = req.params;

  Items.update(
    { location: location, cost: cost, bywhen: bywhen, name: name },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      console.log(result);

      res.json({});
    })
    .catch((err) => {
      console.log(err);

      res.json({ err: "there was an error in your request" });
    });
});


// DELETE USER
app.delete("/items/:id", (req, res) => {
  Items.destroy({
    where: {
      id: req.params.id,
    },
  }).then((results) => {
    console.log(results);
    res.json({});
  });
});


app.listen(3000, () => {
  console.log("App has started on http://localhost:3000/");
});
