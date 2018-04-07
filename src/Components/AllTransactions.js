import React, { Component } from 'react';
import axios from 'axios';
import Transaction from './Transaction'
import ProjectSearchBar from './ProjectSearchBar'
import {connect} from 'react-redux';
import allreducers from '../reducers';
import reducer from '../reducers/all_projects';
import Pagination from './Pagination'
import Moment from 'react-moment';

class AllTansactions extends Component {

  constructor(){
    super();
    this.state = { data: [], currentPage: 1, perPageRows: 10 };
    // this.handleSearchBar = this.handleSearchBar.bind(this);
    // this.handlePageChange= this.handlePageChange.bind(this);
  }
  
  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
    })
  }

  // handlePageChange(e) {
  //   this.setState({currentPage: Number(e.target.dataset.id)})
  // }

  // handleNextPaginationButton(e) {
  //   const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
  //   if(this.state.data != [] && this.state.currentPage != Math.ceil(total_pages)){
  //     this.setState({currentPage: Number(this.state.currentPage + 1)})      
  //   }
  // }

  // handlePrevPaginationButton(e) {
  //   if(this.state.data != [] && this.state.currentPage != 1){
  //     this.setState({currentPage: Number(this.state.currentPage - 1)})
  //   }
  // }

  componentDidMount(){
    var user_id = localStorage.user_id;
    var self = this;
    axios.get('http://localhost:3001/past_payments?u_id=' + user_id, { withCredentials: true })
    .then((response) => {
      if(response.data.data_present){
        self.setState({data: response.data.rows, values_present: true})
      }
    })
  }

  render() {
    let transaction_list, pagination_list=null;
    if(this.state.data != []){
      // const indexOfLastTodo = this.state.currentPage * this.state.perPageRows;
      // const indexOfFirstTodo = indexOfLastTodo - this.state.perPageRows;
      // const currentTodos = this.state.data.slice(indexOfFirstTodo, indexOfLastTodo);
      // const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
      // const page_numbers = [];
      // for (let i = 1; i <= Math.ceil(this.state.data.length / this.state.perPageRows); i++) {
      //   page_numbers.push(i);
      // }  
      // pagination_list = page_numbers.map(number => {
      //   return (
      //     <li class="page-item" key= {number} data-id={number} onClick={this.handlePageChange} ><a data-id={number} class="page-link" href="#">{number}</a></li>
      //   );
      // });
      // if(currentTodos != null){
      //   projectList = currentTodos.map(project => {
      //     return(
      //       <ProjectDetail key = {project.id} id = {project.id} number_of_bids = {project.bids.length}  name={project.title} description={project.description} skills_required = {project.skills_required}
      //       max_budget = {project.max_budget} min_budget = {project.min_budget} employer_id = {project.users[0].id} employer_name={project.users[0].name}   />
      //     )
      //   })
      // }

      transaction_list = this.state.data.map(transaction => {
        var date = <Moment>{transaction.date}</Moment>
        return(
          <Transaction key = {transaction.id} id = {transaction.id} type = {transaction.transaction_type} amount = {transaction.amount}
          date = {date} description = {transaction.description}    />
        )
      })
    }
    return (
      <div className= "container">
        <h1 id = "table_header" class="display-4">Transaction History</h1>
        {/* <ProjectSearchBar handleSearchBar={this.handleSearchBar}/> */}
        <table className="table details-table table-striped table-bordered">
          <thead className = "table-header">
            <tr>
              <th scope="col">Transaction Type</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            { transaction_list }
          </tbody>
        </table>
        {/* <Pagination handlePrevPaginationButton = {this.handlePrevPaginationButton.bind(this)} handleNextPaginationButton = {this.handleNextPaginationButton.bind(this)}
          handlePageChange = {this.handlePageChange.bind(this)} pagination_list = {pagination_list}/> */}
      </div>
    )
  }
}

export default AllTansactions;
