import React, { Component } from 'react';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'

class WithdrawPayment extends Component {

  constructor(){
    super();
    this.state = {amount: "", account_number: "", checking_number: ""}
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e){
    e.preventDefault();
    let amountErrorPresent = !this.validateAmountFormat(this.state.amount) ? true : false;
    let accountErrorPresent = !this.validateAccountNumberFormat(this.state.account_number) ? true : false;
    let checkingErrorPresent = !this.validateCheckingNumberFormat(this.state.checking_number) ? true : false;
    
    if(amountErrorPresent || accountErrorPresent || checkingErrorPresent) {return;}
    let user_id = localStorage.getItem("user_id");
    if( user_id != null){
      var self = this;
      let formData = {amount: this.state.amount , user_id: user_id}
      axios.post("http://localhost:3001/withraw_amount", formData)
      .then(function (response) {
        if(!response.data.correctRequest){
          swal({
            type: 'error',
            title: 'Failed',
            text: 'Insufficient Balance'
          })
        }
        else{
          self.setState({
            amount: '',
            account_number: '', 
            checking_number: '',
          })
          swal({
            type: 'success',
            title: 'Congratulations',
            text: 'Your withdrawal is Successful!'
          })
        }
        self.props.handleBalanceUpdate();
      })
    }
  }

  validateAmountFormat(amount){
    if(amount.trim() == "" || isNaN(amount)){
      document.getElementById("withdraw-amount-error").innerHTML = "Please enter valid Amount";
      return false;
    }
    return true;
  }

  validateAccountNumberFormat(account_number){
    if(account_number.trim() == "" || isNaN(account_number)){
      document.getElementById("account-error").innerHTML = "Please enter valid Account Number";
      return false;
    }
    else if(account_number.split("").length < 7 || account_number.split("").length > 17) {
      document.getElementById("account-error").innerHTML = "Please enter valid Account Number";
      return false;
    }
    return true;
  }

  validateCheckingNumberFormat(checking_number){
    if(checking_number.trim() == "" || isNaN(checking_number)){
      document.getElementById("checking-error").innerHTML = "Please enter valid Checking Number";
      return false;
    }
    else if(checking_number.split("").length < 7 || checking_number.split("").length > 17) {
      document.getElementById("checking-error").innerHTML = "Please enter valid Checking Number";
      return false;
    }
    return true;
  }
  
  handleAmountChange(e){
    this.setState({ amount: e.target.value });
    e.target.value == "" ? document.getElementById("withdraw-amount-error").innerHTML = "Please enter valid Amount" : 
      document.getElementById("withdraw-amount-error").innerHTML = "";
  }

  handleAccountNumberChange(e){
    this.setState({ account_number: e.target.value });
    e.target.value == "" ? document.getElementById("account-error").innerHTML = "Please enter Account valid Number" : 
      document.getElementById("account-error").innerHTML = "";
  }

  handleCheckingChange(e){
    this.setState({ checking_number: e.target.value });
    e.target.value == "" ? document.getElementById("checking-error").innerHTML = "Please enter Routing valid Number" : 
      document.getElementById("checking-error").innerHTML = "";
  }

  handleButtonClick(e){
    document.getElementById("payment-add").style.display = "none"
    document.getElementById("payment-withdraw").style.display = "block"
  }

  render() {
    return (
      <div class="modal-body row">
        <button type="button" onClick = {this.handleButtonClick.bind(this)} id = "withdraw-payment-button" class="btn btn-info btn-lg btn-block">WithDraw Payment</button>
        <div id = "payment-withdraw">
          <div class="creditCardForm">
            <div class="heading">
                <h1>Confirm Withdraw</h1>
            </div>
            <div class="payment">
                <form onSubmit= {this.handleFormSubmit}>
                  <div class="form-group" id="card-number-field">
                      <label for="cardNumber">Amount($)</label>
                      <input type="number" class="form-control amount-field" onChange={this.handleAmountChange.bind(this)} value={ this.state.amount } id="cardNumber" />
                  </div>
                  <div id = "withdraw-amount-error" class= "error"></div>
                  <br/>
                                    
                  <div class="form-group" id="card-number-field">
                      <label for="cardNumber">Account Number</label>
                      <input type="number" class="form-control" value={ this.state.account_number } onChange={this.handleAccountNumberChange.bind(this)} id="cardNumber" />
                  </div>
                  <div id = "account-error" class= "error"></div>

                  <div class="form-group" id="card-number-field">
                      <label for="cardNumber">Checking Number</label>
                      <input type="number" class="form-control" value={ this.state.checking_number } onChange={this.handleCheckingChange.bind(this)} id="cardNumber" />
                  </div>
                  <div id = "checking-error" class= "error"></div>
                  
                <div class="form-group" id="pay-now">
                    <button type="submit" class="btn btn-default" id="confirm-purchase">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WithdrawPayment;
