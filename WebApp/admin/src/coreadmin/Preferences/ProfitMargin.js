import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import axios                from 'axios';
import swal                 from 'sweetalert';

class ProfitMargin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profitMargin      : "", 
      profitMarginValue : ""   
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
    axios.get('/api/preferences/get')
            .then((response) => { 
            console.log(" response==>", response.data);               
                this.setState(
                  { 
                    profitMargin      : response.data.profitMargin,
                    profitMarginValue : response.data.profitMargin,
                    id                : response.data._id
                  },()=>{
                    console.log(" profitMargin==>", this.state.profitMargin);
                });
            })
            .catch((error) => {console.log(" Error getData() => ", error);});
  }

  submit(event){
      event.preventDefault();
        var formvalue ={
          profitMargin : this.state.profitMargin,
          createdBy    : localStorage.getItem("user_ID")
        }
        // console.log("formvalue ===> ",formvalue);
          axios.post('/api/preferences/post',formvalue)
          .then((response)=> {
            // console.log("response===>",response.data);
            swal({                
                  text: "Profit Margin Details Added Successfully!",
            });
            this.getData();
          })
          .catch((error)=> {
            swal({                
                  text: "Failed to Add Profit Margin Details!",
                });
          })  
  }

  update(event){
    event.preventDefault();
      var formvalues ={
        id            : this.state.id,
        profitMargin  : this.state.profitMargin,
        createdBy     : localStorage.getItem("user_ID")
      }
      console.log("update formvalues = ", formvalues);
        axios.patch('/api/preferences/patch',formvalues)
        .then((response)=> {
          console.log("response===>",response.data);
          this.getData();
          swal({                
                text: "Profit Margin Details Updated Successfully!",
              });
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Update Profit Margin Details!",
              });
        })
  }
  
  render() {
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">Profit Margin</h4>
          </div>
          <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"margin-bottom" : "30px"}}>
            <form id="ProfiMarginForm">
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                <label className="labelform">Profit Margin % <span className="requiredsign">*</span></label>
                <input type="Number" className="form-control UMname has-content"
                  id="profitMargin" ref="profitMargin" name="profitMargin" placeholder="Profit Margin Percentage" 
                  value={this.state.profitMargin} onChange={this.handleChange} 
                  onKeyDown={(event)=>(event.target.value >= 100 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                  min="0" max="100"
                  /> 
              </div>              
              <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                {
                    this.state.profitMarginValue === "" 
                    ?
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

export default ProfitMargin;
