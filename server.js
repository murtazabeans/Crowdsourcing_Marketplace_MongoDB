var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require('fs');
var nodemailer = require('nodemailer');
var kafka = require('./kafka/client');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
var config = require('./src/config');

var LocalStrategy = require('passport-local').Strategy;
var mongodbStore = require('connect-mongo')(session);

app.use(passport.initialize());
app.use(passport.session());

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'murtazabeans@gmail.com',
    pass: 'hello@123'
  }
});

mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer");
var url = "mongodb://root:root@ds121665.mlab.com:21665/freelancer"

var User = require('./model/users');
var Project = require('./model/projects');
var Bid = require('./model/bids');

app.use(session({
  name: 'session', 
  store: new mongodbStore({mongooseConnection: mongoose.connection, touchAfter: 24 * 3600}), 
  secret: 'qwertyuiop123456789', 
  resave: false,
  saveUninitialized: false, 
  cookie: {maxAge: 1000 * 60 * 45}
}));

var port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', config.host + ":3000");
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

passport.serializeUser(function(user, done) {
  console.log(user.id);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user.id, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return console.log(err.message);
    }
    return done(null, user);
  })
});

passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
  var data = req.body;
  kafka.make_request('register_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows);
    var user = rows;
    console.log("in signup strategy")
    console.log(user);
    return done(null, user);
  })
}));

passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
  var data = req.body;
  kafka.make_request('login_topic', data, function(err, rows){
    if(err) throw (err);
      if(rows.length >= 1){ 
        var isPasswordCorrect = bcrypt.compareSync(req.body.password, rows[0].password);
        if(isPasswordCorrect){
          var user = rows[0]
          console.log(user);
          return done(null, user);
        }
        else{return done(null, false);  }
      }
      else{ return done(null, false); }
  });
}));

app.post('/check_email', function(request, response){
  data = request.body;
  kafka.make_request('check_email', data, function(err, rows){
    console.log('in check email response');  
    if (err) throw err;
    console.log(rows)
    rows.length >= 1 ? response.json({emailPresent: true}) :  response.json({emailPresent: false});  
  }); 
});

app.post('/signin', function(request, response){
  passport.authenticate('local-login', function(err, user, info) {
    if (err) throw (err);
    if (!user) {
      response.json({correctCredentials: false});
    }
    else{
      request.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
      });
      response.json({correctCredentials: true, rows: user});
    }
  })(request, response);
});

app.post('/signup', function(request, response){
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) throw (err);
    
    if (!user) {
      response.json({correctCredentials: false});
    }
    else{
      console.log("in signup method")
      console.log(user);
      request.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
      });
      response.json({rows: user});
    }
  })(request, response);
});

app.get('/check_session', function(request, response){
  console.log(request.session);
  var session_value = request.session.passport != undefined ? request.session.passport.user : request.session;
  response.json({session: session_value});
})

app.get('/destroy_session', function(request, response){
  request.logout();
  request.session.destroy();
  console.log("Session Dest")
  response.json({message: "Session Destroyed"});
});

app.get('/get_user', function(request, response){
  var data = request.query;
  kafka.make_request('get_user_values_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({correctCredentials: true, rows: rows[0]}) :  response.json({correctCredentials: false});
  });
});

app.get('/get_all_projects', function(request, response){
  kafka.make_request('get_all_projects', {}, function(err, rows){
    if (err) throw err;
    console.log("I am in session")
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  }); 
});

app.get('/get_relevant_projects', function(request, response){
  var data = request.query
  kafka.make_request('get_relevant_projects_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows)
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  }); 
});

app.post('/update_profile', function(request, response){
  var data = request.body;
  kafka.make_request('update_user_profile_topic', data, function(err, rows){
    console.log('in check email response');  
    if (err) throw err;
    response.json({message: "Profile Updated"})
  }); 
});

app.post('/create_project', function(req, res){
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {

    if(files.file != undefined){
      let { path: tempPath, originalFilename } = files.file[0];
      var fileName = + new Date() + originalFilename.replace(/\s/g, '');
      let copyToPath = "./src/project-file/" + fileName; 
      fs.readFile(tempPath, (err, data) => {
        if (err) throw err;
        fs.writeFile(copyToPath, data, (err) => {
          if (err) throw err;
          // delete temp image
          console.log(fields);
          fs.unlink(tempPath, () => {
          });
        });
      });
    }
    var name_of_file = fileName == undefined ? "" : fileName;
    fields["fileName"] = name_of_file;
    var data = {fields: fields};
    kafka.make_request('project_creation_topic', data , function(err, rows){
      if (err) throw err;
      res.json({message: "Project Created"});
    })
  });
});

