// BUILD YOUR SERVER HERE
const User = require("./users/model");
const express = require("express");

//EXPRESS INSTANCE
const server = express();

module.exports = server; // EXPORT YOUR SERVER instead of {}

//MIDDLEWARE
server.use(express.json());

//ENDPOINTS
// POST
server.post("/api/users", async (req, res) => {
  try {
    const userFromClient = req.body;
    if (!userFromClient.name || !userFromClient.bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      const newUser = await User.insert(userFromClient);
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the user to the database",
      message: error.message,
      stack: error.stack,
    });
  }
});

//Get All
server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      console.log("users", users);
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The users information could not be retrieved",
        message: error.message,
        stack: error.stack,
      });
    });
});

// Get By ID
server.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: "The user with the specified ID does not exist",
      });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({
      error: "The user information could not be retrieved",
      message: error.message,
      stack: error.stack,
    });
  }
});

// DELETE
server.delete("/api/users/:id", (req, res) => {
  User.remove(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404)({
          message: "The user with the specified ID does not exist",
        });
      } else {
        res.json(deletedUser);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "The user could not be removed",
        message: error.message,
        stack: error.stack,
      });
    });
});

// PUT!!
server.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    const updatedUser = await User.update(id, { name, bio });

    if (!updatedUser.id) {
      res.status(404).json({
        message: "The user with the specified ID does not exist",
      });
    } else if (!updatedUser.name || !updatedUser.bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({
      error: "The user information could not be modified",
      message: error.message,
      stack: error.stack,
    });
  }
});
