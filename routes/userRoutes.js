const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Cars = require("../models/Cars");
const Car_credential = require("../models/Car_credential");
const { validate } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkAuth = require("../middelware/Auth");
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("user credential" + JSON.stringify(req.body));
    let user = await User.findOne({ email: email });
    console.log("user : " + JSON.stringify(user));
    if (user) {
      console.log("user if: " + JSON.stringify(user));
      return res
        .status(400)
        .json({ errors: [{ msg: "email already exsists" }] });
    }
    console.log("user 2: ");
    let username1 = await User.findOne({ name: name });
    if (username1) {
      return res
        .status(400)
        .json({ errors: [{ msg: "username already exsists" }] });
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const salt = await bcrypt.genSalt(10);
      console.log("salt : " + JSON.stringify(salt));
      // console.log("newSalt : " + JSON.stringify(newSalt))
      user.password = await bcrypt.hash(password, salt);
      console.log(user.password);
      await user.save();

      return res.send({
        data: {
          success: true,
          user: user,
        },
      });
    }
  } catch (err) {
    res.send(err.message);
  }
});

///////////////////////////////
router.get("/test", async (req, res) => {
  res.status(200).send({ message: "ITest successfull" });
});

///////////////////////////////
router.post("/login", async (req, res) => {
  console.log("cccccccccc");
  const { email, password } = req.body;
  console.log(req.body);

  try {
    let user = await User.findOne({ email: email });
    // if (error) {
    //     console.error(error);
    //     res.status(500).send({ message: 'Internal Server Error' });
    //     return;
    // }

    if (!user) {
      res.status(400).send({ message: "User not found" });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log("user" + JSON.stringify(user));
    console.log("token");
    if (!isValidPassword) {
      res.status(400).send({ message: "Invalid password" });
      return;
    }

    console.log("user" + user);
    if (user) {
      console.log("Authorized:");
      const token = jwt.sign(
        {
          username: user.name,
          email: user.email,
          password: user.password,
        },
        process.env.JWTSECRET,
        {
          expiresIn: "24h",
        }
      );
      console.log("token" + token);
      console.log("c" + process.env.JWTSECRET);

      await user.updateOne({ $set: { is_active: true } });

      return res.send({
        data: {
          success: true,
          user: user,
          token: token,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});

///////////////////////////////////search
router.get("/search/:name", async (req, res) => {
  console.log("in search route ");

  try {
    const { name } = req.params;
    console.log(req.params);
    //const regex = new RegExp(name, "i")
    //let username =await User.find({"key" : /.*LOYALTY_SERVICE_ENABLED.*/})

    let username = await User.find({ name: new RegExp(name, "i") });
    console.log("username" + JSON.stringify(username));
    if (!username) {
      res.status(400).send({ message: "name not found" });
      return;
    } else {
      return res.send({
        data: {
          success: true,
          allusers: username,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});
router.get("/active/user", checkAuth, async (req, res) => {
  console.log("cccccccccc");

  try {
    let active_user = req.body.user;
    console.log("name55" + JSON.stringify(req.body));
    // let abdul= checkAuth()
    //console.log("abdul"+JSON.stringify(abdul))
    // let username =await User.find({});
    //    console.log("username"+JSON.stringify(username))

    if (!active_user) {
      res.status(400).send({ message: "user not found" });
      return;
    } else {
      return res.send({
        data: {
          success: true,
          users: active_user,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});
//////////////////get all users
router.get("/", checkAuth, async (req, res) => {
  console.log("cccccccccc");

  try {
    let username = await User.find({});
    console.log("username" + JSON.stringify(username));

    if (!username) {
      res.status(400).send({ message: "user not found" });
      return;
    } else {
      return res.send({
        data: {
          success: true,
          allusers: username,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});

router.post("/cars", checkAuth, async (req, res) => {
  try {
    let car = new Cars({
      name: req.body.name,
    });
    console.log("cars" + car);
    await car.save();

    return res.send({
      data: {
        success: true,
        car: car,
      },
    });
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});
///////////////////////get cars
router.get("/getcars", checkAuth, async (req, res) => {
  try {
    let cars = await Cars.find({});
    if (!cars) {
      res.status(400).send({ message: "cars not found" });
      return;
    } else {
      return res.send({
        data: {
          success: true,
          car: cars,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});
// all_car_credential

///////////////////////////
router.post("/car_credential", checkAuth, async (req, res) => {
  try {
    let Car_credentia = new Car_credential({
      color: req.body.color,
      model: req.body.model,
      vehicle: req.body.model,
    });
    console.log("Car_credential" + Car_credentia);
    await Car_credentia.save();

    return res.send({
      data: {
        success: true,
        Car_credential: Car_credentia,
      },
    });
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});
///////
router.get("/all_car_credential", checkAuth, async (req, res) => {
  try {
    let cars = await Car_credential.find({});
    if (!cars) {
      res.status(400).send({ message: "cars not found" });
      return;
    } else {
      return res.send({
        data: {
          success: true,
          car: cars,
        },
      });
    }
  } catch (err) {
    console.log("in error");
    res.status(500).json({ data: { success: false, message: err.message } });
  }
});

module.exports = router;
