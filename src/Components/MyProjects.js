import React, { Component } from 'react';
import MyProject from './MyProject';
import axios from 'axios';
import Pagination from './Pagination'
import ProjectSearchBar from './ProjectSearchBar'

class MyProjects extends Component {

  constructor(){
    super();
    this.state = { data: [], currentPage: 1, perPageRows: 10 };
    this.handleSearchBar = this.handleSearchBar.bind(this);
    this.handlePageChange= this.handlePageChange.bind(this);
  }

  componentDidMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
    })
  }

  handlePageChange(e) {
    this.setState({currentPage: Number(e.target.dataset.id)})
  }

  handleNextPaginationButton(e) {
    const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
    if(this.state.data != [] && this.state.currentPage != Math.ceil(total_pages)){
      this.setState({currentPage: Number(this.state.currentPage + 1)})      
    }
  }

  handlePrevPaginationButton(e) {
    if(this.state.data != [] && this.state.currentPage != 1){
      this.setState({currentPage: Number(this.state.currentPage - 1)})
    }
  }

  componentDidMount(){
    var user_id = localStorage.user_id;
    this.loadProjectsFromServer(user_id);
  }

  loadProjectsFromServer(user_id){
    var self = this;
    axios.get("http://localhost:3001/get_all_user_published_projects?u_id=" + user_id)
    .then(function (response) {
      if(response.data.rows != null){
        let user_detail = response.data.rows;
        console.log(response);
        self.setState({
          data: response.data.rows
        })
        return;
      }
      return;
    })
  }

  handleSearchBar(e){
    var self = this;
    if(e.target.value != ""){
      axios.get('http://localhost:3001/search_for_user_published_projects?val=' + e.target.value + '&u_id=' + localStorage.user_id, { withCredentials: true })
      .then((response) => {
        response.data.data_present ? self.setState({data: response.data.rows}) : self.setState({data: []})
      })
    }
    else{
      this.loadProjectsFromServer(localStorage.user_id);
    }
  }

  render() {
    let projectList, pagination_list = null;
    if(this.state.data != null){
      const indexOfLastTodo = this.state.currentPage * this.state.perPageRows;
      const indexOfFirstTodo = indexOfLastTodo - this.state.perPageRows;
      const currentTodos = this.state.data.slice(indexOfFirstTodo, indexOfLastTodo);
      const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
      const page_numbers = [];
      for (let i = 1; i <= Math.ceil(this.state.data.length / this.state.perPageRows); i++) {
        page_numbers.push(i);
      }
      
      pagination_list = page_numbers.map(number => {
        return (
          <li class="page-item" key= {number} data-id={number} onClick={this.handlePageChange} ><a data-id={number} class="page-link" href="#">{number}</a></li>
        );
      });  
      if(currentTodos != null){
        projectList = currentTodos.map(project => {
          let freelancer_id = project.freelancer.length == 0 ? "" : project.freelancer[0].id;
          let freelancer_name = project.freelancer.length == 0 ? "" : project.freelancer[0].name;
          let date_of_completion = project.date_of_completion == undefined ? "" : project.date_of_completion;
          let price = 0;
          for(var i = 0; i < project.bids.length; i++){
            price += parseInt(project.bids[i].price);
          }
          let avgPrice = price == 0 ? "$0" : "$" + parseFloat((price/ project.bids.length)).toFixed(2);
          return(
            <MyProject key = {project.id} freelancer_id= {freelancer_id} project_name = {project.title} avg_bid={avgPrice}
            project_id = {project.id} assigned_to = {freelancer_name} completion_date={date_of_completion}   />
          )
        })
      }      
    }
    return (
      <div class = "container">
         <h1 id = "table_header" class="display-4">Your Projects</h1>
        <ProjectSearchBar handleSearchBar={this.handleSearchBar}/>
        <table class="table details-table table-striped table-bordered">
          <thead class = "table-header">
            <tr>
              <th scope="col">Project Name</th>
              {/* <th scope="col">Employer</th> */}
              <th scope="col">Average Bid(in $)</th>
              <th scope="col">FreeLancer Name</th>
              <th scope="col">Estimate Project Completion Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            { projectList }
          </tbody>
        </table>
        <Pagination handlePrevPaginationButton = {this.handlePrevPaginationButton.bind(this)} handleNextPaginationButton = {this.handleNextPaginationButton.bind(this)}
          handlePageChange = {this.handlePageChange.bind(this)} pagination_list = {pagination_list}/>
      </div>
    )
  }
}
export default MyProjects;