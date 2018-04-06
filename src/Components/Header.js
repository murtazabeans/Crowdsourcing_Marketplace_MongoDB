import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class Header extends Component {
  constructor(){
    super();
    this.state = {sessionPresent: false}
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentWillMount(){
    //var self = this;
    // axios.get('http://localhost:3001/check_session', { withCredentials: true })
    // .then((response) => {
    //   debugger
    //   if(response.data.session.email !=  undefined){
    //     self.setState({
    //       sessionPresent: true
    //     });
    //   }
    // })
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
  }

  handleSignOut(e){
    localStorage.clear();
    axios.get('http://localhost:3001/destroy_session', { withCredentials: true })
    .then((response) => {
    })
    window.location.href = "http://localhost:3000";
  }

  render(props) {
    let  session_link, transaction_url, payment_url, post_project, user_profile, projects_page, bid_page, mybidprojects, my_projects, user_name = null;
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if(isLoggedIn == "true") {
      mybidprojects = <a className="sidebar-options" href="/my-bid-projects">My Bid Projects</a>
      my_projects = <a className="sidebar-options" href="my-projects">My Projects</a>
      projects_page = <a className="sidebar-options" href = "/projects"  >All Projects</a>
      post_project = <a className="sidebar-options" href="/new-project">Post Project </a>
      user_profile = <a className="sidebar-options" href="/edit_profile">Edit Profile </a>
      payment_url = <a className="sidebar-options" href="/payments">Manage Payments</a>
      transaction_url = <a className="sidebar-options" href="/transactions">Transaction History</a>
      session_link = <a className="sidebar-options" onClick = {this.handleSignOut} href="#">Sign Out</a>
    }
    else{
      session_link = <a className="btn btn-primary" href="/signin">Sign In</a>      
    }

    if(this.props.user.login_data != null){
      user_name = <div id = "name"><i className="fa fa-user" aria-hidden="true"></i> Welcome {this.props.user.login_data.name}  </div>
    }
    return (
      <div id = "header-main-div">
        
        <div className="container">
          <div id="mySidenav" className="sidenav">
            <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
            { mybidprojects }
            { my_projects }
            { projects_page }
            { post_project }
            { user_profile }
            { payment_url }
            { transaction_url }
            { session_link }
          </div>
          <div id="main">
            <span className = "open-sidebar" onClick={this.openNav.bind(this)}>&#9776; MENU</span>
          </div>
          <a href="https://www.freelancer.com/" id = "image-freelancer" target="_blank" className="navbar-brand web-link" title="Home"><img id="freelancer-img" src= {require('../img/freelancer.svg')} /></a>
          { user_name }
        </div>
        
        
        {/* <nav className="navbar navbar-light bg-light static-top">
          <div className="container">
          <a href="https://www.freelancer.com/" id="freelancer-img" target="_blank" className="navbar-brand web-link" title="Home"><img src= {require('../img/freelancer.svg')} /></a>
          { mybidprojects }
          { my_projects }
          { projects_page }
          { post_project }
          { user_profile }
          { session_link }
          { user_name }
          </div>
        </nav> */}
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    user: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Header)

