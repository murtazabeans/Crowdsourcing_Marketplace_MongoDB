var assert = require('assert');
var request = require('request');

it('Checks Correct Login', function(done) {
  request.post('http://localhost:3001/signin', { form: { email: "murtaza.manasawala@sjsu.edu", password: "12345678" } },
    function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
  });
});

it('Submit Bid Value', function(done) {
  let form_values = { form: { user_id: "202", project_id: "41", no_of_days: "25", price: "800" } } 
  request.post('http://localhost:3001/submit_bid', form_values, function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
    });
});

it('Fetch All Projects', function(done) {
  request.get('http://localhost:3001/get_all_projects', function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
  });
});

it('Fetch User Projects', function(done) {
  let user_id = 202;
  request.get('http://localhost:3001/get_all_user_published_projects?u_id=' + user_id, function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
  });
});

it('Fetch User Bid Projects', function(done) {
  let user_id = 202;
  request.get('http://localhost:3001/get_all_user_bid_projects?u_id=' + user_id, function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
  });
});

it('Update user Profile', function(done) {
   let form_values = { form: { name: "Murtaza Manasawala", phone_number: "2132453333", email: "murtaza.manasawala@sjsu.edu"
    , about_me: "Full Stack Web Developer", skills: "Ruby, Python, Java, AWS", id: '201'} }
  let user_id = 202;
  request.post('http://localhost:3001/update_profile', form_values, function (error, response, body) {
        assert.equal(200, response.statusCode);
        done();
  });
});