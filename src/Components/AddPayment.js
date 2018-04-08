import React, { Component } from 'react';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert2'

class AddPayment extends Component {

  constructor(){
    super();
    this.state = {amount: "", name: "", cvv: "", c_no: "", month: "01", year: "2018"}
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e){
    e.preventDefault();
    let amountErrorPresent = !this.validateAmountFormat(this.state.amount) ? true : false;
    let nameErrorPresent = !this.validateNameFormat(this.state.name) ? true : false;
    let cvvErrorPresent = !this.validateCVVFormat(this.state.cvv) ? true : false;
    let cardNumberErrorPresent = !this.validateCardNumberFormat(this.state.c_no) ? true : false;
    let dateErrorPresent = !this.validateDateFormat(this.state.month, this.state.year) ? true : false;
    if(amountErrorPresent || nameErrorPresent || cvvErrorPresent || cardNumberErrorPresent || dateErrorPresent) {return;}
    let user_id = localStorage.getItem("user_id");
    if( user_id != null){
      var self = this;
      let formData = {amount: this.state.amount , user_id: user_id}
      axios.post("http://localhost:3001/update_balance", formData)
      .then(function (response) {
        self.setState({
          amount: '',
          name: '', 
          cvv: '',
          c_no: '',
          month: '01',
          year: '2018'
        })
        swal({
          type: 'success',
          title: 'Approved',
          text: 'You have Successfully updated your balance'
        })
        self.props.handleBalanceUpdate();
      })
    }
  }

  validateAmountFormat(amount){
    if(amount.trim() == ""){
      document.getElementById("amount-error").innerHTML = "Please enter Amount";
      return false;
    }
    return true;
  }

  validateNameFormat(name){
    if(name.trim() == ""){
      document.getElementById("name-error").innerHTML = "Please enter Cardholder Name";
      return false;
    }
    return true;
  }

  validateCVVFormat(cvv){
    if(cvv.trim() == ""){
      document.getElementById("cvv-error").innerHTML = "Please enter CVV";
      return false;
    }
    else if(cvv.split("").length != 3){
      document.getElementById("cvv-error").innerHTML = "Please enter valid CVV";
      return false;
    }
    return true;
  }

  validateCardNumberFormat(card_number){
    if(card_number.trim() == ""){
      document.getElementById("card-error").innerHTML = "Please enter Card Number";
      return false;
    }
    else{
      var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
      var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
      var amexpRegEx = /^(?:3[47][0-9]{13})$/;
      if (visaRegEx.test(card_number)) {
        return true;
      } else if(mastercardRegEx.test(card_number)) {
        return true;
      } else if(amexpRegEx.test(card_number)) {
        return true;
      }
      else{
        document.getElementById("card-error").innerHTML = "Please enter valid Card Number";
        return false;
      }
    }
  }

  validateDateFormat(month, year){
    var date = new Date(month + "/01/" + year);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today) {
      swal({
        type: 'error',
        title: 'Failed',
        text: 'Your Credit Card is Expired!'
      })
      return false;
    }
    return true;
  }
  
  handleAmountChange(e){
    this.setState({ amount: e.target.value });
    e.target.value == "" ? document.getElementById("amount-error").innerHTML = "Please enter Amount" : 
      document.getElementById("amount-error").innerHTML = "";
  }

  handleOwnerNameChange(e){
    this.setState({ name: e.target.value });
    e.target.value == "" ? document.getElementById("name-error").innerHTML = "Please enter Cardholder Name" : 
      document.getElementById("name-error").innerHTML = "";
  }

  handleCVVChange(e){
    this.setState({ cvv: e.target.value });
    e.target.value == "" ? document.getElementById("cvv-error").innerHTML = "Please enter CVV" : 
      document.getElementById("cvv-error").innerHTML = "";
  }

  handleCardNumberChange(e){
    this.setState({ c_no: e.target.value });
    e.target.value == "" ? document.getElementById("card-error").innerHTML = "Please enter Card Number" : 
      document.getElementById("card-error").innerHTML = "";
  }

  handleChangeMonth(e){
    this.setState({ month: e.target.value });
  }

  handleChangeYear(e){
    this.setState({ year: e.target.value });
  }

  handleButtonClick(e){
    document.getElementById("payment-add").style.display = "block";
    document.getElementById("payment-withdraw").style.display = "none";
  }

  render() {
    return (
      <div class="modal-body row">
        <button type="button" onClick={this.handleButtonClick.bind(this)} id = "add-payment-button" class="btn btn-info btn-lg btn-block">Add Payment</button>
        <div id="payment-add">
          <div class="creditCardForm">
            <div class="heading">
                <h1>Confirm Purchase</h1>
            </div>
            <div class="payment">
                <form onSubmit= {this.handleFormSubmit}>
                  <div class="form-group" id="card-number-field">
                      <label for="cardNumber">Amount($)</label>
                      <input type="number" class="form-control" onChange={this.handleAmountChange.bind(this)} value={ this.state.amount } id="cardNumber" />
                  </div>
                  <div id = "amount-error" class= "error"></div>
                  <br/>
                  <div class="form-group owner">
                      <label for="owner">Owner</label>
                      <input type="text" class="form-control" id="owner" value={ this.state.name } onChange={this.handleOwnerNameChange.bind(this)} />
                  </div>
                  <div class="form-group CVV">
                      <label for="cvv">CVV</label>
                      <input type="number" class="form-control" value={ this.state.cvv } onChange={this.handleCVVChange.bind(this)} id="cvv" />
                  </div>
                  <div id = "name-error" class= "error"></div>
                  <div id = "cvv-error" class= "error"></div>
                  <div class="form-group" id="card-number-field">
                      <label for="cardNumber">Card Number</label>
                      <input type="number" class="form-control" value={ this.state.c_no } onChange={this.handleCardNumberChange.bind(this)} id="cardNumber" />
                  </div>
                  <div id = "card-error" class= "error"></div>
                  <div class="form-group" id="expiration-date">
                      <label>Expiration Date</label>
                      <select value={ this.state.month } onChange={this.handleChangeMonth.bind(this)}>
                          <option value="01">January</option>
                          <option value="02">February </option>
                          <option value="03">March</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">August</option>
                          <option value="09">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                      </select>
                      <select value={ this.state.year } onChange={this.handleChangeYear.bind(this)}>
                          <option value="2018"> 2018</option>
                          <option value="2019"> 2019</option>
                          <option value="2020"> 2020</option>
                          <option value="2021"> 2021</option>
                          <option value="2022"> 2021</option>
                          <option value="2023"> 2021</option>
                          <option value="2024"> 2021</option>
                      </select>
                  </div>
                  <div class="form-group" id="credit_cards">
                      <img src={require('../img/visa.jpg')} id="visa" />
                      <img src={require('../img/mastercard.jpg')} id="mastercard" />
                      <img src={require('../img/amex.jpg')} id="amex" />
                  </div>
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

export default AddPayment;
