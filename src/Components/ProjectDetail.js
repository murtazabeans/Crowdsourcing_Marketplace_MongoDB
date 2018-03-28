import React, { Component } from 'react';
import axios from 'axios';

class ProjectDetail extends Component {

  constructor(){
    super();
    this.handleProjectView = this.handleProjectView.bind(this);
    this.handleProjectNameClick = this.handleProjectNameClick.bind(this);
  }

  handleProjectView(e){
    localStorage.setItem('project_id', e.target.dataset.id);
    window.location.href = "http://localhost:3000/project-detail"
  }

  handleProjectNameClick(e){
    localStorage.setItem('project_id', e.target.dataset.attr);
    window.location.href = "http://localhost:3000/project-detail"
  }

  handleBidsView(e){
    localStorage.setItem('project_id', e.target.dataset.id);
    window.location.href = "http://localhost:3000/project-bids"
  }

  handleEmployerNameClick(e){
    localStorage.setItem('profile_id', e.target.dataset.employerid);
    window.location.href = "http://localhost:3000/profile"
  }

  render() {
    
      return (
          <tr>
            <td>
            <a data-attr = {this.props.id} onClick={this.handleProjectNameClick} className="project-name" href="#">{this.props.name}</a>
            </td>
            <td>{this.props.description}</td>
            <td>{this.props.skills_required}</td>
            <td>{this.props.min_budget} - {this.props.max_budget}</td>
            <td>
            <a data-employerid = {this.props.employer_id} onClick={this.handleEmployerNameClick.bind(this)} className="project-name" href="#">{this.props.employer_name}</a>
            </td>
            <td>{this.props.number_of_bids}</td>
            <td>
              <a href = "#" data-id = {this.props.id} className="link-style nav-link btn-info action-link" onClick={this.handleProjectView}>Bid on Project</a>
              <a href = "#" data-id = {this.props.id} className="link-style nav-link btn-info action-link" onClick={this.handleBidsView}>View Bids</a>
            </td>
          </tr>
      )
    }
}

export default ProjectDetail;
