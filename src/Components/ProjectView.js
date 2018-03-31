import React, { Component } from 'react';
import axios from 'axios';
import Background from '../img/bg-01.jpg';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'

class ProjectView extends Component {

  constructor(){
    super();
    this.state = { data: [], days: "", price: "", btn_name: "Submit Bid", file: ''  };
    this.handleBidClick = this.handleBidClick.bind(this);
    this.handleBidInput = this.handleBidInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
  }

  componentWillMount(){
    let project_id = localStorage.getItem("project_id");
    this.loadProjectDetailsFromServer(project_id)
    // var self = this;
    // axios.get('http://localhost:3001/check_session', { withCredentials: true })
    // .then((response) => {
    //   if(response.data.session.email ==  undefined){
    //     window.location.href = "http://localhost:3000/signin";
    //   }
    //   else{
    //     let project_id = localStorage.getItem("project_id");
    //     this.loadProjectDetailsFromServer(project_id);
    //   }
    // })
     
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
      if(response.data.rows.length >= 1){
        var price = 0;
        for(var i = 0; i < response.data.rows.length; i++){
          price += parseInt(response.data.rows[i].price);
        }
        self.state.data.avgPrice = parseFloat((price/ response.data.rows.length)).toFixed(2);
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
        if(response.data.rows.bids.length >=1){
          var price = 0;
          for(var i = 0; i < response.data.rows.bids.length; i++){
            price += parseInt(response.data.rows.bids[i].price);
          }
          response.data.rows["avgPrice"] ="$" + parseFloat((price/ response.data.rows.bids.length)).toFixed(2);
        }
        else{
          response.data.rows["avgPrice"] = "$0";
        }
        self.setState({
          data: response.data.rows    
        })
        return;
      }
      return;
    })
  }

  handleProjectUploadChange(e){
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        file: file,
        });
      }
      reader.readAsDataURL(file);
      document.getElementById("project-file-upload").innerHTML = e.target.files[0].name;
  }

  handleFormSubmit(e){
    debugger
    e.preventDefault();
    if(this.state.file == ""){
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'You have not entered any folder!'
      })
      return;
    }
    else{
      let splitted_file_name = this.state.file.name.split(".");
      if(splitted_file_name[splitted_file_name.length - 1] == "zip"){
        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('project_id', localStorage.project_id);
        const config = {
          headers: {
          'content-type': 'multipart/form-data'
          }
        }
        var self = this;
        if(this.state.file != ""){
          axios.post("http://localhost:3001/upload-folder", formData, config)
          .then(function (response) {
            debugger
            if(response.data.fileType != null){
              
              swal({
                type: 'success',
                title: 'Congratulations',
                text: 'You have successfully uploaded the folder'
              })
              return;
            }
            return;
          })
        }
      }
      else{
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Please enter zip folder only'
        })
        return;
      }
    }
    
  }

  render() {
    debugger
      const budget_range = this.state.data !== 'undefined' ? this.state.data.min_budget + " - " + 
      this.state.data.max_budget : null;
      let attachment_url, button, download_folder_link = null;
      let folder_name = this.state.data.folder_name == undefined ? "" : "Folder Uploaded";
      if(this.state.data.file_name != undefined && this.state.data.file_name != "undefined" && this.state.data.file_name != ""){
        var attachment = require('../project-file/' + this.state.data.file_name);
        attachment_url = <a href = {attachment} className="custom-file-upload form-choose download-link" target="_blank">Show Attachment</a>
      }
      if(this.state.data.folder_name != undefined && this.state.data.folder_name != "undefined" && this.state.data.folder_name){
        let download_folder_path = require('../project-file/' + this.state.data.folder_name);
        download_folder_link = <a href = {download_folder_path} className="custom-file-upload form-choose download-link download-folder"  download>Download Folder</a>
      }
      if(this.state.data.assigned_to == undefined){
        button = <button className="link-style login100-form-btn" onClick={this.handleBidClick}>
          Click to Bid
        </button>
      }
      else{
        if(this.state.data.assigned_to == localStorage.user_id){
          button = <div>
              <form onSubmit={this.handleFormSubmit.bind(this)}>
                <label for="file-upload" className="link-style login100-form-btn project-upload-label">
                      Upload Project Folder
                </label>
                <input id="file-upload" type="file" onChange = {this.handleProjectUploadChange.bind(this)}/>
                <div id = "project-file-upload">{folder_name}</div>
                <button className="custom-file-upload project-upload-button" id = "project-form-submit" type="submit">Upload Folder</button>
              </form>
            </div>
        }
        else{
          if(this.state.data.user_id == localStorage.user_id)
          {
            button = <div><button className="link-style login100-form-btn payment-button" onClick={this.handleBidClick}>
              Make Payment
            </button>
           {download_folder_link}
           </div>
          }
          else{
            button = <button disabled className="link-style login100-form-btn disable-button" onClick={this.handleBidClick}>
              Project Assigned
            </button>
          }
        }
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
                      <span className="label-input100">Average Bid($)</span>
                      {/* <textarea name="Text1" className="input100" cols="40" rows="3" value = {this.state.data.skills_required}></textarea> */}
                      <input className="input100" type="text" disabled value = {this.state.data.avgPrice} />
                      <span className="focus-input100"></span>
                    </div>

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="container-login100-form-btn">
                      {button}
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
