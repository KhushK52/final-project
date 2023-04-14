const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  }
});

// export model task with TaskSchema
module.exports = mongoose.model("Task", TaskSchema);
