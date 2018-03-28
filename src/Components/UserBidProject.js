import React, { Component } from 'react';
import axios from 'axios';

class ProjectDetail extends Component {
  constructor(){
    super();
    this.handleProjectNameClick = this.handleProjectNameClick.bind(this);
    this.handleEmployerNameClick = this.handleEmployerNameClick.bind(this);
  }

  handleProjectNameClick(e){
    localStorage.setItem('project_id', e.target.dataset.attr);
    window.location.href = "http://localhost:3000/project-detail"
  }

  handleEmployerNameClick(e){
    localStorage.setItem('profile_id', e.target.dataset.employerid);
    window.location.href = "http://localhost:3000/profile"
  }

  render() {
      let status_of_project;
      if(this.props.assigned_to == ""){
        status_of_project = "PENDING";
      }
      else if(this.props.assigned_to == localStorage.user_id)
      {
        status_of_project = "ASSIGNED TO YOU";
      }
      else{
        status_of_project = "ASSIGNED TO SOMEONE ELSE";
      }
      return (
          <tr>
            <td>
            <a data-attr = {this.props.project_id} onClick={this.handleProjectNameClick} className="project-name" href="#">{this.props.project_name}</a>
            </td>
            <td>
            <a data-employerid = {this.props.employer_id} onClick={this.handleEmployerNameClick} className="project-name" href="#">{this.props.employer_name}</a>
            </td>
            <td>{this.props.avg_bid}</td>
            <td>{this.props.user_bid}</td>
            <td class = "status">{status_of_project}</td>
          </tr>
      )
    }
}

export default ProjectDetail;
