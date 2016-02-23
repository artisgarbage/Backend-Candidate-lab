
var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var mongoOp     =   require("./models/mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
  res.json({"error" : false, "message" : "Hello Black & Red, Inc."});
});

router.route("/users")
  .get(function(req,res){
    var response = {};
    mongoOp.find({},function(err,data){
      if(err) {
        response = {"error" : true, "message" : "Error retrieving user data"};
      } else {
        response = {"error" : false, "message" : data};
      }
      res.json(response);
    });
  })
  .post(function(req,res){
    var db = new mongoOp();
    var response = {};

    db.usrEmail = req.body.email;
    // Base 64 hash password transmission
    db.usrPass = require('crypto')
      .createHash('sha1')
      .update(req.body.password)
      .digest('base64');
    db.save(function(err){
      if(err) {
        response = {"error" : true, "message" : "Error adding user data"};
      } else {
        response = {"error" : false, "message" : "User data added"};
      }
      res.json(response);
    });
  });

router.route("/users/:id")
  .get(function(req,res){
    var response = {};
    // Query users by ID
    mongoOp.findById(req.params.id,function(err,data){
      if(err) {
        response = {"error" : true, "message" : "Error retrieving user data for" + req.params.id};
      } else {
        response = {"error" : false, "message" : data};
      }
      res.json(response);
    });
  })
  .put(function(req,res){
    var response = {};
    mongoOp.findById(req.params.id,function(err,data){
      if(err) {
        response = {"error" : true,"message" : "Error retrieving user data for" + req.params.id};
      } else {
        // Update email
        if(req.body.userEmail !== undefined){
          data.userEmail = req.body.userEmail;
        }
        // Update PW
        if(req.body.userPassword !== undefined){
          data.userPassword = req.body.userPassword;
        }
        // Save record
        data.save(function(err){
          if(err) {
              response = {"error" : true, "message" : "Error updating user data for " + req.params.id};
          } else {
              response = {"error" : false, "message" : "User data is updated for " + req.params.id};
          }
          res.json(response);
        })
      }
    });
  });

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");