var express = require("express");
var app = express();

var mysql = require("mysql");
var bodyparser = require("body-parser");
var bcrypt = require("bcrypt");
var moment = require("moment");
const { application } = require("express");
const fs = require("fs");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "fruitful.grad@gmail.com",
    pass: "123456mr",
  },
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "",
  database: "fruitful",
});

const hostname = "192.168.1.110";
const port = "4008";
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

con.connect(function (error) {
  if (error) console.log(error);
  else console.log("connected");
});
//----------------------------------------------------SignUp
app.post("/signup", function (req, res) {
  var emailsign = req.body.emailsign;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var passwordsign = req.body.passwordsign;
  var confirmpass = req.body.confirmpass;
  var age = req.body.age;
  var weight = req.body.weight;
  var height = req.body.height;
  var gender = req.body.gender;
  var country = req.body.country;
  if (gender == 0) {
    gender = "Male";
  } else gender = "Female";

  if (
    emailsign &&
    firstname &&
    lastname &&
    username &&
    passwordsign &&
    confirmpass &&
    age &&
    weight &&
    height &&
    gender &&
    country
  ) {
    bcrypt.hash(passwordsign, 10, function (error, hash) {
      con.query(
        "SELECT * FROM users where email=?",
        [emailsign],
        function (error, row) {
          if (row.length > 0) {
            res.send({ message: "This email already exists" });
          } else {
            con.query(
              "SELECT * FROM users where username=?",
              [username],
              function (error, row) {
                if (row.length > 0) {
                  res.send({ message: "This username already exists" });
                } /*else {
                  var sql =
                    "INSERT INTO users (username,password,email,firstname,lastname,age,gender,weight,height,country,target,weeks,calories,activity) VALUES ?";
                  var values = [
                    [
                      username,
                      hash,
                      emailsign,
                      firstname,
                      lastname,
                      age,
                      gender,
                      weight,
                      height,
                      country,
                      "0",
                      "0",
                      "0",
                      "",
                    ],
                  ];
                  con.query(sql, [values], function (error, row) {
                    if (error) throw error;
                    res.send({
                      success: true,
                      message: "Welcome to fruitful Application",
                    });
                  });
                }*/ else {
                  res.send({
                    success: true,
                    message: "Welcome to fruitful Application",
                  });
                }
              }
            );
          }
        }
      );
    });
  } else {
    res.send({
      message: "Please fill all the fields",
    });
  }
});

