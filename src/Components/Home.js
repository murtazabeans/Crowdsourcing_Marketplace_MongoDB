import React, { Component } from 'react';
import {connect} from 'react-redux';  
import {bindActionCreators} from 'redux';
import ShowCase1 from '../img/bg-showcase-1.jpg';
import ShowCase2 from '../img/bg-showcase-2.jpg';
import ShowCase3 from '../img/bg-showcase-3.jpg';
import axios from 'axios';

class Home extends Component {

  handleButton(e){
    e.preventDefault();
    this.props.history.push("/signup")
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

  render(props) {
    let dashboard, projects_page, post_project, user_profile, session_link = null;
    if(this.props.user.login_data != null) {
      dashboard = <a className="link-style nav-link btn-info" href="#">Dashboard</a>
      projects_page = <a className="link-style nav-link btn-info" href = "/projects"  >All Projects</a>
      post_project = <a className="link-style nav-link btn-info" href="/new-project">Post Project </a>
      user_profile = <a className="link-style nav-link btn-info" href="/edit_profile">Edit Profile </a>
      session_link = <a className="link-style nav-link btn-info" onClick = {this.handleSignOut} href="#">Sign Out</a>
    }
    else{}
    return (
      <div>
        <header className="masthead text-white text-center">
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-xl-9 mx-auto">
                <h1 className="mb-5">Hire expert freelancers for any job, online. Build anything you want!</h1>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                <div className="form-row">
                  <div className="col-12 col-md-3 center">
                    <button type="submit" className="btn btn-block btn-lg btn-primary" onClick={this.handleButton.bind(this)}>Sign up Now!</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="features-icons bg-light text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <i className="icon-screen-desktop m-auto text-primary"></i>
                  </div>
                  <h3>Website development</h3>
                  <p className="lead mb-0">The website will look great on any device, no matter the size! Make a responsive design with ease</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <i className="icon-layers m-auto text-primary"></i>
                  </div>
                  <h3>Client Satisfaction</h3>
                  <p className="lead mb-0">You only have to pay for work when it has been completed and you’re 100% satisfied.</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <i className="icon-check m-auto text-primary"></i>
                  </div>
                  <h3>Trust</h3>
                  <p className="lead mb-0">Find professionals you can trust by browsing their samples of previous work and reading their profile reviews.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="showcase">
          <div className="container-fluid p-0">
            <div className="row no-gutters">

              <div className="col-lg-6 order-lg-2 text-white showcase-img" style={{backgroundImage: `url(${ShowCase1})`}}></div>
              <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                <h2>27 Million Professionals on demand</h2>
                <p className="lead mb-0">When you want to develop a project! Why to wait? Hire best professionals for developing your project by looking at their skills! Hurry up!</p>
              </div>
            </div>
            <div className="row no-gutters">
              <div id = "showCase2" className="col-lg-6 text-white showcase-img" style={{backgroundImage: `url(${ShowCase2})`}}></div>
              <div className="col-lg-6 my-auto showcase-text">
                <h2>Need work done?</h2>
                <p className="lead mb-0">Whatever your needs, there will be a freelancer to get it done: from web design, mobile app development, virtual assistants, product manufacturing, and graphic design (and a whole lot more).</p>
              </div>
            </div>
            <div className="row no-gutters">
              <div id = "showCase3"className="col-lg-6 order-lg-2 text-white showcase-img" style={{backgroundImage: `url(${ShowCase3})`}}></div>
              <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                <h2>Easy to Use &amp; Customize</h2>
                <p className="lead mb-0">Get free quotes from skilled freelancers within minutes, view profiles, ratings and portfolios and chat with them. Pay the freelancer only when you are 100% satisfied with their work.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials text-center bg-light">
          <div className="container">
            <h2 className="mb-5">What people are saying...</h2>
            <div className="row">
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src= { require('../img/testimonials-1.jpg') } alt="" />
                  <h5>Margaret E.</h5>
                  <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src= { require('../img/testimonials-2.jpg') } alt="" />
                  <h5>Fred S.</h5>
                  <p className="font-weight-light mb-0">"FreeLancer is amazing. I've been using it to create lots of super nice landing websites."</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src= { require('../img/testimonials-3.jpg') } alt="" />
                  <h5>Sarah	W.</h5>
                  <p className="font-weight-light mb-0">"Thanks so much for making these resources available to us!"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="call-to-action text-white text-center">
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-xl-9 mx-auto">
                <h2 className="mb-4">Ready to get started? Sign up now!</h2>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                <form>
                  <div className="form-row">
                    
                    <div className="col-12 col-md-3 center">
                      <button type="submit" className="btn btn-block btn-lg btn-primary" onClick={this.handleButton.bind(this)}>Sign up!</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    user: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Home);