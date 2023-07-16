const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    empID: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: Number,
    job_title: {
      type: String,
    },
    salary: {
      type: Number,
    },
    training: {
      type: String,
    },
    career_dev: {
      type: Number,
    },
    work_rel: {
      type: Number,
    },
    sports: {
      type: Number,
    },
    volunteer: {
      type: Number,
    },
    webinars: {
      type: Number,
    },
  });
  //   //creating a model and assiging it to a variable
let Employee = mongoose.model("Employee", employeeSchema);
module.exports = mongoose.model("Employee", employeeSchema);