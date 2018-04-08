var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
var url = "mongodb://root:root@ds121665.mlab.com:21665/freelancer"
mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'murtazabeans@gmail.com',
    pass: 'hello@123'
  }
});

var User = require('../model/users');
var Bid = require('../model/bids');
var Project = require('../model/projects');

var Payment = require('../model/payments');
// var bcrypt = require('bcrypt');

var http = require('http');
var util = require('util');

var producer = connection.getProducer();
var email_check_consumer = connection.getConsumer('check_email');
var signup_consumer = connection.getConsumer('register_topic');
var login_consumer = connection.getConsumer('login_topic');
var get_all_projects = connection.getConsumer('get_all_projects');
var get_user_values_consumer = connection.getConsumer('get_user_values_topic');
var update_user_profile_consumer = connection.getConsumer('update_user_profile_topic');
var project_creation_consumer = connection.getConsumer('project_creation_topic');
var get_project_bids_consumer = connection.getConsumer('get_project_bids_topic');
var get_project_detail_consumer = connection.getConsumer('get_project_detail_topic');
var bid_submission_consumer = connection.getConsumer('bid_submission_topic');
var get_user_bid_projects_consumer = connection.getConsumer('get_user_bid_projects_topic');
var get_all_bids_for_calculation_consumer = connection.getConsumer('get_all_bids_for_calculation_topic')
var get_user_published_projects_consumer = connection.getConsumer('get_user_published_projects_topic');
var get_bid_value_of_user_consumer = connection.getConsumer('get_bid_value_of_user_topic');
var update_balance_consumer = connection.getConsumer('update_balance_topic');
var withraw_amount_consumer = connection.getConsumer('withraw_amount_topic');
var get_user_name_consumer = connection.getConsumer('get_user_name_topic');
var search_projects_consumer = connection.getConsumer('search_projects_topic');
var make_payment_consumer = connection.getConsumer('make_payment_topic');
var hire_user_consumer = connection.getConsumer('hire_user_topic');
var profile_image_upload_consumer = connection.getConsumer('profile_image_upload_topic');
var upload_project_folder_consumer = connection.getConsumer('upload_project_folder_topic');
var past_payments_consumer = connection.getConsumer('past_payments_topic');
var search_for_user_bid_projects_consumer = connection.getConsumer('search_for_user_bid_projects_topic');
var search_for_user_published_projects_consumer = connection.getConsumer('search_for_user_published_projects_topic');
var filter_all_projects_consumer =  connection.getConsumer('filter_all_projects_topic');
var get_relevant_projects_consumer = connection.getConsumer('get_relevant_projects_topic');

email_check_consumer.on('message', function(message){
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({email: form_values.email}).toArray(function(err, results) {
      if (err) throw err;
      console.log("hello I am in test consumer")

      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      console.log(payloads);
      producer.send(payloads, function(err, data){
        console.log("sending email check data")
      });
      //db.close();
    });
  });
})

signup_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var user = new User();
  var form_values = data.data;
  var id = "" + user._id + "";
  const saltRounds = 10;

  console.log(id);
  mongoose.connect(url, function(err, db) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(form_values.password, salt, function(err, hash) {
        db.collection("users").insertOne({id: id, name: form_values.name, password: hash, email: form_values.email}, function(err, res) {
          if (err) throw err;
          db.collection("users").findOne({email: form_values.email}, function(err, results){
            if (err) throw err;
            var payloads = [
              { topic: data.replyTo,
                  messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : results
                  }),
                partition : 0
              }
            ];
            producer.send(payloads, function(err, data){
              console.log("This is data: " + data)
              console.log("sending signup data")
            });
            
          })
          console.log("document inserted");
        });     
      });
    });
  });
});

login_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({email: form_values.email}).toArray(function(err, results) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      console.log(payloads);
      producer.send(payloads, function(err, data){
        console.log("sending email check data")
      });
      //db.close();
    });
  });
});

get_all_projects.on('message', function(message){
  var data = JSON.parse(message.value);
  mongoose.connect(url, function(err, db) {
    db.collection('projects').aggregate([
      { $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'id',
            as: 'users'
          }
        },
        {
          $lookup: {
            from: 'bids',
            localField: 'id',
            foreignField: 'project_id',
            as: 'bids'
          }
        },
 
      ]).toArray(function(err, results) {
      if (err) throw err;
      //db.close();
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){

      });
    });
  });
});




