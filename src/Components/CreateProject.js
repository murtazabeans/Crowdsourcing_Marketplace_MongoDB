import React, { Component } from 'react';
import Background from '../img/bg-01.jpg';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'
import CreatableDemo from './CreatableDemo'
var config_header = require('../config');

class CreateProject extends Component {
  constructor(){
    super();
    this.state =  {title: '', description: '', skills_required: [], min_budget : '', max_budget: '', file: ''};
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSkillsChange = this.handleSkillsChange.bind(this);
    this.handleMinBudgetChange = this.handleMinBudgetChange.bind(this);
    this.handleMaxBudgetChange = this.handleMaxBudgetChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount(){
    var self = this;
    axios.get(config_header.host + ":3001/check_session", { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = config_header.host + ":3000/signin";
      }
    })
  }

  handleDescriptionChange(e){
    this.setState({ description: e.target.value });
    e.target.value == "" ? document.getElementById("description-error").innerHTML = "Project Description is Required" : 
      document.getElementById("description-error").innerHTML = "";
  }

  handleTitleChange(e){
    this.setState({ title: e.target.value });
    e.target.value == "" ? document.getElementById("title-error").innerHTML = "Project Title is Required" : 
      document.getElementById("title-error").innerHTML = "";
  }

  // handleSkillsChange(e){
  //   this.setState({ skills_required: e.target.value });
  //   e.target.value == "" ? document.getElementById("skills-error").innerHTML = "Please enter Skills Required" : 
  //     document.getElementById("skills-error").innerHTML = "";
  // }
  
  handleSkillsChange(skills){
    this.setState({ skills_required: skills });
  }

  handleMinBudgetChange(e){
    this.setState({ min_budget: e.target.value });
    e.target.value == "" ? document.getElementById("min-budget-error").innerHTML = "Please enter Minimum Budget" : 
      document.getElementById("min-budget-error").innerHTML = "";
  }

  handleMaxBudgetChange(e){
    this.setState({ max_budget: e.target.value });
    e.target.value == "" ? document.getElementById("max-budget-error").innerHTML = "Please enter Maximum Budget" : 
      document.getElementById("max-budget-error").innerHTML = "";
  }

  handleFormSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    const config = {
      headers: {
      'content-type': 'multipart/form-data'
      }
    }
    let user_id = localStorage.user_id;
    let titleErrorPresent = !this.validateTitleFormat(this.state.title) ? true : false;
    let descriptionErrorPresent = !this.validateDescriptionFormat(this.state.description) ? true : false;
    let skillsErrorPresent = !this.validateSkillsFormat(this.state.skills_required) ? true : false;
    let minBudgetErrorPresent = !this.validateMinBudgetFormat(this.state.min_budget) ? true : false;
    let maxBudgetErrorPresent = !this.validateMaxBudgetFormat(this.state.max_budget) ? true : false;

    if(titleErrorPresent || descriptionErrorPresent || skillsErrorPresent || minBudgetErrorPresent || maxBudgetErrorPresent) {return;}
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('skills_required', this.state.skills_required);
    formData.append('minimum_budget', this.state.min_budget);
    formData.append('maximum_budget', this.state.max_budget);
    formData.append('user_id', localStorage.user_id);
    if( user_id != null){
      var self = this;
      axios.post(config_header.host + ":3001/create_project", formData, config)
      .then(function (response) {
        console.log(response);
        self.setState({
          title: '', 
          description: '', 
          skills_required: '',
          min_budget: '',
          max_budget: ''
        })
        self.props.history.push("/projects")
      })
    }
  }

  validateTitleFormat(title){
    if(title.trim() == ""){
      document.getElementById("title-error").innerHTML = "Project Title is Required";
      return false;
    }
    return true;
  }
  
  validateDescriptionFormat(description){
    if(description.trim() == ""){
      document.getElementById("description-error").innerHTML = "Project Description is Required";
      return false;
    }
    return true;
  }

  validateSkillsFormat(skills){
    if(skills.length == 0){
      document.getElementById("skills-error").innerHTML = "Please enter Skills Required in this Project";
      return false;
    }
    else{
      document.getElementById("skills-error").innerHTML = "";
    }
    return true;
  }
  
  validateMinBudgetFormat(min_budget){
    if(min_budget.trim() == ""){
      document.getElementById("min-budget-error").innerHTML = "Please enter Minimum Budget";
      return false;
    }
    else if(this.state.max_budget != ""){
      if(parseInt(this.state.max_budget) < parseInt(min_budget)){
        document.getElementById("min-budget-error").innerHTML = "Minimum Budget should be less than Maximum Budget";
        return false;
      }
    }
    return true;
  }

  validateMaxBudgetFormat(max_budget){
    if(max_budget.trim() == ""){
      document.getElementById("max-budget-error").innerHTML = "Please enter Maximum Budget";
      return false;
    }
    else if(this.state.min_budget != ""){
      if(parseInt(this.state.min_budget) > parseInt(max_budget)){
        document.getElementById("max-budget-error").innerHTML = "Maximum Budget should be greater than Minimum Budget";
      return false;
      }
    }
    return true;
  }

  handleFileInputChange(e){
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        file: file,
        });
      }
      reader.readAsDataURL(file);
      document.getElementById("project-file").innerHTML = e.target.files[0].name;
  }

  render(props) {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if(isLoggedIn != "true") {
      this.props.history.push("/signin");
      return <div></div>
    }
    return (
      <div>
      <div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-form-title" style={{backgroundImage: `url(${Background})`}}>
                <span className="login100-form-title-1">
                  Create Project
                </span>
              </div>

              <form className="login100-form validate-form" method="POST" onSubmit={this.handleFormSubmit}>

                <label for="file-upload" className="custom-file-upload form-choose">
                      Choose File
                </label>
                <input id="file-upload" type="file" onChange={ this.handleFileInputChange.bind(this) } />
                <div id = "project-file"></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="wrap-input100 validate-input m-b-26 form-div" data-validate="Title is required">
                  <span className="label-input100">Title</span>
                  <input className="input100" type="text" name="title" placeholder="Enter Name of Project"  value={ this.state.title } 
                  onChange={ this.handleTitleChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "title-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Email is required">
                  <span className="label-input100">Description</span>
                  <input className="input100" type="text" name="description" placeholder="Enter Description of Project" value={ this.state.email } 
                  onChange={ this.handleDescriptionChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "description-error" class= "error"></div>
                
                <CreatableDemo handleSkillsChange={this.handleSkillsChange}/>
                <div id = "skills-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Phone Number is required">
                  <span className="label-input100">Minimum Budget($)</span>
                  <input className="input100" type="number" name="min_budget" placeholder="Enter Minimum Budget of Project" value={ this.state.phno } 
                  onChange={ this.handleMinBudgetChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "min-budget-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Description is required">
                  <span className="label-input100">Maximum Budget($)</span>
                  <input className="input100" type="number" name="email" placeholder="Enter Maximum Budget of Project"  value = {this.state.about_me}
                  onChange={ this.handleMaxBudgetChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "max-budget-error" class= "error"></div>
                
                <div className="container-login100-form-btn btn-space">
                  <button className="link-style login100-form-btn">
                    Create Project
                  </button>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
export default CreateProject;