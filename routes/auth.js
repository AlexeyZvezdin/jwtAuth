const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { registerValidation } = require("../validation");

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

router.post("/login");

module.exports = router;