get_relevant_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  form_values = data.data;
  console.log(form_values)
  mongoose.connect(url, function(err, db) {
    console.log("I have reached")
    db.collection("users").find({ id: form_values.id }).toArray(function(err, user) {
      db.collection('projects').aggregate([
        { $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: 'id',
              as: 'users'
            }
          },
          {
            $lookup: {
              from: 'bids',
              localField: 'id',
              foreignField: 'project_id',
              as: 'bids'
            }
          },
   
        ]).toArray(function(err, projects) {
        if (err) throw err;
        //db.close();
        console.log(user[0].skills);
        var results = [];
        if(user[0].skills != undefined && projects.length >=1){

          let user_skills = user[0].skills.split(",");
          
          for(let i = 0; i < projects.length; i++){
            var project_skills_required = projects[i].skills_required.split(",");
            var projects_upper_case = project_skills_required.map(function(x){ return x.toUpperCase() })
            let count = 0;
            for(let j=0; j < user_skills.length; j++){
              projects_upper_case.includes(user_skills[j].toUpperCase()) ? count++ : "";
            }
            console.log(projects[i].name + "   " + count + "       " + projects[i].skills_required)
            if(count >= 3){
              results.push(projects[i]);
            }
          }

        }
        var payloads = [
          { topic: data.replyTo,
              messages:JSON.stringify({
                correlationId:data.correlationId,
                data : results
              }),
            partition : 0
          }
        ];
        producer.send(payloads, function(err, data){
  
        });
      });
    });
  });
});




get_user_values_consumer.on('message', function(message){
  console.log('In all projects consumer');
  //console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({ id: form_values.id }).toArray(function(err, results) {
      if (err) throw err;
      console.log("This is results:" + results)
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("sending email check data")
      });
      //db.close();
    });
  });
});

update_user_profile_consumer.on('message', function(message){
  console.log('In all projects consumer');
  //console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  var form_values = data.data;
  console.log(form_values);
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
    var myquery = {id: form_values.id};
    var new_values = { $set: {email: form_values.email, name: form_values.name, skills: form_values.skills, about_me: form_values.about_me
      , phone_number: form_values.phone_number} };
    db.collection("users").updateOne(myquery, new_values, function(err, res) {
      console.log(res)
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : "Profile Updated"
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Update Profile Data")
      });
    });
  })
});

project_creation_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  console.log(form_values);
  var project = new Project();
  var project_id = "" + project._id + ""
  console.log(form_values.fields);

  mongoose.connect(url, function(err, db) {
    db.collection("projects").insertOne({id: project_id, title: form_values.fields.title[0], description: form_values.fields.description[0], skills_required: form_values.fields.skills_required[0], min_budget: form_values.fields.minimum_budget[0], 
      max_budget: form_values.fields.maximum_budget[0], user_id: form_values.fields.user_id[0], created_at: new Date().toLocaleString(), file_name: form_values.fields.fileName, payment_completed: false, status: "o"}, function(err, res) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : "Project Created"
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Update Profile Data")
      });
    });
  })
});

get_project_bids_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;

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
        { "$match": { "project_id": form_values.pid} },
        { $sort : { "price" : parseInt(form_values.s)} },
      ]).toArray(function(err, results) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});

get_project_detail_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
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
        { "$match": { "id": form_values.p_id } },
      ]).toArray(function(err, results) {
      if (err) throw err;
      console.log(JSON.stringify(results));
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});

bid_submission_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("bids").find({user_id: form_values.user_id, project_id: form_values.project_id}).toArray(function(err, results) {
      if (err) throw err;
      console.log("In find")
      console.log("Check length" + results.length)
      if(results.length >= 1){
        var myquery = { user_id : form_values.user_id, project_id: form_values.project_id };
        var newvalues = { $set: {number_of_days: form_values.no_of_days, price: form_values.price} };
        db.collection("bids").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
        });
      }
      else{
        console.log("hello i am in back")
        var bid = new Bid();
        var bid_id = "" + bid._id + "";
        console.log("I am in bid submission")
        db.collection("bids").insertOne({id: bid_id, project_id: form_values.project_id, user_id: form_values.user_id,  number_of_days: form_values.no_of_days, 
          created_at: new Date().toLocaleString(), price: form_values.price}, function(err, res) {
          if (err) throw err;
        });
      }
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : "Bid Created"
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("This is data: " + data)
      });
    })
  });
});

