import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';


class MyProject extends Component {
  constructor(){
    super();
    this.handleProjectNameClick = this.handleProjectNameClick.bind(this);
    this.handleEmployerNameClick = this.handleEmployerNameClick.bind(this);
    this.handleFreeLancerNameClick = this.handleFreeLancerNameClick.bind(this)
  }

  handleProjectNameClick(e){
    localStorage.setItem('project_id', e.target.dataset.attr);
    window.location.href = "http://localhost:3000/project-detail"
  }

  handleEmployerNameClick(e){
    localStorage.setItem('profile_id', e.target.dataset.employerid);
    window.location.href = "http://localhost:3000/profile"
  }

  handleFreeLancerNameClick(e){
    localStorage.setItem('profile_id', e.target.dataset.freelancerid);
    window.location.href = "http://localhost:3000/profile"
  }

  getProjectStatus(completion_date){
    if(completion_date == "" || completion_date == undefined){
      return "FreeLancer not hired Yet!"
    }
    else{
      var current_date = new Date();
      var dd = current_date.getDate();
      var mm = current_date.getMonth()+1; //January is 0!
      var yyyy = current_date.getFullYear();

      if(dd<10) {
          dd = '0'+dd
      } 

      if(mm<10) {
          mm = '0'+mm
      } 

      var current_date = new Date(mm + '/' + dd + '/' + yyyy)
      //var current_date = new Date(y,m,d);
      var mydate=new Date(completion_date);
      if(mydate >= current_date){
        return "Project in Progress!"
      }
      else{
        return "Project Completed!"
      }
    }
  }

  render() {    
      let freelancer_name_link = null;
      const status = this.getProjectStatus(this.props.completion_date);

      if(this.props.assigned_to == ""){
        freelancer_name_link = "No FreeLancer Hired Yet!"
      }
      else{
        freelancer_name_link = <a data-freelancerId = {this.props.freelancer_id} onClick={this.handleFreeLancerNameClick} className="project-name" href="#" >{this.props.assigned_to}</a>
      }
      let date_of_completion;
      if(this.props.completion_date == undefined){
        date_of_completion = "Project not Assigned Yet!";
      }
      else{
        var dt = this.props.completion_date;
        date_of_completion =  <Moment>{dt}</Moment>
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
            <td>{freelancer_name_link}</td>
            <td>{date_of_completion}</td>
            <td class = "status">{status}</td>
          </tr>
      )
    }
}

export default MyProject;
