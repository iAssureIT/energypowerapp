import React,{Component} from 'react';
import { render } from 'react-dom';
import axios             from 'axios';
import moment                   from 'moment';
import { withRouter } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../dashboard.css';

class Report extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      boxColor:props.boxColor,
      title:props.title,
      redirectlink:props.redirectlink,
      display:props.display,
      tableHeading:props.tableHeading,
      data:[]
    }
  }
   
  componentDidMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        tableHeading: this.props.tableHeading,
        redirectlink: this.props.redirectlink,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        boxColor: nextProps.boxColor,
        title: nextProps.title,
        tableHeading: nextProps.tableHeading,
        redirectlink: nextProps.redirectlink,
        apiData : nextProps.api,
      },()=>{this.getData()})
    }
  }

  getData(){
    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
      var body = this.state.apiData.body;
      console.log("path",Path);
        axios({
          method: Method,
          url: Path,
          data:body
        })
        .then((response)=>{ 
          console.log("Report=>",response)
          this.setState({data:response.data})
        })
        .catch((err)=>{})
    }
  }

  viewAll(){
    this.props.history.push(this.state.redirectlink)
  }

    
  render(){
    return(
      <div>
      {this.state.display ?
        <div className="col-md-6" >
          <div className={"box "+this.state.boxColor} style={{minHeight:"300px"}}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
              <div className="table-responsive">
                <table className="table no-margin">
                  <thead>
                  <tr>
                  {this.state.tableHeading && this.state.tableHeading.length > 0 ?
                    this.state.tableHeading.map((heading,index)=>{
                      return(
                        <th key={index}>
                          {heading}
                        </th>
                        )
                    })
                    :
                    null
                  }
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.data && this.state.data.length > 0 ?
                    this.state.data.map((data,index)=>{
                      return(
                        <tr key={index}>
                          <td>{data.ticketId}</td>
                          <td>{data.clientName}</td>
                          {
                            data.statusValue === "New"  || data.statusValue === "Reopen"?
                              <td><span className='label label-primary' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Acknowledged"?
                              <td><span className='label label-info' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Paid Service Request"?
                              <td ><span className='label label-orange' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Allocated"?
                              <td ><span className='label label-ligntGreen' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Assignee Rejected" || data.statusValue === "Paid Service Rejected"?
                              <td ><span className='label label-danger' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Resolved" ?
                              <td ><span className='label label-success' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Work Started"  || data.statusValue === "Work In Progress" ?
                              <td ><span className='label label-warning' style={{'color':'#fff'}}>{data.statusValue}</span></td> 
                               :
                              data.statusValue === "Paid Service Approved"  ?
                              <td ><span className='label label-purple' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              data.statusValue === "Assignee Accepted" ?
                              <td ><span className='label label-fuchsia' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                               data.statusValue === "Closed" ?
                              <td><span className='label label-teal' style={{'color':'#fff'}}>{data.statusValue}</span></td>
                              :
                              null
                          }
                          
                          <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
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
            <div className="box-footer clearfix">
              <button className="btn btn-sm btn-default btn-flat pull-right" onClick={this.viewAll.bind(this)}>View All</button>
            </div>
          </div>
        </div> 
        :
        null
      }
      </div>
        );
  }
}
export default withRouter(Report);