get_user_bid_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
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
        { "$match": { "bids.user_id": form_values.u_id } },
      ]).toArray(function(err, results) {
      if (err) throw err;
      //db.close();

      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});

search_for_user_bid_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  console.log(form_values)
  mongoose.connect("mongodb://root:root@ds121665.mlab.com:21665/freelancer", function(err, db) {
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
      { $match: { $and: [{ "bids.user_id": form_values.u_id }, { $or: [{'title' : { $regex:  form_values.val, $options: 'i'}}, { 'skills_required': { $regex:  form_values.val, $options: 'i'} } ] }] } },
      
    ]).toArray(function(err, results) {
    if (err) throw err;
    //db.close();

    var payloads = [
      { topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : results
          }),
        partition : 0
      }
    ];
    producer.send(payloads, function(err, data){
      console.log("Get all bids for project");
    });
  });
 });
});

past_payments_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data; 
  mongoose.connect(url, function(err, db) {
    db.collection("payments").find({user_id: form_values.u_id}).toArray(function(err, results) {
      if (err) throw err;
      console.log(results);
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("All Payments");
      });
    });
  });
});

get_all_bids_for_calculation_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("bids").aggregate([
      { "$match": { "project_id": form_values.project_id } },
    ]).toArray(function(err, results) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});

get_user_published_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
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
        { "$match": { "user_id": form_values.u_id } },
      ]).toArray(function(err, results) {
      if (err) throw err;
      //db.close();
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});

search_for_user_published_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
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
      { $match: { $and: [{ "user_id": form_values.u_id }, { $or: [{'title' : { $regex:  form_values.val, $options: 'i'}}, { 'skills_required': { $regex:  form_values.val, $options: 'i'} } ] }] } },        
      ]).toArray(function(err, results) {
      if (err) throw err;
      //db.close();
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Get all bids for project");
      });
    });
  });
});


get_bid_value_of_user_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("bids").find({user_id: form_values.user_id, project_id: form_values.project_id}).toArray(function(err, results) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("sending email check data")
      });
    });
  });
});

update_balance_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({id: form_values.user_id}).toArray(function(err, results) {
      if (err) throw err;
      var payment = new Payment();
      var payment_id = "" + payment._id + "";
      var myquery = {id: form_values.user_id};
      db.collection("payments").insertOne({id: payment_id, user_id: form_values.user_id, amount: form_values.amount, transaction_type: 'Credit',
       created_at: new Date().toLocaleString(), description: "Amount added to account by card"}, function(err, res) {
        if (err) throw err;
      });
      const old_balance = results[0].balance == undefined ? 0 : results[0].balance;
      const new_balance = old_balance + parseFloat(form_values.amount);
      let new_values = { $set: {balance: new_balance} };
      db.collection("users").updateOne(myquery, new_values, function(err, res) {
        if (err) throw err;
        var payloads = [
          { topic: data.replyTo,
              messages:JSON.stringify({
                correlationId:data.correlationId,
                data : results
              }),
            partition : 0
          }
        ];
        producer.send(payloads, function(err, data){
          console.log("Balance Updated")
        });
      });      
    });
  });
});