//----------------------------------------------------Login
app.post("/login", function (req, res) {
  var email = req.body.email; //value from textfield
  var password = req.body.password; //value from textfield
  if (email && password) {
    // if user fill all text input
    con.query(
      "SELECT * FROM users where username=? OR email=?", //update
      [email, email],
      function (error, row) {
        if (row.length < 1) {
          res.send({
            success: false,
            message: "Incorrect Email and/or Password!",
          });
        } else if (bcrypt.compareSync(password, row[0].password)) {
          if (row[0].activity == "Extremely Active")
            res.send({
              success: true,
              user: row[0].username,
              level: 5,
              cal: row[0].calories,
              startDate: row[0].start,
              endDate: row[0].end,
              weeks: row[0].weeks,
              lastname: row[0].lastname,
              firstname: row[0].firstname,
              gender: row[0].gender,
            });
          else if (row[0].activity == "Very Active")
            res.send({
              success: true,
              user: row[0].username,
              level: 4,
              cal: row[0].calories,
              startDate: row[0].start,
              endDate: row[0].end,
              weeks: row[0].weeks,
              lastname: row[0].lastname,
              firstname: row[0].firstname,
              gender: row[0].gender,
            });
          else if (row[0].activity == "Moderately Active")
            res.send({
              success: true,
              user: row[0].username,
              level: 3,
              cal: row[0].calories,
              startDate: row[0].start,
              endDate: row[0].end,
              weeks: row[0].weeks,
              lastname: row[0].lastname,
              firstname: row[0].firstname,
              gender: row[0].gender,
            });
          else if (row[0].activity == "Lightly Active")
            res.send({
              success: true,
              user: row[0].username,
              level: 2,
              cal: row[0].calories,
              startDate: row[0].start,
              endDate: row[0].end,
              weeks: row[0].weeks,
              lastname: row[0].lastname,
              firstname: row[0].firstname,
              gender: row[0].gender,
            });
          else if (row[0].activity == "  Sedentary")
            res.send({
              success: true,
              user: row[0].username,
              level: 1,
              cal: row[0].calories,
              startDate: row[0].start,
              endDate: row[0].end,
              weeks: row[0].weeks,
              lastname: row[0].lastname,
              firstname: row[0].firstname,
              gender: row[0].gender,
            });
        } else {
          res.send({
            success: false,
            message: "Incorrect Email and/or Password!",
          });
        }
      }
    );
  } else {
    res.send({ message: "Please enter Username and Password!" });
    res.end();
  }
});
//-----------------------------target------------------------------
app.post("/target", function (req, res) {
  var emailsign = req.body.emailsign;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var passwordsign = req.body.passwordsign;
  var age = req.body.age;
  var weight = req.body.weight;
  var height = req.body.height;
  var gender = req.body.gender;
  var country = req.body.country;
  var w = req.body.w;
  var period = req.body.period;
  var calories = req.body.calories;
  var activity = req.body.valueactivity;
  //--------------------------
  var start = moment(new Date()).format("YYYY-MM-DD");
  var end = moment(new Date()).add(period, "w").format("YYYY-MM-DD");
  //-------------------------
  if (gender == 0) {
    gender = "Male";
  } else gender = "Female";
  if (activity == 1) {
    activity = "Sendentary";
  } else if (activity == 2) {
    activity = "Lightly Active";
  } else if (activity == 3) {
    activity = "Moderately Active";
  } else if (activity == 4) {
    activity = "Very Active";
  } else if (activity == 5) {
    activity = "Extremely Active";
  }

   
      bcrypt.hash(passwordsign, 10, function (error, hash) {
        var sql =
          "INSERT INTO users (username,password,email,firstname,lastname,age,gender,weight,height,country,target,weeks,calories,activity,start,end) VALUES ?";
        var values = [
          [
            username,
            hash,
            emailsign,
            firstname,
            lastname,
            age,
            gender,
            weight,
            height,
            country,
            w,
            period,
            calories,
            activity,
            start,
            end,
          ],
        ];
        con.query(sql, [values], function (error, row) {
          if (error) res.send({message:error});
          res.send({
            success: true,
            message: "Welcome to Fruitful Application",
            startDate: start,
            endDate: end,
            firstname: firstname,
            lastname: lastname,
          });
        });
      });
});


//--------------------------------------------------------------------------------------------
app.get("/users", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT * FROM users where username = ?",
    [req.query.user],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});
//-----------------------Search Ingredients in recipe Screen-------------------------------------
app.get("/searchIngredients", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    //"SELECT * FROM ingredients where name like '%" + req.query.name + "%' ",
    "SELECT * FROM ingredients ",
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});
//---------------------------- show Ingredients in recipes screen ----------------------------------
app.get("/searchRecipes", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT * FROM recipes ORDER BY name ",
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});

