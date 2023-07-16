const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Employee = require("./models/employee.js");

// npm install express express-openid-connect --save
// npm i express-openid-connect dotenv

//create instance for auth0
const { auth } = require("express-openid-connect");
require("dotenv").config();

//configure auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
};

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));

//// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//connecting mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("mongodb connected");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/main.html");
});

app.get("/analysis", function (req, res) {
  res.sendFile(__dirname + "/views/analysis.html");
});

app.get("/gender-job", async function (req, res) {
  try {
    const peopleByGenderJob = await Employee.aggregate([
      {
        $group: {
          _id: {
            gender: "$gender",
            job_title: "$job_title",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.gender",
          jobs: {
            $push: {
              job_title: "$_id.job_title",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          jobs: {
            $map: {
              input: ["Associate", "Administrator", "Manager"], // Modify with your job titles
              as: "title",
              in: {
                job_title: "$$title",
                count: {
                  $ifNull: [
                    {
                      $let: {
                        vars: {
                          matchedJob: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$jobs",
                                  cond: {
                                    $eq: ["$$this.job_title", "$$title"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: "$$matchedJob.count",
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    res.json(peopleByGenderJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Define a route to retrieve the salary for each gender
app.get("/salary-by-gender", async (req, res) => {
  try {
    const salaryByGender = await Employee.aggregate([
      {
        $group: {
          _id: "$gender",
          salary: { $push: "$salary" },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          salary: 1,
        },
      },
    ]);

    res.json(salaryByGender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//update db using form
app.post("/form-db-update", (req, res) => {
  const empID = req.body.empId;
  const training = req.body.gotTraining;
  const career_dev = req.body.careerDev;
  const work_rel = req.body.workRelation;
  const sports = req.body.sports;
  const volunteer = req.body.volunteer;
  const webinars = req.body.webinar;

  Employee.findOneAndUpdate(
    { empID: empID }, // search query
    {
      $set: {
        training: training,
        career_dev: career_dev,
        work_rel: work_rel,
        sports: sports,
        volunteer: volunteer,
        webinars: webinars,
      },
    },
    { new: true, runValidators: true }
  )
    .then((doc) => {
      if (doc) {
        //   console.log(doc);
        res.status(200).send("Employee data updated successfully");
      } else {
        res.status(404).send("Employee not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating employee data");
    });
});

app.listen(80, function () {
  console.log("Your app is listening on port " + 80);
});
