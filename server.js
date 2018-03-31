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
var session = require('client-sessions');

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "free_lancer"
// });


mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer");
var url = "mongodb://root:root@ds121665.mlab.com:21665/freelancer"

var User = require('./model/users');
var Project = require('./model/projects');
var Bid = require('./model/bids');

// var pool =  mysql.createPool({
//   connectionLimit : 100,
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'free_lancer',
//   debug    :  false
// });


app.use(session({   
	cookieName: 'session',    
	secret: 'freelancer_session',    
	duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
  
var port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.post('/signup', function(request, response){
  var user = new User();
  console.log("Hello");
  console.log(user._id);

  User.create({id: user._id, name: request.body.name, password: request.body.password, email: request.body.email}, function(err, users){
    if (err) throw err;
    var query = User.find({email: request.body.email});
    query.exec(function(err, rows){
      if (err) throw err;
      request.session.name = rows[0].name;
      request.session.email = rows[0].email;    
      response.json({rows: rows[0]});
    })
  })
});

app.post('/signin', function(request, response){
  var query = User.find({email: request.body.email});
  query.exec(function(err, rows){
    if(rows.length >= 1)
    { 
      // // console.log(rows[0]);
      // isPasswordCorrect = rows[0].password == request.body.password;
      if(rows[0].password == request.body.password){
        request.session.name = rows[0].name;
        request.session.email = rows[0].email;
        console.log(request.session);
        response.json({correctCredentials: true, rows: rows[0]})
      }
      else{
        response.json({correctCredentials: false});
      }
    }
    else{
      response.json({correctCredentials: false});
    }
  })
});

app.get('/check_session', function(request, response){
  console.log(request.session);
  response.json({session: request.session});
})

app.get('/destroy_session', function(request, response){
  request.session.destroy();
  response.json({message: "Session Destroyed"});
});

app.get('/get_user', function(request, response){
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
    query = User.find({id: request.query.id})
    query.exec(function(err, rows){
      if(err) throw err;
      console.log(rows.length);
      rows.length >= 1 ? response.json({correctCredentials: true, rows: rows[0]}) :  response.json({correctCredentials: false});
    })
    // db.close();`
  })
});

app.get('/get_all_projects', function(request, response){
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
   db.collection('projects').aggregate([
     { $lookup:
         {
           from: 'users',
           localField: 'user_id',
           foreignField: 'id',
           as: 'users'
         }
       },
       {
         $lookup:
         {
           from: 'bids',
           localField: 'id',
           foreignField: 'project_id',
           as: 'bids'
         }
       },
        
     ]).toArray(function(err, rows) {
     if (err) throw err;
     console.log(JSON.stringify(rows));
     //db.close();
     rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
   });
 });
});

app.post('/update_profile', function(request, response){
  console.log("hello")
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
    var myquery = {id: request.body.id};
    var new_values = { $set: {email: request.body.email, name: request.body.name, skills: request.body.skills, about_me: request.body.about_me
      , phone_number: request.body.phone_number} };
    db.collection("users").updateOne(myquery, new_values, function(err, res) {
      console.log(res)
      if (err) throw err;
      response.json({message: "Profile Updated"})
    });
  })
});

app.post('/create_project', function(req, res){
  var project = new Project();
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
    console.log("creating")
    Project.create({id: project._id, title: fields.title[0], description: fields.description[0], skills_required: fields.skills_required[0], min_budget: fields.minimum_budget[0], 
      max_budget: fields.maximum_budget[0], user_id: fields.user_id[0], created_at: new Date().toLocaleString(), file_name: fileName}, function(err, users){
      if (err) throw err;
      console.log("done")
      res.json({message: "Project Created"});
    })
  });
});