//---------------------------- show meal type in filter in recipes screen ----------------------------------
app.get("/filtermeal", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT DISTINCT meal FROM recipes ORDER BY meal ",
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});
//------------------------------------------add to shopping list recipes screen--------------------------------------
app.post("/shoppinglist", function (req, res) {
  var user = req.body.user;
  var name = req.body.name;
  var type = req.body.type;
  var sql = "INSERT INTO shoppinglist (username,name,type) VALUES ?";
  var values = [[user, name, type]];
  con.query(sql, [values], function (error, row) {
    if (error) throw error;
    res.send({
      success: true,
      message: "Added successfully to your shopping list",
      data: row,
    });
  });
});
//---------------------------------------------
app.get("/ifIngredientInshoppingList", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT * FROM shoppinglist where username = ? AND type=?",
    [req.query.user, "ingredient"],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results);
    }
  );
});
//-----------------------Search barCode by number in ScanScreen-------------------------------------
app.get("/barCode", function (req, res) {
  con.query(
    //"SELECT * FROM ingredients where name like '%" + req.query.name + "%' ",
    "SELECT * FROM productscan ",
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//-----------------------Filter Meal Calories in recipes screen
app.get("/filterMealCalorieseE", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  /*let stringifiedValues = JSON.stringify(req.query.checkboxfilter).replace(
    /\[|\]/g,
    ""
  );*/

  //let injectedString = req.query.checkboxfilter.map((c) => `'${c}'`).join(", ");
  /*let a = [];
  a = req.query.checkboxfilter;*/
  con.query(
    "SELECT * FROM recipes where meal IN ('" +
      req.query.checkboxfilter +
      "') AND calories >= ? AND calories <= ?",
    [req.query.minDB, req.query.maxDB],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});
//------------------------------------req barcode in scan screen
/*app.post("/sendreqBarcode", function (req, res) {
  var barcode = req.body.barcode;
  var img1 = req.body.img1;
  var img2 = req.body.img2;
  var username = req.body.username;
  var sql = "INSERT INTO reqbarcode (username,barcode,img1,img2) VALUES ?";
  var values = [[username, barcode, img1, img2]];
  con.query(sql, [values], function (error, row) {
    if (error) throw error;
    res.send({
      success: true,
      message: "Thank you. We will answer your request as soon as possible",
    });
  });
});
*/
app.post("/sendreqBarcode", (req, res) => {
  fs.writeFile(
    "C:/xampp/htdocs/Admin/assets/" + req.body.name1 + ".png",
    req.body.img1,
    "base64",
    (err) => {
      if (err) throw err;
      else {
        res.send({
          success: true,
        });
      }
    }
  );
});

//-----------------------------------------
app.post("/sendreqBarcode2", (req, res) => {
  fs.writeFile(
    "C:/xampp/htdocs/Admin/assets/" + req.body.name2 + ".png",
    req.body.img2,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );
  var sql = "INSERT INTO reqbarcode (username,barcode,img1,img2) VALUES ?";
  var values = [
    [
      req.body.username,
      req.body.barcode,
      req.body.name1 + ".png",
      req.body.name2 + ".png",
    ],
  ];
  con.query(sql, [values], function (error, row) {
    if (error) throw error;
    res.send({
      success: true,
      message: "Thank you. We will answer your request as soon as possible",
    });
  });
});
//-----------------------------Add to favourites
app.post("/favourites", function (req, res) {
  var user = req.body.user;
  var name = req.body.name;
  var type = req.body.type;
  var img = req.body.image;
  var sql = "INSERT INTO favourite (username,name,type,image) VALUES ?";
  var values = [[user, name, type, img]];
  con.query(sql, [values], function (error, row) {
    if (error) throw error;
    res.send({
      success: true,
      message: "Added successfully to favourites",
      data: row,
    });
  });
});
//---------------------------------------------
app.get("/existsInFav", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT * FROM favourite where username = ? AND type=?",
    [req.query.user, req.query.type],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results);
    }
  );
});
//-------------------------------get recipes for home page-----------------------------
app.get("/recipes", function (req, res) {
  // Connecting to the database.
  // Executing the MySQL query (select all data from the 'users' table).
  con.query(
    "SELECT * FROM recipes where meal=? and calories >= ? and calories <= ? and name != ? and name != ? order by rand()",
    [
      req.query.meal,
      req.query.cal1,
      req.query.cal2,
      req.query.name1,
      req.query.name2,
    ],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results);
    }
  );
});

