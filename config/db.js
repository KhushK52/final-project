const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://team_members:cubstartProject2023@cluster0.5fw4mqz.mongodb.net/finalproject";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Successful database connection.");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;