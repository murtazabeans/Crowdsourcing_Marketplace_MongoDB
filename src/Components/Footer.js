import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
//import './style.css';

class Footer extends Component {
  
  render(props) {
    return (
      <div>
        <footer className="footer bg-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
                <ul className="list-inline mb-2">
                  <li className="list-inline-item">
                    <a href="https://www.freelancer.com/about" target="_blank">About us</a>
                  </li>
                  <li className="list-inline-item">&sdot;</li>
                  <li className="list-inline-item">
                    <a href="https://www.freelancer.com/enterprise" target="_blank">Contact</a>
                  </li>
                  <li className="list-inline-item">&sdot;</li>
                  <li className="list-inline-item">
                    <a href="https://www.freelancer.com/about/terms" target = "_blank">Terms and Conditions</a>
                  </li>
                  <li className="list-inline-item">&sdot;</li>
                  <li className="list-inline-item">
                    <a href="https://www.freelancer.com/about/privacy" target = "_blank">Privacy Policy</a>
                  </li>
                </ul>
                <p className="text-muted small mb-4 mb-lg-0">&copy; Copyright © 2018 FreelancerProject Limited (ACN 142 189 759)</p>
              </div>
              <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item mr-3">
                    <a href="https://www.facebook.com/fansoffreelancer" target="_blank">
                      <i className="fa fa-facebook fa-2x fa-fw"></i>
                    </a>
                  </li>
                  <li className="list-inline-item mr-3">
                    <a href="https://twitter.com/freelancer" target="_blank">
                      <i className="fa fa-twitter fa-2x fa-fw"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://www.instagram.com/freelancerofficial/" target="_blank">
                      <i className="fa fa-instagram fa-2x fa-fw"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
export default Footer;