import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import axios                from 'axios';
import swal                 from 'sweetalert';

class TimeFormat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeFormat         : "24 Hrs",    
      timeFormatValue    : "",    
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.getData();
  }
 
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  } 

  getData(){
    axios.get('/api/timeformat/get')
         .then((response) => { 
          console.log("response = ", response.data)  
            if(response.data.timeFormat){
              this.setState(
              {
                timeFormatValue   : response.data.timeFormat, 
                timeFormat        : response.data.timeFormat,
                id                : response.data._id
              },()=>{
                console.log(" TimeFormat==>", this.state.timeFormat);
              });
            }
         })
         .catch((error) => {console.log(" Error getData() => ", error);});
  }

  submit(event){
    event.preventDefault();

    var formvalue ={
      timeFormat   : this.state.timeFormat,
      createdBy    : localStorage.getItem("user_ID")
    }
    console.log("formvalue ===> ",formvalue);
    axios.post('/api/timeformat/post',formvalue)
         .then((response)=> {
            console.log("response ===>",response.data);
            this.getData();
            swal({                
                  text: "Time Format Details Added Successfully!",
            });
            this.getData();
         })
         .catch((error)=> {
            swal({                
                  text: "Failed to Add Time Format Details!",
                });
         })  
  }

  update(event){
    event.preventDefault();
      var formvalues ={
        id         : this.state.id,
        timeFormat : this.state.timeFormat,
        createdBy  : localStorage.getItem("user_ID")
      }
      axios.patch('/api/timeformat/patch',formvalues)
      .then((response)=> {
        this.getData();
        swal({                
              text: "Time Format Details Updated successfully!",
            });
      })
      .catch((error)=> {
        swal({                
              text: "Failed to Update Time Format Details!",
            });
      })
  }

  render() {
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">Time Format</h4>
          </div>
          <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"margin-bottom" : "30px"}}>
            <form id="CompanyPaymentGatewayForm">
              <div className="form-margin col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <label className="labelform">Time Format <span className="requiredsign">*</span></label>
              </div>
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12 valid_box">
                <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                  <input className="UMname has-content" type="radio" id="12Hr" name="timeFormat" value="12 Hrs" style={{"height": "15px", "width": "25px"}}
                         onChange={this.handleChange.bind(this)} 
                         checked={this.state.timeFormat === "12 Hrs"}
                  />
                  <label className="labelform">12 Hrs</label>
                </div>
                <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12 valid_box">
                  <input className="UMname has-content" type="radio" id="24Hr" name="timeFormat" value="24 Hrs" style={{"height": "15px", "width": "25px"}} 
                         onChange={this.handleChange.bind(this)} 
                         checked={this.state.timeFormat === "24 Hrs"}
                  />
                  <label className="labelform">24 Hrs</label>
                </div>
              </div>              
              <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                {
                    this.state.timeFormatValue === "" ?
                        <button className="col-lg-4 col-lg-offset-4 col-md-3 col-md-offset-4 col-xs-12 col-sm-12 col-xs-12 btn button3 topMargin outlinebox" 
                                type="submit" onClick={this.submit.bind(this)} style={{"margin-top" : "12%"}}>Submit</button>
                    :
                        <button className="col-lg-4 col-lg-offset-4 col-md-3 col-md-offset-4 col-xs-12 col-sm-12 col-xs-12 btn button3 topMargin outlinebox center-block" 
                                type="update" onClick={this.update.bind(this)} style={{"margin-top" : "12%"}}>Update</button>
                }                
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

export default TimeFormat;
