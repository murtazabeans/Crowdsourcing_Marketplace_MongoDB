import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2'

class ImageUpload extends Component {
  constructor(){
    super();
    this.state = {fileType: '', file: ''}
  }

  componentDidMount(){
    this.loadImageNameFromServer();
  }

  loadImageNameFromServer(){
    let id = localStorage.user_id
    if( id != null){
      var self = this;
      axios.get("http://localhost:3001/get_user?id=" + id)
      .then(function (response) {
        if(response.data.rows != null){
          let user_detail = response.data.rows;
          console.log(response);
          self.setState({
            fileType: user_detail.profile_image_name
          })
          return;
        }
        return;
      })
    } 
  }

  handleImageChange(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        file: file,
        });
      }
      reader.readAsDataURL(file);
      swal({
        type: 'success',
        title: 'Image Added',
        text: 'You have added the Image successfully! Click on upload image to update your profile image'
      })
  }

  handleFormSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('user_id', localStorage.user_id);
    const config = {
      headers: {
      'content-type': 'multipart/form-data'
      }
    }
    var self = this;
    if(this.state.file != ""){
      axios.post("http://localhost:3001/upload-Image", formData, config)
      .then(function (response) {
        if(response.data.fileType != null){
          let user_detail = response.data.rows;
          console.log(response);
          self.setState({
            fileType: "" + localStorage.user_id + "." + response.data.fileType
          })
          swal({
            type: 'success',
            title: 'Congratulations',
            text: 'You have Updated your Profile Picture'
          })
          return;
        }
        return;
      })
    }
    else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'You have not entered any image!'
      })
      return;
    }
  }

  render(props) {
    let image_tag = null;
    if(this.state.fileType != ""){
      image_tag = <img id = "profile_image" src= { require('../images/' + this.state.fileType) } alt="Smiley face" height="100px" width="100px" />
    }
    else{
      image_tag = <img id = "profile_image" src= { require('../images/default.png') } alt="Smiley face" height="100px" width="100px" />
    }
    return (
      <div className="image-form-group">
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <label for="file-upload" className="custom-file-upload form-choose">
                      Choose Profile Image
          </label>
         <input id="file-upload" type="file" onChange={ this.handleImageChange.bind(this) } />
          <button className="custom-file-upload" id = "img-form-submit" type="submit" onClick={this._handleSubmit}>Upload Image</button>
        </form>

        {image_tag}

      </div>
    )
  }
}
export default ImageUpload;