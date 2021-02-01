import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';

class ImageUpload extends Component{

  constructor(props){
    super(props);
    this.state = {
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      "caseStudy_File"    :"",
      "configData"        : props && props.configData ? props.configData : [],       
      "fileArray"         : props && props.fileArray ? props.fileArray : [],       
      "fileType"          : props && props.fileType ? props.fileType : [],       
      filenames            : [],
    }
  }
 
  componentWillReceiveProps(nextProps){
  
  }
 
  componentDidMount() {
    localStorage.setItem("fileArray",this.state.fileArray);
    var fileType   =  this.props.fileType;
    this.setState({
      fileType : fileType
    },()=>{
      axios
      .get('/api/projectSettings/get/one/S3')
      .then((response)=>{
        if(response&&response.data){
          const config = {
              bucketName      : response.data.bucket,
              region          : response.data.region,
              accessKeyId     : response.data.key,
              secretAccessKey : response.data.secret,
          }
          this.setState({
            config : config
          })
        }
      })
      .catch(function(error){
        if(error.message === "Request failed with status code 401")
        {
             swal("Your session is expired! Please login again.","", "error");
             this.props.history.push("/");
        }
      })
    })
  }
 

  uploadImage(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      if (newFile) {
        var ext = newFile.name.split('.').pop();
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                  var obj1={
                    imgPath : Data.location,
                  }
                  var fileArray = this.state.fileArray;
                  fileArray.push(obj1);
                  this.setState({
                    fileArray : fileArray
                  },()=>{
                    var ImageLocation = JSON.stringify(this.state.fileArray);
                    localStorage.setItem("ImageLocation",ImageLocation);
                  })
              })
              .catch((error)=>{
              })
          }else{        
            swal("Image not uploaded","Something went wrong");
          }
        }else{
          swal("Please upload Image","Only Upload Images format (jpg,png,jpeg)"); 
        }
      }
    }
  }

  uploadFiles(event){
   event.preventDefault();
   let self = this;
   if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file        = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile     = new File([file],newFileName);
      this.setState({
                    newFile : newFile,
                  })
      if (newFile) {
        var ext = newFile.name.split('.').pop();

        if(ext=="DOC" || ext=="DOCX" || ext=="PDF" || ext=="XLS" || ext=="XLSX"  || ext=="PPT" || ext=="PPTX" || ext=="TXT"||
          ext=="doc" || ext=="docx" || ext=="pdf" || ext=="xls" || ext=="xlsx" || ext=="ppt" || ext=="pptx" || ext=="txt"){
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                  var fileName = file.name;
                  var obj2={
                      fileName : fileName
                  }
                  var obj1={
                    filePath : Data.location,
                  }
                  var filenames =this.state.filenames;
                  var fileArray = this.state.fileArray;
                  filenames.push(obj2);
                  fileArray.push(obj1);
                  this.setState({
                    ext       :ext,
                    filenames : filenames,
                    fileArray : fileArray
                  },()=>{
                    var fileLocation = JSON.stringify(this.state.fileArray);
                    localStorage.setItem("fileLocation",fileLocation);
                  })
              })
              .catch((error)=>{
              })
          }else{        
            swal("File not uploaded","Something went wrong");
          }
        }else{
          swal("Please upload file","Only Upload  File format (jpg,png,jpeg)"); 
        }
      }
    }
  }

  deleteImage(e){
    e.preventDefault();
    var index = e.target.getAttribute('id');
    var filePath = e.target.getAttribute('data-id');
    var data = filePath.split("/");
    var imageName = data[4];
    if(index){
      swal({
        title: "Are you sure you want to delete this image?",
        text: "Once deleted, you will not be able to recover this image!",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var array = this.state.fileArray; // make a separate copy of the array
          array.splice(index, 1);
          swal("abc", "Image deleted successfully");
          this.setState({
            fileArray: array
          });
        }else {
          swal("Are you sure you want to delete this image?","Your image is safe!");
        }
      });
    }
  }

  deleteItem(event){
    event.preventDefault();
    var configData =  this.props.configData;
    var id = event.target.getAttribute('data-id');
    if(id){
      swal({
        title: "Are you sure you want to delete this File?",
        text: "Once deleted, you will not be able to recover this File!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
            axios({
                method: configData.deleteMethod,
                url   : configData.apiLink+id
            }).then((response)=> {
                if(response.data=='workspace deleted'){
                  swal("Workspace deleted successfully");
                  this.props.history.push(configData.pageURL);
                  window.location.reload();
                 
                }
              })
              .catch(function (error) {
                    if(error.message === "Request failed with status code 401")
                      {
                           swal("Your session is expired! Please login again.","", "error");
                           this.props.history.push("/");
                      }
              });
        } else {
          swal("Your information is safe!");
        }
      });
    }
  }

  render() {
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 row padTopC">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add {this.state.fileType} <span className="astrick">*</span></h5>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="clr_k ">
                  <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon">
                    <img src="/images/Upload-Icon.png"/>
                  </div>
                  <div  className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center below_text">
                   <b className="text_k11"></b>
                   <span className="under_ln"><h6>Choose  {this.state.fileType}</h6></span>
                  </div>    
                  <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.state.fileType === "Image" ? this.uploadImage.bind(this) : this.uploadFiles.bind(this)} ref="workspaceImg"  className="form-control click_input" id="upload-file2" />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgdetails">{this.state.fileType=== "Image" ? "(Max size: 1 Mb, Format: JPEG, PNG)" : "(Max size: 1 Mb, Format: DOC, PDF, XLS)"} </div>
            </div>
            {
              this.state.fileArray==null?
              null
              :
              this.state.fileArray.map((data,index)=>{
                return(
                  <div  key={index} >
                    {
                      this.state.fileType==="Image" ?
                      <div  className="col-lg-3 col-md-4 col-sm-12 col-xs-12" >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                          <h5 className="h5Title col-lg-10 col-md-10 col-sm-12 col-xs-12"> Image {index+1}</h5>
                          <label id={index} className="pull-right custFaTimes crossLabel" title="Delete image" data-id={data.imgPath} onClick={this.deleteImage.bind(this)}>X</label>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <div className="imgcss" >
                            <img className="img-responsive imgheight" src={data.imgPath}/>
                          </div>
                        </div>
                      </div>
                    : ""
                    }
                  </div>
                )
              })
            }
            {
              this.state.fileArray.length<=0?
              null         
              :
              <div>
             
                    <div>
                      {
                        this.state.fileType ==="File" ?
                        <div  className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row padTopC">
                          <p className="fileName">File Uploaded</p>
                          {
                            this.state.filenames && this.state.filenames.length > 0 ?
                            this.state.filenames.map((a, index)=>{
                              return(
                                <div  key={index}>
                                  <p  className="">{a.fileName}</p>
                                    {}
                                  <div>
                                
                                  </div>
                                </div>
                              )
                            })
                          :
                            null
                          }
                        </div>
                      :
                        null
                      }
                    </div>
             
              </div>
            }
        </div>
      </div>  
    );
  }
}
export default ImageUpload