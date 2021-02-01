import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import IAssureTable         from "../../IAssureTable/IAssureTable.jsx";

class FilewisePersonList extends Component{
  
  constructor(props){
    super(props); 
    console.log("type",this.props.match.params.type)
    if (this.props.match.params.type === "employee") {
      var fetchAPILink =  "/api/personmaster/get/files/";
      var deleteAPILink = '/api/personmaster/file/delete/'+this.props.match.params.type+"/";
    }
    this.state = {
       tableHeading:{
            "_id"      : "File Name",
            "count"         : "Count",
            "actions"       : "Action"
          },
          "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : deleteAPILink,
              paginationApply           : false,
              searchApply               : false,
            },
          startRange : 0,
          limitRange : 10,
          fetchAPILink      : fetchAPILink
    }
    
  }
  componentDidMount(){
    this.getCount();
  }
  getData(startRange, limitRange){
      var data = {
        startRange : startRange,
        limitRange : limitRange,
        type       : this.props.match.params.type 
      }
      axios.post("/api/personmaster/get/files",data)
      .then((response)=>{
        console.log(response.data);
        var tableData = response.data.filter((a, i)=>{

          if (a._id !== null) {
            return {
              fileName: a._id !== null ? a._id : "-", 
              count: a.count !== NaN ? "<p>"+a.count+"</p>" : "a", 
              _id: a._id !== null ? a._id : "-", 
            }
          }
        })
        console.log('tableData', tableData)
        this.setState({
          tableData : tableData
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    getCount(){
      axios.get('/api/personmaster/get/files/count/'+this.props.match.params.type)
      .then((response)=>{
        console.log(response.data)
        this.setState({
          dataCount : response.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
             <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      <div className="col-lg-11 col-md-10  col-xs-12 col-sm-12 actDetails">
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Filewise Details</h4>
                        <IAssureTable 
                            tableHeading={this.state.tableHeading}
                            twoLevelHeader={this.state.twoLevelHeader} 
                            dataCount={this.state.dataCount}
                            tableData={this.state.tableData}
                            getData={this.getData.bind(this)}
                            tableObjects={this.state.tableObjects}
                          />
                      </div>
                    </div>
                    </div>
                    </div>
                  </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default FilewisePersonList