withraw_amount_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({id: form_values.user_id}).toArray(function(err, results) {
      var myquery = {id: form_values.user_id};
      const old_balance = results[0].balance == undefined ? 0 : results[0].balance;
      console.log(old_balance > parseFloat(form_values.amount));
      if(old_balance > parseFloat(form_values.amount)){
        console.log("entring");
        var payment = new Payment();
        var payment_id = "" + payment._id + "";
        db.collection("payments").insertOne({id: payment_id, user_id: form_values.user_id, amount: form_values.amount, transaction_type: 'Debit', 
        created_at: new Date().toLocaleString(), description: "Amount transferred to bank account"}, function(err, res) {
          if (err) throw err;
        });
        const new_balance = old_balance - parseFloat(form_values.amount);
        let new_values = { $set: {balance: new_balance} };
        
        db.collection("users").updateOne(myquery, new_values, function(err, res) {
          if (err) throw err;
          var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                  correlationId:data.correlationId,
                  data : [{correctRequest: true, balance: new_balance}]
                }),
              partition : 0
            }
          ];
          producer.send(payloads, function(err, data){
            console.log("Balance sdsds Updated")
          });
        });
      }
      else{
        console.log(old_balance);
        var payloads = [
          { topic: data.replyTo,
              messages:JSON.stringify({
                correlationId:data.correlationId,
                data : [{correctRequest: false, balance: old_balance}]
              }),
            partition : 0
          }
        ];
        producer.send(payloads, function(err, data){
          console.log("Balance not Updated")
        });
      }
    });
  });
});

get_user_name_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("users").find({id: form_values.id}).toArray(function(err, results) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : results
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("User document returned");
      });      
    });
  });
});

search_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
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
       {$match: { $or: [{ 'title': { $regex:  form_values.val, $options: 'i'} }, { 'skills_required': { $regex:  form_values.val, $options: 'i'} }] }},
        
     ]).toArray(function(err, results) {
     if (err) throw err;
    //db.close();
    var payloads = [
      { topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : results
          }),
        partition : 0
      }
    ];
    producer.send(payloads, function(err, data){
      console.log("User document returned");
    });
   });
 });
});

filter_all_projects_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;

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
       { "$match": { "status": form_values.val} },
        
     ]).toArray(function(err, results) {
     if (err) throw err;
     console.log("Fetching results");
     console.log(results)
    //db.close();
    var payloads = [
      { topic: data.replyTo,
          messages:JSON.stringify({
            correlationId:data.correlationId,
            data : results
          }),
        partition : 0
      }
    ];
    producer.send(payloads, function(err, data){
      console.log("User document returned");
    });
   });
 });
});

make_payment_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    db.collection("projects").find({id: form_values.project_id}).toArray(function(err, projects) {
      if (err) throw err;
      if(!projects[0].payment_completed){
        db.collection("users").find({id: form_values.employer_id}).toArray(function(err, employer) {
          var employee_values = employer;
          if (err) throw err;
          db.collection("users").find({id: form_values.freelancer_id}).toArray(function(err, freelancer) {
            if (err) throw err;
            db.collection("bids").find({user_id: form_values.freelancer_id, project_id: form_values.project_id}).toArray(function(err, bids) {
              if (err) throw err;
              const employer_account_balance = employee_values[0].balance == undefined ? 0 : employee_values[0].balance;
              const amount_to_be_paid = bids[0].price;
              if(amount_to_be_paid > employer_account_balance){
                var payloads = [
                  { topic: data.replyTo,
                      messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : [{insufficientBalance: true, project_completed: false}]
                      }),
                    partition : 0
                  }
                ];
                producer.send(payloads, function(err, data){
                  console.log("User document returned");
                });
              }
              else{
                var employer = { id: form_values.employer_id}
                var employer_new_balance = employer_account_balance - amount_to_be_paid;
                var employer_new_values = { $set: {balance: employer_new_balance} };
                db.collection("users").updateOne(employer, employer_new_values, function(err, res) {
                  if (err) throw err;
                });
                var employer_payment = new Payment();
                var employer_payment_id = "" + employer_payment._id + "";
                db.collection("payments").insertOne({id: employer_payment_id, user_id: form_values.employer_id, amount: amount_to_be_paid, transaction_type: 'Debit', 
                created_at: new Date().toLocaleString(), description: "Amount deducted for the project"}, function(err, res) {
                  if (err) throw err;
                });
                var freelancer_query = { id: form_values.freelancer_id };
                console.log(freelancer);
                var freelancer_old_balance = freelancer[0].balance == undefined ? 0 : freelancer[0].balance;
                var freelancer_new_balance = freelancer_old_balance + amount_to_be_paid;
                var freelancer_new_values = { $set: { balance: freelancer_new_balance } };
                console.log(freelancer_old_balance + " and new is " + freelancer_new_balance)
                db.collection("users").updateOne(freelancer_query, freelancer_new_values, function(err, res) {
                  if (err) throw err;
                });
                var freelancer_payment = new Payment();
                var freelancer_payment_id = "" + freelancer_payment._id + "";
                db.collection("payments").insertOne({id: freelancer_payment_id, user_id: form_values.freelancer_id, amount: amount_to_be_paid, transaction_type: 'Credit', 
                created_at: new Date().toLocaleString(), description: "Amount added for the project"}, function(err, res) {
                  if (err) throw err;
                });
                var project = {id: form_values.project_id};
                var new_project_values = { $set: {payment_completed: true, status: "c" }}
                db.collection("projects").updateOne(project, new_project_values, function(err, res) {
                  if (err) throw err;
                });
                var payloads = [
                  { topic: data.replyTo,
                      messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : [{insufficientBalance: false, project_completed: false}]
                      }),
                    partition : 0
                  }
                ];
                producer.send(payloads, function(err, data){
                  console.log("Updated");
                });
              }
            });
          });
        });
      }
      else{
        var payloads = [
          { topic: data.replyTo,
              messages:JSON.stringify({
                correlationId:data.correlationId,
                data : [{insufficientBalance: "", project_completed: true}]
              }),
            partition : 0
          }
        ];
        producer.send(payloads, function(err, data){
          console.log("User document returned");
        });
      }
    });
  });
});

