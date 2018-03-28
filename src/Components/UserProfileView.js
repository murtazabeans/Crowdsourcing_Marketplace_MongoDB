import React, { Component } from 'react';
import Background from '../img/bg-01.jpg';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import ImageUpload from './ImageUpload'
import swal from 'sweetalert2'

class UserProfileView extends Component {
  constructor(){
    super();
    this.state =  {email: '', name: '', phno: '', skills: '', about_me : '', fileName: ''};
  }

  componentWillMount(){
    
  }

  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
      else{
        this.loadUserDetailsFromServer();
      }
    })
  }

  loadUserDetailsFromServer(){
    let id = localStorage.profile_id
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
            about_me: user_detail.about_me == null ? "" : user_detail.about_me,
            fileName: user_detail.profile_image_name
          })
          return;
        }
        return;
      })
    } 
  }

  render(props) {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if(isLoggedIn != "true") {
      this.props.history.push("/signin");
      return <div></div>
    }
    let image_name = null;
    if(this.state.fileName != ""){
      image_name = <img id = "profile_image_display" src= { require('../images/' + this.state.fileName) } alt="Smiley face" height="200px" width="200px" />
    }
        
    return (
      <div>
      <div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-form-title details-header">
                <span className="login100-form-title-1">
                  User Details
                </span>
              </div>
              
              
              {image_name}
              <form className="login100-form validate-form">
                <div className="wrap-input100 validate-input m-b-26 form-div" data-validate="Name is required">
                  <span className="label-input100">Name</span>
                  <input className="input100" disabled type="text" name="name"  value={ this.state.name } 
                  onChange={ this.handleNameChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "name-error" class= "error"></div>

                
                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Email is required">
                  <span className="label-input100">Email</span>
                  <input className="input100" disabled type="text" name="email" value={ this.state.email }  />
                  <span className="focus-input100"></span>
                </div>
                <div id = "email-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Phone Number is required">
                  <span className="label-input100">Contact</span>
                  <input className="input100" disabled type="number" name="Contact" value={ this.state.phno } 
                  onChange={ this.handleContactChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "contact-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Description is required">
                  <span className="label-input100">About me</span>
                  <input  rows="5" disabled className="input100" type="text" name="About"  value = {this.state.about_me}
                  onChange={ this.handleDescriptionChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "description-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Skills is required">
                  <span className="label-input100">Skills</span>
                  <input className="input100" disabled type="text" name="skills" value={ this.state.skills } 
                  onChange={ this.handleSkillsChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "skills-error" class= "error"></div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
export default UserProfileView;