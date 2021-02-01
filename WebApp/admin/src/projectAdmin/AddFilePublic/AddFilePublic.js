import React, { Component }   from 'react';
// import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
// import { deleteFile }         from 'react-s3';
// import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
// import "./AddFile.css";

class AddFile extends Component{

  constructor(props){
    super(props);
    this.state = {
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      "CheckFile"         :false,
      "caseStudy_File"    :"",  
      "configData"        : props && props.configData  ? props.configData : {},        
      "fileArray"         : props && props.fileArray   ? props.fileArray : [],        
      "imageArray"        : props && props.imageArray  ? props.imageArray : [],        
      "fileType"          : props && props.fileType    ? props.fileType : {},
      "action"            : props && props.action      ? props.action : "",
      "filenames"         : [],
      // fileArray           : [],
    }

  }
  
  componentWillReceiveProps(nextProps){
    // console.log('nextProps.imageArray', nextProps);  
    if(nextProps){
      this.setState({      
          "imageArray"      : nextProps.imageArray, 
          "fileArray"       : nextProps.fileArray
      })
    }
  }
  
  componentDidMount() {
    var configData =  this.props.configData;
    var fileType   =  this.props.fileType;
    console.log("confiigdata",configData);
    this.setState({
      fileType : fileType
    },()=>{
      // console.log("fileType",this.state.fileType)
    })
    axios
      // .get('http://cofficapi.iassureit.com/api/projectSettings/single/S3')
      .get('/api/projectSettings/get/one/S3')
      .then((response)=>{
          console.log("s3Image---response",response);
       
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : configData.dirName,
                          region          : response.data.region,
                          accessKeyId     : response.data.key,
                          secretAccessKey : response.data.secret,
                       }
        this.setState({
          config : config
        },()=>{
          // console.log("config",this.state.config)
        })
      })
      .catch(function(error){
        console.log(error);
          if(error.message === "Request failed with status code 401")
              {
                   swal("Your session is expired! Please login again.","", "error");
                   this.props.history.push("/");
              }
      })
  }
  
  handleChange(event){
    event.preventDefault();
  }

  uploadImage(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      // console.log("file",newFile);
      if (newFile) {
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();
        if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){ 
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                  var obj1={
                    imgPath : Data.location,
                  }
                  var imageArray = this.state.imageArray;
                  imageArray.push(obj1);
                  this.setState({
                    imageArray : imageArray
                  },()=>{
                    this.props.getFile(this.state.fileArray, this.state.filenames,this.state.imageArray)
                    // console.log("imageArray",this.state.imageArray)
                  })
              })
              .catch((error)=>{
                console.log(error);
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
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();

        if(ext==="DOC" || ext==="DOCX" || ext==="PDF" || ext==="XLS" || ext==="XLSX"  || ext==="PPT" || ext==="PPTX" || ext==="TXT"|| 
          ext==="doc" || ext==="docx" || ext==="pdf" || ext==="xls" || ext==="xlsx" || ext==="ppt" || ext==="pptx" || ext==="txt"){ 
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                // console.log("Data = ",Data);
                // console.log("newFile = ",newFile.name);
                  var fileName = file.name;
                  var obj2={
                      fileName : fileName
                  }
                  var obj1={
                    filePath : Data.location,
                    fileName : fileName

                  }
                  var filenames =this.state.filenames;
                  var fileArray = this.state.fileArray;
                  filenames.push(obj2);
                  fileArray.push(obj1);
                  this.setState({
                    ext       :ext,
                    CheckFile : true,   
                    filenames : filenames,
                    fileArray : fileArray
                  },()=>{
                    // console.log("filenames",this.state.fileArray);
                    this.props.getFile(this.state.fileArray, this.state.filenames,this.state.imageArray)
                    // console.log("fileArray",this.state.fileArray)
                    var fileLocation = JSON.stringify(this.state.fileArray);
                    localStorage.setItem("fileLocation",fileLocation);
                  })
              })
              .catch((error)=>{
                // console.log("formErrors");
                console.log(error);
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

  deleteFile(e){
    e.preventDefault();
    var index        = e.target.getAttribute('id');
    var filePath     = e.target.getAttribute('data-id');
    // console.log("this.state.fileArray",this.state.fileArray,"index",index,"filePath",filePath);
    var index = e.currentTarget.getAttribute('id');
    var filePath = e.currentTarget.getAttribute('data-id');
    var data = filePath.split("/");
    var imageName = data[4];
    if(index){
      swal({
        title: "Are you sure you want to delete this image?",
        text: "Once deleted, you will not be able to recover this image!",
       /* icon: "warning",*/
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var fileArray = this.state.fileArray; // make a separate copy of the array
          fileArray.splice(index, 1);
          swal("abc", "File deleted successfully");
          this.setState({
            fileArray: fileArray
          },()=>{
          });
        }else {
          swal("Are you sure you want to deletimageArraye this image?","Your image is safe!");
        }
      });
    }
  }

  deleteImage(e){
    e.preventDefault();
    var index = e.currentTarget.getAttribute('id');
    var filePath = e.currentTarget.getAttribute('data-id');
    // console.log("filePath===",filePath);
    var data = filePath.split("/");
    var imageName = data[4];
    if(index){
      swal({
        title: "Are you sure you want to delete this image?",
        text: "Once deleted, you will not be able to recover this image!",
       /* icon: "warning",*/
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var imageArray = this.state.imageArray; // make a separate copy of the array
          imageArray.splice(index, 1);
          swal("abc", "File deleted successfully");
          this.setState({
            imageArray: imageArray
          },()=>{
          });
        }else {
          swal("Are you sure you want to deletimageArraye this image?","Your image is safe!");
        }
      });
    }
  }

  deleteItem(event){
    event.preventDefault();
    // console.log('innnnn.....');
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
                if(response.data==='workspace deleted'){
                  swal("Workspace deleted successfully");
                  this.props.history.push(configData.pageURL);
                  window.location.reload();
                  
                  // $('#myModal'+this.state.deleteId).css('display','none');                  
                }
              })
              .catch(function (error) {
                  console.log(error);
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
    // console.log("this.state.fileArray",this.state.fileArray)
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp mt20 ">
            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 row padTopC">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add {this.state.fileType} <span className="astrick">*</span></h5>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="clr_k ">
                  <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon">
                    <img alt="Upload Image" src="/images/Upload-Icon.png"/>
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
              this.state.imageArray===null?
              null
              :
              this.state.imageArray && this.state.imageArray.length > 0 ?
              this.state.imageArray.map((data,index)=>{
                return(
                  <div  key={index} >
                    {
                      this.state.fileType==="Image" ? 
                      <div  className="col-lg-3 col-md-4 col-sm-12 col-xs-12" >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                          <h5 className="h5Title col-lg-10 col-md-10 col-sm-12 col-xs-12"> Image {index+1}</h5>
                          <label id={index} className="pull-right custFaTimes crossLabel" title="Delete image" data-id={data.imgPath} onClick={this.deleteImage.bind(this)}><i className="fa fa-times"></i></label>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <div className="imgcss" >
                            <img className="img-responsive imgheight"  alt="Upload Image" src={data.imgPath}/>
                          </div>
                        </div>
                      </div>
                    : ""
                    }
                  </div>
                )
              })
              :
              null  
            }
            {
              this.state.fileArray.length<=0?
              null          
              :
              <div>
              
                    <div>
                      {
                        this.state.fileType ==="File" ? 
                        <div  className="col-lg-9 col-md-9 col-sm-12 col-xs-12 row fileContainer textAlignCenter">
                       {/* {
                          this.state.CheckFile ?
                          <p className="fileName">File Uploaded</p>
                          :
                          null

                          }*/}
                          {
                            this.state.fileArray && this.state.fileArray.length > 0 ? 
                            this.state.fileArray.map((a, index)=>{
                                  // console.log("a",a)
                              return(
                                <div className="col-lg-3"  key={index}>
                                     <label id={index} className="pull-right custFaTimes crossLabel" title="Delete image" data-id={a.filePath} onClick={this.deleteFile.bind(this)}><i className="fa fa-times"></i></label>
                                <div >
                                 {
                                   a.fileName.split('.').pop()==="XLS" || a.fileName.split('.').pop() ==="XLSX"||a.fileName.split('.').pop() ==="xls" || a.fileName.split('.').pop() ==="xlsx"
                                   ?
                                    <img className="fileExt" alt="Icon" src="/images/exel2.png"/> 
                                    :
                                     ""
                                  }
                                  {
                                   ( a.fileName.split('.').pop() ==="PPT" || a.fileName.split('.').pop() === "PPTX" || a.fileName.split('.').pop() === "ppt" || a.fileName.split('.').pop() ==="pptx") ? 
                                    <img className="fileExt" alt="Icon" src="/images/powerpoint.jpeg"/> :""
                                  }
                                  {
                                 
                                    (a.fileName.split('.').pop() ==="pdf" ||a.fileName.split('.').pop() === "PDF") ? 
                                    <img className="fileExt" alt="Icon" src="/images/pdf.png"/> 
                                    :
                                    ""
                                  }
                                  {
                                    (a.fileName.split('.').pop() ==="doc" || a.fileName.split('.').pop() === "docx" || a.fileName.split('.').pop() === "DOC" || a.fileName.split('.').pop() ==="DOCX"|| a.fileName.split('.').pop() ==="txt" || a.fileName.split('.').pop() === "TXT") ? 
                                    <img className="fileExt" alt="Icon" src="/images/docs.png"/> : ""
                                  }
                                 
                                  </div>
                                  <p  className="">{a.fileName}</p>
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
export default AddFile