app.get('/get_project_bids', function(request, response){
  console.log(request.query.s);
  mongoose.connect(url, function(err, db) {
    db.collection('bids').aggregate([
        {
          $lookup:
          {
            from: 'users',
            localField: 'user_id',
            foreignField: 'id',
            as: 'user'
          }
        },
        {
          $lookup:
          {
            from: 'projects',
            localField: 'project_id',
            foreignField: 'id',
            as: 'project'
          }
        },
        { $unwind:"$project" },
        { "$match": { "project_id": request.query.pid } },
        { $sort : { "price" : parseInt(request.query.s)} },
      ]).toArray(function(err, rows) {
      if (err) throw err;
      //db.close();
      console.log(rows);
      rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
    });
  });
});

app.get('/get_project_detail', function(request, response){
  mongoose.connect(url, function(err, db) {
    console.log(request.query.p_id)
    db.collection('projects').aggregate([
        {
          $lookup:
          {
            from: 'bids',
            localField: 'id',
            foreignField: 'project_id',
            as: 'bids'
          }
        },
        { "$match": { "id": request.query.p_id } },
      ]).toArray(function(err, rows) {
      if (err) throw err;
      console.log(JSON.stringify(rows));
      //db.close();
      rows.length >= 1 ? response.json({data_present: true, rows: rows[0]}) :  response.json({data_present: false});
    });
  });
});

app.post('/submit_bid', function(request, response){
  mongoose.connect(url, function(err, db) {
    var check_bid_query = Bid.find({user_id: request.body.user_id, project_id: request.body.project_id})
    check_bid_query.exec(function(err, rows){
      if(rows.length >=1 ){
        var myquery = { user_id : request.body.user_id, project_id: request.body.project_id };
        var newvalues = { $set: {number_of_days: request.body.no_of_days, price: request.body.price} };
        db.collection("bids").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
        });
      }
      else{
        var bid = new Bid()
        Bid.create({id: bid._id, project_id: request.body.project_id, user_id: request.body.user_id,  number_of_days: request.body.no_of_days, 
          created_at: new Date().toLocaleString(), price: request.body.price}, function(err, bids){
          if (err) throw err;
        })
      }
      db.collection("bids").aggregate([
        { "$match": { "project_id": request.body.project_id } },
      ]).toArray(function(err, rows) {
      if (err) throw err;
      console.log(rows);
      //db.close();
      rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
    });
    });
  });
});

app.post('/check_email', function(request, response){
  mongoose.connect(url, function(err, db) {
    var query = User.find({email: request.body.email});
    query.exec(function(err, rows){
      if(err) throw err;
      rows.length >= 1 ? response.json({emailPresent: true}) :  response.json({emailPresent: false});    
    });
  });
});

app.post('/hire_user', function(request, response){
  mongoose.connect(url, function(err, db) {
    var myquery = { user_id: request.body.free_lancer_id, project_id: request.body.p_id };
    var new_values = { $set: {status: 'Accepted'} };
    db.collection("bids").updateOne(myquery, new_values, function(err, res) {  if (err) throw err; });

    var myquery1 = { user_id: { $ne: request.body.free_lancer_id}, project_id: request.body.p_id };
    var new_values1 = { $set: {status: 'Rejected'} };
    db.collection("bids").update(myquery1, new_values1, function(err, res) {  if (err) throw err; });

    var accepted_bid = Bid.find({project_id: request.body.p_id, status: 'Accepted'});
    accepted_bid.exec(function(err, rows){
      if (err) throw err;
      var date = new Date();
      var update_query = {id: request.body.p_id};
      console.log(rows[0].number_of_days)
      var updated_values = { $set: {assigned_to: request.body.free_lancer_id, 
        date_of_completion: date.setDate(date.getDate() + parseInt(rows[0].number_of_days))} };
      console.log(updated_values)
      db.collection("projects").updateOne(update_query, updated_values, function(err, res) {  
        if (err) throw err;
        console.log("Inside")
        response.json({message: "Free Lancer Hired"})
      });
    });
  });
});