//------------------------------------------get recipes details-------------------------------------
app.get("/meals", function (req, res) {
  con.query(
    "SELECT * FROM recipes where name=? and meal=?",
    [req.query.name, req.query.meal],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results);
    }
  );
});
//------------------------------------------get Workouts for home page--------------------------------------
app.get("/workout", function (req, res) {
  con.query(
    "SELECT * FROM workouts where level=? order by rand()",
    [req.query.level],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------get trainings details-------------------------------------
app.get("/training", function (req, res) {
  con.query(
    "SELECT * FROM workouts where name=? ",
    [req.query.name],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

//------------------------------------------get Exercises-------------------------------------
app.get("/exercises", function (req, res) {
  con.query(
    "SELECT * FROM workouts where body_part like ?",
    [req.query.part],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//----------------------------------get prev day calories-------------------------------
app.get("/track", function (req, res) {
  con.query(
    "SELECT * FROM tracking where user=? and day=?",
    [req.query.user, req.query.day],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//---------------------------------- prevent repetition -------------------------------
app.post("/remove", function (req, res) {
  var day1 = req.body.day1;
  var day2 = req.body.day2;
  var username = req.body.user;

  if (day2 == 0) {
    con.query(
      "SELECT * FROM meals where user=? and day=?",
      [username, day1],
      function (error, row) {
        if (row.length > 0) {
          res.send({
            breakfast1: row[0].breakfast,
            lunch1: row[0].lunch,
            dinner1: row[0].dinner,
            snacks1: row[0].snacks,
            breakfast2: "none",
            lunch2: "none",
            dinner2: "none",
            snacks2: "none",
          });
        }
      }
    );
  } else {
    con.query(
      "SELECT * FROM meals where user=? and (day=? or day=?)",
      [username, day1, day2],
      function (error, row) {
        if (row.length > 0) {
          res.send({
            breakfast1: row[0].breakfast,
            lunch1: row[0].lunch,
            dinner1: row[0].dinner,
            snacks1: row[0].snacks,
            breakfast2: row[1].breakfast,
            lunch2: row[1].lunch,
            dinner2: row[1].dinner,
            snacks2: row[1].snacks,
          });
        }
      }
    );
  }
});
//---------------------------------- insert into tracking and meals tables -------------------------------
app.post("/insert", function (req, res) {
  var total = req.body.total;
  var day = req.body.day;
  var cal = req.body.cal;
  var username = req.body.user;
  var flag = req.body.flag;
  var breakfast = req.body.breakfast;
  var lunch = req.body.lunch;
  var dinner = req.body.dinner;
  var snacks = req.body.snacks;
  var ex1 = req.body.ex1;
  var ex2 = req.body.ex2;
  var ex3 = req.body.ex3;

  con.query(
    "INSERT INTO meals (user, day, actualCal, breakfast, lunch, dinner, snacks ,ex1, ex2, ex3) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [username, day, cal, breakfast, lunch, dinner, snacks, ex1, ex2, ex3],
    function (error, row) {
      if (error) throw error;
    }
  );

  con.query(
    "INSERT INTO tracking (user, day, calories, extra, ex1, ex2, ex3, done, additional) VALUES (?,?,?,?,?,?,?,?,?)",
    [username, day, total, req.body.extra, 0, 0, 0, flag, 0],
    function (error, row) {
      if (error) throw error;
    }
  );
});
//---------------------------------- insert into records table -------------------------------
app.post("/activity", function (req, res) {
  var username = req.body.user;
  var date = req.body.date;
  var time = req.body.time;

  con.query(
    "INSERT INTO records (user, date, time) VALUES (?,?,?)",
    [username, date, time],
    function (error, row) {
      if (error) throw error;
    }
  );
});
//------------------------------------------get last seen------------------------------------
app.get("/last", function (req, res) {
  con.query(
    "SELECT * FROM records where date=? and user=?",
    [req.query.date, req.query.user],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------get meals if not first time------------------------------------
app.get("/today", function (req, res) {
  con.query(
    "SELECT * FROM meals where user=? and day=?",
    [req.query.user, req.query.day],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------update if not play------------------------------------
app.put("/update", function (req, res) {
  var sql;

  if (req.body.num == 1) {
    sql =
      "UPDATE tracking set ex1=?, done=?, additional=additional+?  where user=? and day=?";
  } else if (req.body.num == 2) {
    sql =
      "UPDATE tracking set ex2=?, done=?, additional=additional+?  where user=? and day=?";
  } else if (req.body.num == 3) {
    sql =
      "UPDATE tracking set ex3=?, done=?, additional=additional+?  where user=? and day=?";
  }
  con.query(
    sql,
    [req.body.ex, "no", req.body.additional, req.body.user, req.body.day],
    function (error, results, fields) {
      if (error) throw error;
    }
  );
});
//------------------------------------------update when change meal------------------------------------
app.put("/update2", function (req, res) {
  var sql;
  if (req.body.type == "Breakfast") {
    sql = "UPDATE meals set actualCal=?, breakfast=? where user=? and day=?";
  } else if (req.body.type == "Lunch") {
    sql = "UPDATE meals set actualCal=?,lunch=? where user=? and day=?";
  } else if (req.body.type == "Dinner") {
    sql = "UPDATE meals set actualCal=?,dinner=?  where user=? and day=?";
  } else if (req.body.type == "Snacks") {
    sql = "UPDATE meals set actualCal=?, snacks=?  where user=? and day=?";
  }
  con.query(
    sql,
    [req.body.newc, req.body.name, req.body.user, req.body.day],
    function (error, results, fields) {
      if (error) res.send({ msg: error });
      else res.send({ msg: "updated" });
    }
  );
});
//---------------------------------- insert into my recipe -------------------------------
app.post("/ownRecipe", function (req, res) {
  var username = req.body.user;
  var day = req.body.day;
  var type = req.body.type;
  var ing = req.body.ing;
  var pic = req.body.pic;
  var cal = req.body.cal;
  var amount = req.body.amount;
  var unit = req.body.unit;

  con.query(
    "INSERT INTO myrecipe (user, day, type, ingredients, pic, cal, amount, unit) VALUES (?,?,?,?,?,?,?,?)",
    [username, day, type, ing, pic, cal, amount, unit],
    function (error, row) {
      if (error) throw error;
    }
  );
});
//------------------------------------------update when add new meal------------------------------------
app.put("/Uptrack", function (req, res) {
  var sql;

  sql =
    "UPDATE tracking set calories=?,done=?, additional=additional+? where user=? and day=?";

  con.query(
    sql,
    [
      req.body.cal,
      req.body.done,
      req.body.additional,
      req.body.user,
      req.body.day,
    ],
    function (error, results, fields) {
      if (error) res.send({ msg: error });
      else res.send({ msg: "updated" });
    }
  );
});

//------------------------------------------get my recipe------------------------------------
app.get("/myrecipe", function (req, res) {
  con.query(
    "SELECT * FROM myrecipe where user=? and day=? and type=?",
    [req.query.user, req.query.day, req.query.type],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------get barcodes------------------------------------
app.get("/barcode", function (req, res) {
  con.query("SELECT * FROM productscan", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});
//------------------------------------------Circle in profile screen------------------------------------
app.get("/Circle", function (req, res) {
  con.query(
    "SELECT * FROM tracking where user=?",
    [req.query.user],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------virefy pass in profile screen------------------------------------
app.post("/verify", function (req, res) {
  var user = req.body.user; //value from textfield
  var password = req.body.password; //value from textfield

  // if user fill all text input
  con.query(
    "SELECT * FROM users where username=? ", //update
    [user],
    function (error, row) {
      if (bcrypt.compareSync(password, row[0].password)) {
        res.send({
          success: true,
        });
      } else {
        res.send({
          success: false,
          message: "Wrong password.Try again",
        });
      }
    }
  );
});
//-------------------------------------------------save changed pass in profile screen
app.put("/savepass", function (req, res) {
  var user = req.body.user;
  var passwordsign = req.body.password;

  bcrypt.hash(passwordsign, 10, function (error, hash) {
    var sql = "UPDATE users set password=? where username=?";
    con.query(sql, [hash, user], function (error, row) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Updated Successfuly",
        });
    });
  });
});
//----------------------------------------------shopping list in shopping screen
app.get("/shoppinglistScreen", function (req, res) {
  con.query(
    "SELECT * FROM shoppinglist where username=? AND type like ? ",
    [req.query.username, req.query.type],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//----------------------------------------------
//----------------------------------------------delete from shopping list in shopping screen
app.delete("/deleteshoppinglist", function (req, res) {
  con.query(
    "DELETE  FROM shoppinglist where username=? AND name=? AND type like ?  ",
    [req.body.user, req.body.name, req.body.type],
    function (error, results, fields) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Deleted Successfuly",
        });
    }
  );
});
//---------------------------------------favourite in fav screen
app.get("/Fav", function (req, res) {
  con.query(
    "SELECT * FROM favourite where username=? AND type like ? ",
    [req.query.username, req.query.type],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//---------------------------------------- get recipe that match the pressed recipe in fav
app.get("/allRecipes", function (req, res) {
  con.query(
    "SELECT * FROM recipes where name=?  ",
    [req.query.name],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//----------------------------------------------delete from fav in fav screen
app.delete("/deleteFav", function (req, res) {
  con.query(
    "DELETE  FROM favourite where username=? AND name=? AND type like ?  ",
    [req.body.user, req.body.name, req.body.type],
    function (error, results, fields) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Deleted Successfuly",
        });
    }
  );
});
//---------------------------------------------------Reset plan in Reset screen
app.put("/reset", function (req, res) {
  var user = req.body.username;
  var age = req.body.age;
  var weight = req.body.weight;
  var height = req.body.height;
  var w = req.body.w;
  var period = req.body.period;
  var calories = req.body.calories;
  var activity = req.body.valueactivity;
  //--------------------------
  var start = moment(new Date()).format("YYYY-MM-DD");
  var end = moment(new Date()).add(period, "w").format("YYYY-MM-DD");
  //-------------------------
  if (activity == 1) {
    activity = "Sendentary";
  } else if (activity == 2) {
    activity = "Lightly Active";
  } else if (activity == 3) {
    activity = "Moderately Active";
  } else if (activity == 4) {
    activity = "Very Active";
  } else if (activity == 5) {
    activity = "Extremely Active";
  }

  var sql =
    "UPDATE users set age=? ,weight=?,height=?,target=?,weeks=?,calories=?,activity=?,start=?,end=? where username=?";
  con.query(
    sql,
    [age, weight, height, w, period, calories, activity, start, end, user],
    function (error, row) {
      if (error) throw error;
      res.send({
        success: true,
        message: "Welcome to Fruitful Application",
        startDate: start,
        endDate: end,
      });
    }
  );
});
//----------------------------------------------------DELETE tracking and records and meals and myrecipe table in reset screen
app.delete("/deleteFORreset", function (req, res) {
  con.query(
    "DELETE FROM records where user=?  ",
    [req.body.username],
    function (error, results, fields) {
      if (error) throw error;
      else {
        con.query(
          "DELETE FROM meals where user=?  ",
          [req.body.username],
          function (error, results, fields) {
            if (error) throw error;
            else {
              con.query(
                "DELETE FROM tracking where user=?  ",
                [req.body.username],
                function (error, results, fields) {
                  if (error) throw error;
                  else {
                    con.query(
                      "DELETE FROM myrecipe where user=?  ",
                      [req.body.username],
                      function (error, results, fields) {
                        if (error) throw error;
                        else {
                          con.query(
                            "DELETE FROM finished where user=?  ",
                            [req.body.username],
                            function (error, results, fields) {
                              if (error) throw error;
                              else {
                                res.send({
                                  success: true,
                                  message: "Deleted Successfuly",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
//------------------------------------------------------todayCalories in todayCalories screen
app.get("/todayCalories", function (req, res) {
  con.query(
    "SELECT * FROM meals where user=?  ",
    [req.query.user],
    function (error, row, fields) {
      if (error) throw error;
      res.send(row[row.length - 1]);
    }
  );
});
//------------------------------------------------------
app.get("/trainingToday", function (req, res) {
  con.query(
    "SELECT * FROM workouts where name =? OR name =? OR name=?",
    [req.query.ex1, req.query.ex2, req.query.ex3],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//-----------------------------------------------------
//------------------------------------------------------
app.get("/recipesToday", function (req, res) {
  con.query(
    "SELECT * FROM recipes where name =? OR name =? OR name=? OR name=? ORDER BY meal",
    [req.query.m1, req.query.m2, req.query.m3, req.query.m4],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//-----------------------------------------------------
//------------------------------------------get locations------------------------------------
app.get("/map", function (req, res) {
  con.query("SELECT * FROM map", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});
//---------------------------- show level in filter in training screen ----------------------------------
app.get("/filterlevel", function (req, res) {
  con.query(
    "SELECT DISTINCT level FROM workouts ORDER BY level",
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//-----------------------Filter works Calories in ttraining screen
app.get("/filterlevelCalorie", function (req, res) {
  con.query(
    "SELECT * FROM workouts where level IN ('" +
      req.query.level +
      "') AND calories >= ? AND calories <= ?",
    [req.query.minDB, req.query.maxDB],
    function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.

      res.send(results);
      console.log(results);
    }
  );
});
//------------------------------------------ get notifications ------------------------------------
app.get("/notifi", function (req, res) {
  con.query("SELECT * FROM notifications", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});
//------------------------------------------ insert finished users ------------------------------------
app.post("/finished", function (req, res) {
  var username = req.body.user;

  con.query(
    "INSERT INTO finished (user) VALUES (?)",
    [username],
    function (error, row) {
      if (error) throw error;
    }
  );
});
//------------------------------------------ Check if finished ------------------------------------
app.get("/IFfinished", function (req, res) {
  con.query(
    "SELECT * FROM finished where user = ?",
    [req.query.user],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------update when extendCycle------------------------------------
app.put("/extendCycle", function (req, res) {
  var sql;
  sql = "UPDATE users set end=? where username=?";

  con.query(
    sql,
    [req.body.end, req.body.user],
    function (error, results, fields) {
      if (error) res.send({ msg: error });
      else res.send({ msg: true });
    }
  );
});
//------------------------------------------------------------------------------
app.get("/records", function (req, res) {
  con.query(
    "SELECT * FROM records where user = ?",
    [req.query.user],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//-----------------------------------------------------------------------------
app.get("/tracking", function (req, res) {
  con.query(
    "SELECT * FROM tracking where user = ?",
    [req.query.user],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});
//------------------------------------------update first day and last day------------------------------------
app.put("/notFirstDay", function (req, res) {
  var sql;
  sql = "UPDATE users set start=?, end=? where username=?";

  con.query(
    sql,
    [req.body.start, req.body.end, req.body.user],
    function (error, results, fields) {
      if (error) res.send({ msg: error });
      else res.send({ msg: true });
    }
  );
});
//------------------------------------------notifyuser------------------------------------
app.get("/notifyuser", function (req, res) {
  var sql;
  sql = "SELECT * FROM notifyuser where username=?";

  con.query(sql, [req.query.username], function (error, results, fields) {
    if (error) res.send({ msg: error });
    else res.send(results);
  });
});
//------------------------------deletenotify
app.delete("/deletenotify", function (req, res) {
  con.query(
    "DELETE  FROM notifyuser where username=? and msg=?  ",
    [req.body.user, req.body.msg],
    function (error, results, fields) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Deleted Successfuly",
        });
    }
  );
});


//-------------------------------resert password
app.post("/resetpass", function (req, res) {
  const email = req.body.email;
  const code = req.body.code;
  
  let mailOptions = {
    from: "fruitful Health",
    to: email,
    subject: "Reset Password ",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account in Fruitful application.\n\n" +
      "Please use this code to reset your password \n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n\n" +
      "Code:" +
      code,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send({message: error+" "});
    } else {
      var sql = "INSERT INTO resetpass (email,code) VALUES ?";
      var values = [[email, code]];
      con.query(sql, [values], function (error, row) {
        if (error) throw error;
        res.send({
          success: true,
          message: "Thank you. We will answer your request as soon as possible",
        });
      });
    }
  });
});
//--------------------------------------check email FOR resetPass in Passreset screen
app.post("/checkemailFORresetPass", function (req, res) {
  var email = req.body.email; //value from textfield

  // if user fill all text input
  con.query(
    "SELECT * FROM users where email=?", //update
    [email],
    function (error, row) {
      if (row.length < 1) {
        res.send({
          success: false,
          message: "Incorrect Email",
        });
      } else {
        res.send({
          success: true,
          message: "yes",
        });
      }
    }
  );
});
//--------------------------------------- reset pass verify

app.post("/resetpassverify", function (req, res) {
  var email = req.body.email; //value from textfield
  var codeuser = req.body.codeuser;
  // if user fill all text input
  con.query(
    "SELECT * FROM resetpass where email=?", //update
    [email],
    function (error, row) {
      if (row[0].code == codeuser) {
        res.send({
          success: true,
          message: "yes",
        });
      } else {
        res.send({
          success: false,
          message: "Incorrect Code",
        });
      }
    }
  );
});
//--------------------------------------------------------reset pass delete
app.delete("/resetpassdelete", function (req, res) {
  con.query(
    "DELETE  FROM resetpass where email=? ",
    [req.body.email],
    function (error, results, fields) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Deleted Successfuly",
        });
    }
  );
});
//---------------------------------------------------------update resetpass

app.put("/updateresetpass", function (req, res) {
  var email = req.body.email;
  var passwordsign = req.body.password;

  bcrypt.hash(passwordsign, 10, function (error, hash) {
    var sql = "UPDATE users set password=? where email=?";
    con.query(sql, [hash, email], function (error, row) {
      if (error) throw error;
      else
        res.send({
          success: true,
          message: "Updated Successfuly now you can go and login again",
        });
    });
  });
});
//---------------------------------------------------------