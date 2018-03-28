import React, { Component } from 'react';
import axios from 'axios';
import Background from '../img/bg-01.jpg';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'

class ProjectView extends Component {

  constructor(){
    super();
    this.state = { data: [], days: "", price: "", btn_name: "Submit Bid"  };
    this.handleBidClick = this.handleBidClick.bind(this);
    this.handleBidInput = this.handleBidInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
  }

  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
      else{
        let project_id = localStorage.getItem("project_id");
        this.loadProjectDetailsFromServer(project_id);
      }
    })
     
  }

  handlePriceInput(e){
    this.setState({price: e.target.value})
    e.target.value == "" ? document.getElementById("price-error").innerHTML = "Please enter price needed to complete project" : 
      document.getElementById("price-error").innerHTML = "";
  }

  handleBidInput(e){
    this.setState({days: e.target.value});
    e.target.value == "" ? document.getElementById("days-error").innerHTML = "Please enter days needed to complete project" : 
      document.getElementById("days-error").innerHTML = "";
  }

  handleBidClick(e){
    e.preventDefault();
    var self = this;
    let form_values = {project_id: localStorage.project_id, user_id: localStorage.user_id}
    axios.post("http://localhost:3001/get-bid-value-for-user", form_values)
    .then(function (response) {
        if(response.data.data_present){
          self.setState({
            days: response.data.rows.number_of_days,
            price: response.data.rows.price,
            btn_name: "Update Bid"
          })
        }
        

    })
    document.getElementById("bid_form").style.display = "block";
  }

  handleBidSubmit(e){
    e.preventDefault();
    let daysErrorPresent = !this.validateDaysFormat(this.state.days) ? true : false;
    let priceErrorPresent = !this.validatePriceFormat(this.state.price) ? true : false;

    if(daysErrorPresent || priceErrorPresent){ return; }

    var self = this;
    let form_values = {user_id: localStorage.user_id, project_id: localStorage.project_id, no_of_days: this.state.days, price: this.state.price}
    axios.post("http://localhost:3001/submit_bid", form_values)
    .then(function (response) {
        if(response.data.rows[0].avgDays != undefined)
        {
          self.state.data.days = response.data.rows[0].avgDays;
        }
        self.setState({
          data: self.state.data,
          days: '',
          price: '',
          btn_name: 'Submit Bid' 
        })
        swal({
          type: 'success',
          title: 'Thank You',
          text: 'Your Bid is Submitted Successfully!'
        })
        self.props.history.push("/project-detail");
        document.getElementById("bid_form").style.display = "none";

    })
  }

  validateDaysFormat(days){
    if(days == ""){
      document.getElementById("days-error").innerHTML = "Please enter days needed to complete project";
      return false;
    }
    return true;
  }

  validatePriceFormat(price){
    if(price == ""){
      document.getElementById("price-error").innerHTML = "Please enter price needed to complete project";
      return false;
    }
    return true;
  }

  loadProjectDetailsFromServer(project_id){
    var self = this;
    axios.get("http://localhost:3001/get_project_detail?p_id=" + project_id)
    .then(function (response) {
      if(response.data.rows != null){
        let user_detail = response.data.rows;
        console.log(response);
        if(response.data.rows.days == null){
          response.data.rows["days"] = "0";
        }
         
        self.setState({
          data: response.data.rows    
        })
        return;
      }
      return;
    })
  }
  

  render() {
      const budget_range = this.state.data !== 'undefined' ? this.state.data.min_budget + " - " + 
      this.state.data.max_budget : null;
      let attachment_url = null;
      if(this.state.data.file_name != undefined && this.state.data.file_name != "undefined" && this.state.data.file_name != ""){
        var attachment = require('../project-file/' + this.state.data.file_name)
        
        attachment_url = <a href = {attachment} className="custom-file-upload form-choose download-link" target="_blank">Show Attachment</a>
      }
      return (
          <div>
            <div className="limiter">
              <div className="container-login100">
                <div className="wrap-login100">
                <div className="login100-form-title details-header">
                  <span className="login100-form-title-1">
                    Project Details
                  </span>
                </div>
                  {attachment_url}
                  {/* <input id="file-upload" type="file"  /> */}
                  <form className="login100-form validate-form">
                    <div className="wrap-input100 validate-input m-b-26" data-validate="email is required">
                      <span className="label-input100">Name</span>
                      <input className="input100" type="text" name="email" disabled value = {this.state.data.title} />
                      <span className="focus-input100"></span>
                    </div>

                    <div className="wrap-input100 validate-input m-b-18">
                      <span className="label-input100">Description</span>
                      <textarea name="Text1" className="input100" cols="40" disabled rows="5" value = {this.state.data.description}></textarea>
                      {/* <input className="input100" type="password" name="pass" placeholder="Enter password" onChange= {this.handlePasswordChange} /> */}
                      <span className="focus-input100"></span>
                    </div>
                    

                    {/* <a download href="http://www.pdf995.com/samples/pdf.pdf" target="_blank">Attachment</a> */}


                    <div className="wrap-input100 validate-input m-b-18">
                      <span className="label-input100">Skills Required</span>
                      <textarea name="Text1" className="input100" cols="40" rows="3" disabled value = {this.state.data.skills_required}></textarea>
                      {/* <input className="input100" type="password" name="pass" placeholder="Enter password" onChange= {this.handlePasswordChange} /> */}
                      <span className="focus-input100"></span>
                    </div>
                    
                    <div className="wrap-input100 validate-input m-b-18">
                      <span className="label-input100">Budget Range($)</span>
                      {/* <textarea name="Text1" className="input100" cols="40" rows="3" value = {this.state.data.skills_required}></textarea> */}
                      <input className="input100" type="text" disabled value = {budget_range} />
                      <span className="focus-input100"></span>
                    </div>

                    <div className="wrap-input100 validate-input m-b-18">
                      <span className="label-input100">Average Bid(Days)</span>
                      {/* <textarea name="Text1" className="input100" cols="40" rows="3" value = {this.state.data.skills_required}></textarea> */}
                      <input className="input100" type="text" disabled value = {this.state.data.days} />
                      <span className="focus-input100"></span>
                    </div>

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="container-login100-form-btn">
                      <button className="link-style login100-form-btn" onClick={this.handleBidClick}>
                        Click to Bid
                      </button>
                    </div>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                    <form id = "bid_form" onSubmit = {this.handleBidSubmit.bind(this)}>
                      <div className="wrap-input100 validate-input m-b-26 form-div" data-validate="email is required">
                        <span className="label-input100">Number of Days</span>
                        <input className="input100 div-space form-div" type="number" name="no_of_days" placeholder="Enter Days Required" value ={this.state.days} onChange = {this.handleBidInput}/>
                        <span className="focus-input100"></span>
                      </div>
                      <div id = "days-error" class= "error"></div>

                      <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="email is required">
                        <span className="label-input100">Price($)</span>
                        <input className="input100" type="number" name="no_of_days" placeholder="Enter Price" value ={this.state.price} onChange = {this.handlePriceInput}/>
                        <span className="focus-input100"></span>
                      </div>
                      <div id = "price-error" class= "error"></div>

                      <div className="container-login100-form-btn btn-space">
                        <button className="link-style login100-form-btn">
                          {this.state.btn_name}
                        </button>
                      </div>
                    </form>

                  </form>
                </div>
              </div>
            </div>
          </div>
      )
    }
}

export default ProjectView;