app.get('/get_all_user_bid_projects', function(request, response){
  mongoose.connect(url, function(err, db) {
    db.collection('projects').aggregate([
        {
          $lookup:
          {
            from: 'bids',
            localField: 'id',
            foreignField: 'project_id',
            as: 'bids'
          }
        },
        {
          $lookup:
          {
            from: 'users',
            localField: 'user_id',
            foreignField: 'id',
            as: 'employer'
          }
        },
        { $unwind:"$employer" },
        { "$match": { "bids.user_id": request.query.u_id } },
      ]).toArray(function(err, rows) {
      if (err) throw err;
      //db.close();
      console.log(rows);
      rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
    });
  });
  // pool.getConnection(function(err, connection){
  //   var sql = "select averageTable.avgDays, title, assigned_to, averageTable.project_id, X.number_of_days, c.name, c.id from" +
  //   " (select avg(b.number_of_days) as avgDays, p.title, b.project_id, p.assigned_to,p.user_id from Bid b,Project p where b.project_id=p.id group by p.id) " +
  //   "as averageTable, Bid X ,User c where X.project_id=averageTable.project_id and X.user_id='" + request.query.u_id + "' and averageTable.user_id =c.id";
  //   console.log(sql)
  //   connection.query(sql,function(err,rows){
  //     if(err) throw err;
  //     connection.release();      
  //     console.log(rows);
  //     rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
  //   });
  // });
});

app.get('/get_all_user_published_projects', function(request, response){
  mongoose.connect(url, function(err, db) {
    db.collection('projects').aggregate([
        {
          $lookup:
          {
            from: 'users',
            localField: 'assigned_to',
            foreignField: 'id',
            as: 'freelancer'
          }
        },
        {
          $lookup:
          {
            from: 'bids',
            localField: 'id',
            foreignField: 'project_id',
            as: 'bids'
          }
        },
        { "$match": { "user_id": request.query.u_id } },
      ]).toArray(function(err, rows) {
      if (err) throw err;
      //db.close();
      console.log(rows);
      rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
    });
  });
});

app.post('/get-bid-value-for-user', function(request, response){
  var query = Bid.find({user_id: request.body.user_id, project_id: request.body.project_id});
  query.exec(function(err, rows){
    if (err) throw err;
    console.log(rows);
    rows.length >= 1 ? response.json({data_present: true, rows: rows[0]}) :  response.json({data_present: false});
  })
});

app.get('/get-user-name', function(request, response){
  var query = User.find({id: request.query.id});
  query.exec(function(err, rows){
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
        mongoose.connect(url, function(err, db) {
          var myquery = {id: fields.user_id[0]};
          var new_values = { $set: {profile_image_name: fields.user_id[0] + "." + fileType[fileType.length - 1]} };
          db.collection("users").updateOne(myquery, new_values, function(err, res) {
            if (err) throw err;
            response.json({message: 'Image Upload Success', fileType: fileType[fileType.length - 1]});
          });
        });
      });
    });
  });
});

app.post('/upload-folder', function(req, response){
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
        mongoose.connect(url, function(err, db) {
          var myquery = {id: fields.project_id[0]};
          var new_values = { $set: {folder_name: fields.project_id[0] + "." + fileType[fileType.length - 1]} };
          db.collection("projects").updateOne(myquery, new_values, function(err, res) {
            if (err) throw err;
            response.json({message: 'Folder Uploaded Successfully', fileType: fileType[fileType.length - 1]});
          });
        });
      });
    });
  });
});

app.get('/search_projects', function(request, response){
  var a = '/This/i'.replace("'", "");
  console.log(a)
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
   db.collection('projects').aggregate([
     { $lookup:
         {
           from: 'users',
           localField: 'user_id',
           foreignField: 'id',
           as: 'users'
         }
       },
       {
         $lookup:
         {
           from: 'bids',
           localField: 'id',
           foreignField: 'project_id',
           as: 'bids'
         }
       },
       {$match: { $or: [{ 'title': { $regex:  request.query.val, $options: 'i'} }, { 'skills_required': { $regex:  request.query.val, $options: 'i'} }] }},
        
     ]).toArray(function(err, rows) {
     if (err) throw err;
    //db.close();
     rows.length >= 1 ? response.json({data_present: true, rows: rows}) :  response.json({data_present: false});
   });
 });
});

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});