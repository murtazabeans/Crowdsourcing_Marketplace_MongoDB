import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/simple-line-icons.css';
import '../css/custom.css';
import {connect} from 'react-redux';  
import {bindActionCreators} from 'redux';
import axios from 'axios';
import Background from '../img/bg-01.jpg';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'
import allreducers from '../reducers';

class SignIn extends Component {
  constructor(props){
    super(props);
    this.state = { email: '', password: '', show: true };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email !=  undefined){
        window.location.href = "http://localhost:3000/projects";
      }
    })
  }

  handlePasswordChange(e){
    this.setState({ password: e.target.value });
    e.target.value == "" ? document.getElementById("password-error").innerHTML = "Please enter your password" : 
      document.getElementById("password-error").innerHTML = "";
  }
  
  handleEmailChange(e){
    this.setState({ email: e.target.value });
    e.target.value == "" ? document.getElementById("email-error").innerHTML = "Please enter your email" : 
      document.getElementById("email-error").innerHTML = "";
  }

  handleFormSubmit(e){
    e.preventDefault();
    let form_values = {email: this.state.email.trim(), password: this.state.password.trim()};
    let passwordErrorPresent = !this.validatePasswordFormat(this.state.password) ? true : false;
    let emailErrorPresent = !this.validateEmailFormat(this.state.email) ? true : false;
    emailErrorPresent || passwordErrorPresent ? "" : this.props.loginCredentials(form_values);
  }

  validatePasswordFormat(password){
    if(password.trim() == ""){
      document.getElementById("password-error").innerHTML = "Please enter your password";
      return false;
    }
    return true;
  }

  validateEmailFormat(email){
    if(email == ""){
      document.getElementById("email-error").innerHTML = "Please enter your email";
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        <div>
        </div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-form-title" style={{backgroundImage: `url(${Background})`}}>
                <span className="login100-form-title-1">
                  Sign In
                </span>
              </div>

              <form className="login100-form validate-form" onSubmit={this.handleFormSubmit}>
                <div className="wrap-input100 validate-input m-b-26 form-div" data-validate="email is required">
                  <span className="label-input100">Email</span>
                  <input className="input100" type="text" name="email" placeholder="Enter email" onChange= {this.handleEmailChange} />
                  <span className="focus-input100"></span>
                </div>
                <div id = "email-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-18 div-space form-div" data-validate = "Password is required">
                  <span className="label-input100">Password</span>
                  <input className="input100" type="password" name="pass" placeholder="Enter password" onChange= {this.handlePasswordChange} />
                  <span className="focus-input100"></span>
                </div>
                <div id = "password-error" class= "error"></div>
                
                <div className="container-login100-form-btn btn-space">
                  <button className="login100-form-btn">
                    Login
                  </button>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="flex-sb-m w-full p-b-30">
                  <div className="contact100-form-checkbox">
                    Don't have an account yet?
                    <a href="/signup" style={{color:'#007bff'}}>&nbsp;&nbsp;&nbsp;&nbsp;Register Now!</a>
                  </div>           
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    user: state.userLoggedIn
  }
}

function mapDispatchToProps(dispatch){
  return{
    loginCredentials: (details) => {
      axios.post('http://localhost:3001/signin', details, { withCredentials: true })
      .then(response => {
        if(response.data.correctCredentials){
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("user_id", response.data.rows.id)
          window.location.href = "http://localhost:3000/projects"
          dispatch({type: 'LoggedIn', payload: response.data.rows});
        }
        else{
          //self.props.history.push('/signin');
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'You entered invalid credentials!'
          })
        }

      }) 
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignIn)