import React, { Component } from 'react';
import axios from 'axios';

class Transaction extends Component {

  constructor(){
    super();
  }

  render() {
    
      return (
          <tr>
            <td>{this.props.type}</td>
            <td>{this.props.amount}</td>
            <td>{this.props.date}</td>
            <td>{this.props.description}</td>
          </tr>
      )
    }
}

export default Transaction;
