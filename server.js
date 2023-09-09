const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/FrontEnd"));
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SessionStore = require("express-session-sequelize")(session.Store);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User, Items, sequelize } = require("./models");
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
//PROFILE BACKEND///////////////////////////////////////////
///// Session - Connected //////
app.get("/userloginload", (req, res) => {
  res.json({ sessionData: req.session });
});
/////

//USER LOGIN - Connected ///////////////////////////////////
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    if (!user) {
      return res.json({ err: "no user found" });
    }

    let comparison = bcrypt.compareSync(password, user.password);
    // console.log(password, user.password);
    // console.log(comparison == true);
    if (comparison == true) {
      req.session.user = user;
      res.json({
        success: true,
      });
    } else {
      res.json({ success: false });
    }
  });
});


//CREATE NEW USER - Connected///////////////////////////////
app.post("/newuser", (req, res) => {
  //console.log(req.session);
  const { firstname, lastname, email, username, password, age } = req.body;
  if (!email || !password || !username) {
    return res.json({ err: "email, password or username is empty" });
  }
  let hashedPassword = bcrypt.hashSync(password, saltRounds);
  User.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    username: username,
    password: hashedPassword,
    age: age,
  })
    .then((newUser) => {
      req.session.user = newUser;
      //console.log(newUser)
      res.json({ success: true });
    })
    .catch((err) => {
      //console.log(err);
      res.json({ err: "there was an error" });
    });
});


// //FIND ALL USERS - Not Using///////////////////////
// app.get("/users", (req, res) => {
//   //console.log(req.session);
//   User.findAll({
//     attributes: ["id", "firstname", "lastname", "email", "username"],
//     include: [
//       {
//         model: Items,
//         attributes: ["location", "cost", "bywhen", "name"],
//       },
//     ],
//   }).then((users) => {
//     //console.log(users);
//     res.json(users);
//   });
// });


// //GET User ID//////////////////Not Using //////////////////////////////////////////////////
// app.get("/user/:id", (req, res) => {
//   if (isNaN(Number(req.params.id))) {
//     return res.json({ err: "id needs to be a number" });
//   }
//   User.findByPk(req.params.id, {
//     attributes: ["id", "firstname", "lastname", "email"],
//   })
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((err) => {
//       //console.log(err);
//       res.json({ err: "there was en error on the request" });
//     });
// });


// //Retrieve User by first or last name///////////////Not used///////////////////////////////
// app.post("/users/search", (req, res) => {
//   //console.log(req.session);
//   //console.log(req.params);
//   //console.log(req.query);
//   const { search } = req.body;
//   //console.log(search);

//   User.findAll({
//     attributes: ["id", "firstname", "lastname", "email", "age"],
//     where: {
//       [Op.or]: [
//         {
//           firstname: {
//             [Op.iLike]: "%" + search + "%",
//           },
//         },
//         {
//           lastname: {
//             [Op.iLike]: "%" + search + "%",
//           },
//         },
//       ],
//     },
//   }).then((user) => {
//     res.json(user);
//   });
// });

// DELETE USER//////////////////////////////////////////////////////
app.delete("/users/:id", (req, res) => {
  //console.log(req.session);
  User.destroy({
    where: {
      id: req.params.id,
    },
  }).then((results) => {
    //console.log(results);
    res.json({ success: true });
  });
});

//BUCKETLIST BACKEND//////////////////////////////////
//CREATE NEW ITEM - Connected///////////////////////////////////
app.post("/newitem", (req, res) => {
  //console.log(req.session);
  const { location, cost, bywhen, name, userId} = req.body;
  Items.create({
    location: location,
    cost: cost,
    bywhen: bywhen,
    name: name,
    userId: userId
  })
    .then((newItem) => {
      //console.log(newItem)
      res.json({ id: newItem.id });
    })
    .catch((err) => {
      //console.log(err);
      res.json({ err: "there was an error" });
    });
});

//FIND ALL Items - Connected///////////////////////////
app.get("/Items/:id", (req, res) => {
  //console.log(req.session);
  Items.findAll({
    attributes: ["id", "location", "cost", "bywhen", "name"],
    where: {
      userId: req.params.id,
    },
  }).then((users) => {
    //console.log(users);

    res.json(users);
  });
});


// //GET Items by LOCATION or BYWHEN////////////////////Not Used////////////////////////////////
// app.post("/items/search", (req, res) => {
//   //console.log(req.session);
//   //console.log(req.params);
//   //console.log(req.query);
//   const { search } = req.body;
//   //console.log(search);

//   Items.findAll({
//     attributes: ["id", "location", "cost", "bywhen", "name"],
//     where: {
//       [Op.or]: [
//         {
//           location: {
//             [Op.iLike]: "%" + search + "%",
//           },
//         },
//         {
//           bywhen: {
//             [Op.iLike]: "%" + search + "%",
//           },
//         },
//       ],
//     },
//   }).then((users) => {
//     res.json(users);
//   });
// });



//UPDATE Items Connected//////////////////////////////////////////////////////////////
app.put("/items/:id", (req, res) => {
  //console.log(req.session);
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
      //console.log(result);

      res.json({});
    })
    .catch((err) => {
      //console.log(err);

      res.json({ err: "Please Make Sure To Edit All Fields" });
    });
});

// DELETE ITEM Connected////////////////////////////////
app.delete("/items/:id", (req, res) => {
  console.log("TEST HERE");
  console.log(req.session);
  console.log(req.params.id)
  Items.destroy({
    where: {
      id: req.params.id,
    },
  }).then((results) => {
    //console.log(results);
    res.json({results});
  });
});


app.listen(3000, () => {
  //console.log("App has started on http://localhost:3000/");
});
