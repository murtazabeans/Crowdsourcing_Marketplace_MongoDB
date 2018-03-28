import React, { Component } from 'react';
import Background from '../img/bg-01.jpg';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import ImageUpload from './ImageUpload'
import swal from 'sweetalert2'

class UserProfile extends Component {
  constructor(){
    super();
    this.state =  {email: '', name: '', phno: '', skills: '', about_me : ''};
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleDescriptionChange =this.handleDescriptionChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSkillsChange = this.handleSkillsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
    })
  }

  componentWillMount(){
    this.loadUserDetailsFromServer();
  }

  handleContactChange(e){
    this.setState({ phno: e.target.value });
    e.target.value == "" ? document.getElementById("contact-error").innerHTML = "Please enter your Contact Number" : 
      document.getElementById("contact-error").innerHTML = "";
  }

  handleDescriptionChange(e){
    this.setState({ about_me: e.target.value });
    e.target.value == "" ? document.getElementById("description-error").innerHTML = "Please enter About your Experience" : 
      document.getElementById("description-error").innerHTML = "";
  }

  handleSkillsChange(e){
    this.setState({ skills: e.target.value });
    e.target.value == "" ? document.getElementById("skills-error").innerHTML = "Please enter your Skills" : 
      document.getElementById("skills-error").innerHTML = "";
  }
  
  handleNameChange(e){
    this.setState({ name: e.target.value });
    e.target.value == "" ? document.getElementById("name-error").innerHTML = "Please enter your name" : 
      document.getElementById("name-error").innerHTML = "";
  }

  handleEmailChange(e){
    this.setState({ email: e.target.value });
    e.target.value == "" ? document.getElementById("email-error").innerHTML = "Please enter your Email" : 
      document.getElementById("email-error").innerHTML = "";
  }

  loadUserDetailsFromServer(){
    let id = localStorage.user_id
    if( id != null){
      var self = this;
      axios.get("http://localhost:3001/get_user?id=" + id)
      .then(function (response) {
        if(response.data.rows != null){
          let user_detail = response.data.rows;
          console.log(response);
          self.setState({
            email: user_detail.email, 
            name: user_detail.name, 
            phno: user_detail.phone_number == null ? "" : user_detail.phone_number,
            skills: user_detail.skills == null ? "" : user_detail.skills,
            about_me: user_detail.about_me == null ? "" : user_detail.about_me
          })
          return;
        }
        return;
      })
    } 
  }

  handleFormSubmit(e){
    e.preventDefault();
    let form_values = {name: this.state.name.trim(), phone_number: this.state.phno.trim(), email: this.state.email.trim()
      , about_me: this.state.about_me, skills: this.state.skills, id: localStorage.user_id};
      
    let nameErrorPresent = !this.validateNameFormat(this.state.name) ? true : false;
    let emailErrorPresent = !this.validateEmailFormat(this.state.email) ? true : false;
    let contactErrorPresent = !this.validateContactFormat(this.state.phno) ? true : false;
    let descriptionErrorPresent = !this.validateDescriptionFormat(this.state.about_me) ? true : false;
    let skillsErrorPresent = !this.validateSkillsFormat(this.state.skills) ? true : false;
    if(nameErrorPresent || emailErrorPresent || contactErrorPresent || descriptionErrorPresent || skillsErrorPresent){ return; }

    var self = this;
    axios.post('http://localhost:3001/update_profile', form_values)
      .then(function (response) {
          swal({
            type: 'success',
            title: 'Congratulations',
            text: 'You have successfully updated your profile'
          })
        })
    
  }

  validateNameFormat(name){
    if(name.trim() == ""){
      document.getElementById("name-error").innerHTML = "Please enter your name";
      return false;
    }
    return true;
  }

  validateEmailFormat(email){
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email == ""){
      document.getElementById("email-error").innerHTML = "Please enter your email";
      return false;
    }
    else if(!regex.test(String(email).toLowerCase())){
      document.getElementById("email-error").innerHTML = "Please enter valid email address";
      return false;
    }
    return true;
  }

  validateContactFormat(contact_no){
    const regex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
    if(contact_no == ""){
      document.getElementById("contact-error").innerHTML = "Please enter your Contact Number";
      return false;
    }
    else if(!regex.test(String(contact_no).toLowerCase())){
      document.getElementById("contact-error").innerHTML = "Please enter valid Contact Number";
      return false;
    }
    return true;
  }

  
  validateDescriptionFormat(description){
    if(description.trim() == ""){
      document.getElementById("description-error").innerHTML = "Please enter About your Experience";
      return false;
    }
    return true;
  }

  validateSkillsFormat(skills){
    if(skills.trim() == ""){
      document.getElementById("skills-error").innerHTML = "Please enter your Skills";
      return false;
    }
    return true;
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
                  Edit Profile
                </span>
              </div>
              <ImageUpload />
      
              <form className="login100-form validate-form" method="POST" onSubmit={this.handleFormSubmit}>
                
                <div className="wrap-input100 validate-input m-b-26 form-div" data-validate="Name is required">
                  <span className="label-input100">Name</span>
                  <input className="input100" type="text" name="name" placeholder="Enter name"  value={ this.state.name } 
                  onChange={ this.handleNameChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "name-error" class= "error"></div>

                
                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Email is required">
                  <span className="label-input100">Email</span>
                  <input className="input100" type="text" name="email" placeholder="Enter email" value={ this.state.email } 
                  onChange={ this.handleEmailChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "email-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Phone Number is required">
                  <span className="label-input100">Contact</span>
                  <input className="input100" type="number" name="email" placeholder="Enter phone number" value={ this.state.phno } 
                  onChange={ this.handleContactChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "contact-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Description is required">
                  <span className="label-input100">About me</span>
                  <input  rows="5" className="input100" type="text" name="email" placeholder="Enter your Description"  value = {this.state.about_me}
                  onChange={ this.handleDescriptionChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "description-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Skills is required">
                  <span className="label-input100">Skills</span>
                  <input className="input100" type="text" name="email" placeholder="Enter your Skills" value={ this.state.skills } 
                  onChange={ this.handleSkillsChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "skills-error" class= "error"></div>

                

                <div className="container-login100-form-btn btn-space">
                  <button className="link-style login100-form-btn">
                    Update Profile
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
export default UserProfile;