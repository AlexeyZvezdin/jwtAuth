const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //  VALIDATE THE DATA BEFORE WE A USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user is already in the databasae

  // prettier-ignore
  const emailExist = await User.findOne({email: req.body.email});
  if (emailExist) return res.status(400).send("Email already exist");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  //  Create a user
  const user = new User(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    () => {
      console.log("Pended");
    }
  );
  try {
    const savedUser = await user.save();
    res.send({ user: user.id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exist
  // prettier-ignore
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send("Email is invalid");

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //  Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  // res.send("Loggen in!");
});

module.exports = router;
