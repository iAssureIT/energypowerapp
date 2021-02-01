import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

class EventToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event    : "",
      templateName    : "",
      tokens    : "",
      templateData:[], 
      id   : "",  
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.getData();
   
    $("#EventTokenForm").validate({
    rules: {
      event: {
        required: true,
      },
      templateName: {
        required: true,
      },
     
    }
    });  
  }

  componentWillReceiveProps(nextProps){
    this.getData()
  }

   
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }  

  
  getData(){
    axios.post('/api/EventToken/list')
    .then((response) => {
        this.setState({ 
          templateData : response.data,
        });
    })
    .catch((error) => {});
	}
  submit(event){
      event.preventDefault();
      
        var formvalue ={
          event    : this.state.event, 
          templateName : this.state.templateName, 
          tokens : this.state.tokens, 
          createdBy : localStorage.getItem("user_ID")
        }
        if($("#EventTokenForm").valid()){
            axios.post('/api/EventToken/post',formvalue)
            .then((response)=> {
            	if(response.data.duplicated == true){
            		swal({                
                    text: "Duplicate Entry",
                  });
            	}else{
              		swal({                
	                    text: "Details added successfully!",
	                  });
	              
	              this.setState({
	                event    : "", 
	                templateName : "", 
	                tokens : "", 
	              })
	              this.getData();
	             }
            })
            .catch((error)=> {
            	console.log('error===>',error)
              swal({                
                    text: "Failed to add data!",
                  });
            })
          
        }
 
 
  }

  update(event){
    event.preventDefault();
     
      var formvalues ={
      	id: this.state.id,
        event    : this.state.event, 
        templateName : this.state.templateName,
        tokens : this.state.tokens,
        updatedBy : localStorage.getItem("user_ID")
      }
      if($("#EventTokenForm").valid()){
        axios.patch('/api/EventToken/patch',formvalues)
        .then((response)=> {
          this.getData();
          swal({                
                text: "Data Updated successfully!",
              });
          $('#event').prop('disabled', false);
            this.setState({
              event    : "", 
              templateName : "", 
              tokens : "", 
              id:""
            })
            this.getData();
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Update details!",
              });
        })
      }

}

  edit(event) {
  	event.preventDefault();
    $("html,body").scrollTop(0);
    $('#event').prop('disabled', true);
    var id = $(event.currentTarget).attr('id');
    axios.get('/api/EventToken/get/one/'+id)
      .then((response) => {
          this.setState({ 
            id : response.data._id,
            event : response.data.event,
            templateName : response.data.templateName,
            tokens : response.data.tokens,
          });
      })
      .catch((error) => {});
        
    }
  
  
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		<div className="row">
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				<section className="content">
					<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
							<h4 className="weighttitle col-lg-12 col-md-12 col-xs-12 col-sm-12">Event-Template Name Mapping</h4>
          				</div>
				          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				            <form id="EventTokenForm">
				              <div className="form-margin col-lg-2 col-md-2 col-xs-12 col-sm-12 ">
				                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Event Name <i className="astrick">*</i></label>
					            <input
                                    className="form-control errorinputText"
                                    placeholder="Event Name"
                                    ref="event"
                                    name="event"
                                    id="event"
                                    value={this.state.event}
                                    onChange={this.handleChange.bind(this)}
                                  />  
				              </div>
				              
				              <div className="form-margin col-lg-4 col-md-4 col-xs-12 col-sm-12">
				                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Template Name <i className="astrick">*</i></label>
				                <input
	                                className="form-control errorinputText"
                                    placeholder="Template Name"
                                    ref="templateName"
                                    name="templateName"
                                    id="templateName"
                                    value={this.state.templateName}
                                    onChange={this.handleChange.bind(this)}
	                              />
				              </div>
				              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
				                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Tokens</label>
				                <textarea rows="2"
	                                className="form-control errorinputText"
                                    placeholder="Enter comma seperated tokens here. Eg: [Name],[Contact],..."
                                    ref="tokens"
                                    name="tokens"
                                    id="tokens"
                                    value={this.state.tokens}
                                    onChange={this.handleChange.bind(this)}
	                              />
				              </div>
				              
				              
				              <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
				                {
				                    this.state.id === "" || this.state.id == undefined ?
				                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.submit.bind(this)} >Submit</button>
				                    :
				                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="update" onClick={this.update.bind(this)} >Update</button>
				                }
				                
				              </div>
				            </form>
				            </div>
				           
		           			<div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
				              <table className="table iAssureITtable-bordered table-striped table-hover">
				                <thead className="tempTableHeader">
				                  <tr className="">
				                    <th className="umDynamicHeader srpadd textAlignCenter"> Event </th>
				                    <th className="umDynamicHeader srpadd textAlignCenter"> Template Name </th>
				                    <th className="umDynamicHeader srpadd textAlignCenter"> Tokens </th>
				                    <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
				                  </tr>
				                </thead>
				                <tbody>
						        {this.state.templateData && this.state.templateData.length > 0 ?
				           		this.state.templateData.map((data,index)=>{
				           		return(
				                  <tr key={index}>
				                    <td>{data.event}</td>
				                   <td>{data.templateName}</td>
				                   <td>{data.tokens}</td>
				                    <td className="textAlignCenter">
				                      <span>
				                          <button title="Edit" id={data._id}  onClick={this.edit.bind(this)}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
				                      </span>
				                      </td>
				                  </tr>
				                   )
						           	})
						            
						            :
						            <tr><td colSpan="3" className="textAlignCenter">No Data Found</td></tr>
						          }     
				                </tbody>
				              </table>
				            </div>
				           		
          			</div>
          		</section>
          	</div>
        </div>
      </div>

    );
  }
}
export default EventToken;

