import React, { Component } from 'react';
import axios from 'axios';
import ProjectDetail from './ProjectDetail'
import ProjectSearchBar from './ProjectSearchBar'
import {connect} from 'react-redux';
import allreducers from '../reducers';
// import UserSession from '../reducers/user-session'
import reducer from '../reducers/all_projects';
import Pagination from './Pagination'

//import './style.css';



class AllProjects extends Component {

  constructor(){
    super();
    this.state = { data: [], currentPage: 1, perPageRows: 10 };
    this.handleSearchBar = this.handleSearchBar.bind(this);
    this.handlePageChange= this.handlePageChange.bind(this);
  }
  
  componentWillMount(){
    // var self = this;
    // axios.get('http://localhost:3001/check_session', { withCredentials: true })
    // .then((response) => {
    //   if(response.data.session.email ==  undefined){
    //     window.location.href = "http://localhost:3000/signin";
    //   }
    // })
  }

  handleSearchBar(e){
    var self = this;
    if(e.target.value != ""){
      axios.get('http://localhost:3001/search_projects?val=' + e.target.value, { withCredentials: true })
      .then((response) => {
        debugger
        self.setState({data: response.data.rows})
      })
    }
    else{
      this.props.get_all_projects(this);
    }
  }

  handlePageChange(e) {
    this.setState({currentPage: Number(e.target.dataset.id)})
  }

  handleNextPaginationButton(e) {
    debugger
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
    this.props.get_all_projects(this);
  }

  render() {
    let projectList, pagination_list=null;
    if(this.state.data != []){
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
          return(
            <ProjectDetail key = {project.id} id = {project.id} number_of_bids = {project.bids.length}  name={project.title} description={project.description} skills_required = {project.skills_required}
            max_budget = {project.max_budget} min_budget = {project.min_budget} employer_id = {project.users[0].id} employer_name={project.users[0].name}   />
          )
        })
      }
    }
    
    return (
      <div className= "container">
        <ProjectSearchBar handleSearchBar={this.handleSearchBar}/>
        <table className="table details-table table-striped table-bordered">
          <thead className = "table-header">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Skills Required</th>
              <th scope="col">Budget Range($)</th>
              <th scope="col">Employer Name</th>
              <th scope="col">Number of Bids</th>
              <th scope="col">Actions</th>
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

function mapStateToProps(state){
  return{
    all_projects: state.all_projects
  }
}

function mapDispatchToProps(dispatch){
  return{
    get_all_projects: (obj) => {
      var self = obj;
      axios.get("http://localhost:3001/get_all_projects", { withCredentials: true })
      .then(function (response) {
        if(response.data.rows != null){
          let user_detail = response.data.rows;
          dispatch({type: 'page_load', payload: response.data.rows});
          self.setState({
            data: response.data.rows
          })
          return;
        }
        return;
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProjects)