hire_user_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  mongoose.connect(url, function(err, db) {
    var myquery = { user_id: form_values.free_lancer_id, project_id: form_values.p_id };
    var new_values = { $set: {status: 'Accepted'} };
    db.collection("bids").updateOne(myquery, new_values, function(err, res) {  if (err) throw err; });

    var myquery1 = { user_id: { $ne: form_values.free_lancer_id}, project_id: form_values.p_id };
    var new_values1 = { $set: {status: 'Rejected'} };
    db.collection("bids").update(myquery1, new_values1, function(err, res) {  if (err) throw err; });
    
    console.log("this is id of fl " + form_values.free_lancer_id);

    db.collection("users").find({id: form_values.free_lancer_id}).toArray(function(err, rows) {
      if (err) throw err;
      console.log("rhis is length"+ rows.length)
      if(rows.length >=1){
        var mailOptions = {
          from: 'murtazabeans@gmail.com',
          to: rows[0].email,
          subject: 'Project Assigned',
          text: 'You have been assigned a project. Please login to the website for more details.'
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });

    db.collection("bids").find({project_id: form_values.p_id, status: 'Accepted'}).toArray(function(err, rows) {
      if (err) throw err;
      var date = new Date();
      var update_query = {id: form_values.p_id};
      console.log("hello")
      var updated_values = { $set: {assigned_to: form_values.free_lancer_id, status: "og", 
        date_of_completion: date.setDate(date.getDate() + parseInt(rows[0].number_of_days))} };
      db.collection("projects").updateOne(update_query, updated_values, function(err, res) {  
        if (err) throw err;
        console.log("Inside")
        var payloads = [
          { topic: data.replyTo,
              messages:JSON.stringify({
                correlationId:data.correlationId,
                data : []
              }),
            partition : 0
          }
        ];
        producer.send(payloads, function(err, data){
          console.log("Mail sent");
        });
      });
    });
  });
});

profile_image_upload_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  console.log(form_values);
  mongoose.connect(url, function(err, db) {
    var myquery = {id: form_values.fields.user_id[0]};
    var new_values = { $set: {profile_image_name:  form_values.fields.image_name} };
    db.collection("users").updateOne(myquery, new_values, function(err, res) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : []
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Image Uploaded");
      });
    });
  });
});

upload_project_folder_consumer.on('message', function(message){
  var data = JSON.parse(message.value);
  var form_values = data.data;
  console.log(form_values);
  mongoose.connect(url, function(err, db) {
    var myquery = {id: form_values.fields.project_id[0]};
    var new_values = { $set: {folder_name: form_values.fields.folder_name } };
    db.collection("projects").updateOne(myquery, new_values, function(err, res) {
      if (err) throw err;
      var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
              correlationId:data.correlationId,
              data : []
            }),
          partition : 0
        }
      ];
      producer.send(payloads, function(err, data){
        console.log("Folder Uploaded");
      });
    });
  });
});