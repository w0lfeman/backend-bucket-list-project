const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/FrontEnd"));
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SessionStore = require("express-session-sequelize")(session.Store);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Users, Items, sequelize } = require("./models");
const { Op } = require("sequelize");
const BucketSession = new SessionStore({
  db: sequelize,
});

//Session Setup
app.use(cookieParser());
app.use(
  session({
    secret: "LarryDavid",
    resave: false,
    saveUninitialized: true,
    store: BucketSession,
    cookie: {
      maxAge: 1000 * 3600,
    },
  })
);
/////////
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  

  Users.findOne({
    where: {
      username: username,
    },
  }).then((users) => {
    if (!users) {
      return res.json({ err: "no user found" });
    }

    let comparison = bcrypt.compareSync(password, users.password);
    console.log(password, users.password);
    console.log(comparison == true)
    if (comparison == true) {
      req.session.users = users;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

///////////////////
//PROFILE BACKEND///////////////////////////////////////////
//CREATE NEW USER - Working
app.post("/newuser", (req, res) => {
  console.log(req.session);
  const { firstname, lastname, email, username, password, age } = req.body;
  if (!email || !password || !username) {
    return res.json({ err: "email, password or username is empty" });
  }
  let hashedPassword = bcrypt.hashSync(password, saltRounds);
  Users.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    username: username,
    password: hashedPassword,
    age: age,
  })
    .then((newUser) => {
      req.session.user = newUser;
      console.log(newUser)
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err: "there was an error" });
    });
});


//FIND ALL USERS - Working, have not linked with items yet
app.get("/users", (req, res) => {
  console.log(req.session);
  Users.findAll({
    attributes: ["id", "firstname", "lastname", "email", "username"],
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

//GET User ID
app.get("/user/:id", (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.json({ err: "id needs to be a number" });
  }
  Users.findByPk(req.params.id, {
    attributes: ["id", "firstname", "lastname", "email"],
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.json({ err: "there was en error on the request" });
    });
});

//Retrieve User by first or last name
app.post("/users/search", (req, res) => {
  console.log(req.session);
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
  console.log(req.session);
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
  console.log(req.session);
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
  console.log(req.session);
  Items.findAll({
    attributes: ["id", "location", "cost", "bywhen", "name"],
  }).then((users) => {
    console.log(users);

    res.json(users);
  });
});

//GET Items by LOCATION or BYWHEN
app.post("/items/search", (req, res) => {
  console.log(req.session);
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
  console.log(req.session);
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
  console.log(req.session);
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
  console.log(req.session);
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