app.get('/get_project_bids', function(request, response){
  var data = request.query;
  kafka.make_request('get_project_bids_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/get_project_detail', function(request, response){
  var data = request.query;
  kafka.make_request('get_project_detail_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows[0]}) :  response.json({data_present: false});
  })
});


app.post('/submit_bid', function(request, response){
  var data = request.body;
  kafka.make_request('bid_submission_topic', data, function(err, rows){
    if (err) throw err;
    response.json({bidCreated: true});
  })
});


app.post('/get_bids', function(request, response){
  var data = request.body;
  kafka.make_request('get_all_bids_for_calculation_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.post('/hire_user', function(request, response){
  var data = request.body;
  kafka.make_request('hire_user_topic', data, function(err, rows){
    if (err) throw err;
    response.json({message: "Free Lancer Hired"})
  })
});

app.get('/get_all_user_bid_projects', function(request, response){
  var data = request.query;
  kafka.make_request('get_user_bid_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/search_for_user_bid_projects', function(request, response){
  var data = request.query;
  kafka.make_request('search_for_user_bid_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/get_all_user_published_projects', function(request, response){
  var data = request.query;
  kafka.make_request('get_user_published_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/search_for_user_published_projects', function(request, response){
  var data = request.query;
  kafka.make_request('search_for_user_published_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/past_payments', function(request, response){
  var data = request.query;
  kafka.make_request('past_payments_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows);
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.post('/get-bid-value-for-user', function(request, response){
  var data = request.body;
  kafka.make_request('get_bid_value_of_user_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows.length)
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.post('/update_balance', function(request, response){
  var data = request.body;
  kafka.make_request('update_balance_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows.length)
    response.json({message: 'Balance Updated'});
  })
});

app.post('/make_payment', function(request, response){
  var data = request.body;
  kafka.make_request('make_payment_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows)
    response.json({insufficientBalance: rows[0].insufficientBalance, project_completed: rows[0].project_completed});
  })
});

app.post('/withraw_amount', function(request, response){
  var data = request.body;
  kafka.make_request('withraw_amount_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows);
    response.json({correctRequest: rows[0].correctRequest, balance: rows[0].balance});
  })
});

app.get('/get-user-name', function(request, response){
  var data = request.query;
  kafka.make_request('get_user_name_topic', data, function(err, rows){
    if (err) throw err;
    console.log(rows);
    rows.length >= 1 ? response.json({data_present: true, rows: rows[0]}) :  response.json({data_present: false});
  })
});

app.post('/upload-Image', function(req, response){
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    let { path: tempPath, originalFilename } = files.file[0];
    var fileType = originalFilename.split(".");
    console.log(fileType)
    let copyToPath = "./src/images/" + fields.user_id[0] + "." + fileType[fileType.length - 1];
    console.log(copyToPath);
    fs.readFile(tempPath, (err, data) => {
      if (err) throw err;
      fs.writeFile(copyToPath, data, (err) => {
        if (err) throw err;
        fs.unlink(tempPath, () => {
        });
        fields["image_name"] = fields.user_id[0] + "." + fileType[fileType.length - 1];
        var data = {fields};

        kafka.make_request('profile_image_upload_topic', data, function(err, rows){
          if (err) throw err;
          console.log(rows);
          response.json({message: 'Image Upload Success', fileType: fileType[fileType.length - 1]});
        })
      });
    });
  });
});

app.post('/upload-folder', function(req, response){
  console.log("hello")
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    let { path: tempPath, originalFilename } = files.file[0];
    var fileType = originalFilename.split(".");
    console.log(fileType)
    let copyToPath =  "./src/project-file/" + fields.project_id[0] + "." + fileType[fileType.length - 1];
    console.log(copyToPath);
    fs.readFile(tempPath, (err, data) => {
      if (err) throw err;
      fs.writeFile(copyToPath, data, (err) => {
        if (err) throw err;
        fs.unlink(tempPath, () => {
        });

        fields["folder_name"] = fields.project_id[0] + "." + fileType[fileType.length - 1];;
        var data = {fields};

        kafka.make_request('upload_project_folder_topic', data, function(err, rows){
          if (err) throw err;
          console.log(rows);
          response.json({message: 'Image Upload Success', fileType: fileType[fileType.length - 1]});
        })
      });
    });
  });
});

app.get('/search_projects', function(request, response){
  var data = request.query;
  kafka.make_request('search_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.get('/filter_all_projects', function(request, response){
  var data = request.query;
  kafka.make_request('filter_all_projects_topic', data, function(err, rows){
    if (err) throw err;
    rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  })
});

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});