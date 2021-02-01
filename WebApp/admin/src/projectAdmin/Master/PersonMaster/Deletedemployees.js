import React, { Component }   from 'react';
import $                      from "jquery";
import jQuery                 from 'jquery';
import axios                  from 'axios';
import moment                 from 'moment';
import DeletedEmplist            from './DeletedEmplist.js';
import swal                   from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
// import '../../userManagement/UM/userManagement.css';

class DeletedUsers extends Component {


  constructor(props) {
    super(props);
    this.state = {
      "tableData"         : props && props.tableData ? props.tableData : [],
      "startRange"        : 0,
      "limitRange"        : 10000, 
      "twoLevelHeader"    : {
          apply           : false,
      },
      "tableHeading"     : {
        fullName        : 'User Details',
        status          : 'Status',
        roles           : 'Role',
        employeeId      : 'Employee ID',
        createdAt       : 'Registered Since',
        deletedOn       : "Deleted On",
        actions         : 'Action',
      },
      "tableObjects"    : {
        paginationApply : false,
      },
      checkedUser  : [],
      activeswal : false,
      blockswal : false,
      confirmDel : false,
      unCheckedUser:false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const datatype = event.target.getAttribute('data-text');
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }
  componentDidMount() {
    this.getData();
    this.setState({
      tableData     : this.props.tableData ,          
    })
  }
  componentWillReceiveProps(nextprops) {
    
    this.getData();
    this.setState({
      tableData     : nextprops.tableData ,          
    })
  }
  getData(){    
    var formvalues = { type : "employee"}
    		axios.post("/api/personmaster/get/list",formvalues)
    		.then((response) => {
          var statusArr = ['deleted-Active','deleted-Inactive'];
            var tableData=response.data.filter((data,i)=>{
                if(statusArr.includes(data.status))
                    return data
            });
        var tableData = tableData.map((a, i)=>{
          return {
            _id             : a._id,
            fullName: '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-left"><b>' +  a.firstName +'&nbsp'+ a.lastName + '</b></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-right"><medium>' + a.companyName + ' | ' + a.companyID + '</medium></div>' +
							        '<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
            status          : a.status,
            roles           : a.type.toString(),
            employeeId      : a.employeeId,
            createdAt       : moment(a.createdAt).format("DD-MMM-YY LT"),
            deletedOn       : a.statusupdatedAt !=="-" ? moment(a.statusupdatedAt).format("DD-MMM-YY LT") : "-",
          }
        })
        this.setState({
          completeDataCount : response.data.length,
          tableData     : tableData,          
        })
    })
    .catch((error)=>{}); 
  }

  setunCheckedUser(value){
    this.setState({
      unCheckedUser : value,
    })
  }
  selectedUser(checkedUsersList){
    this.setState({
      checkedUser : checkedUsersList,
    },()=>{
      console.log('checkedUser',this.state.checkedUser);
    })
  }
  close(event){
    this.setState({
      firstname: "",
      lastname: "",
      signupEmail: "",
      mobile: "",
      role: "",
    });
    var modal = document.getElementById("DeletedUsersModal");
    modal.style.display = "none";
    var data = {
      "startRange"        : parseInt(this.state.startRange),
      "limitRange"        : parseInt(this.state.limitRange), 
    }    
    // this.props.getuserData(this.state.startRange, this.state.limitRange)
    this.getData();
    this.setState({
      tableData     : this.props.tableData ,          
    })
    $('.modal-backdrop').remove();
    
  }
  render() {
    return (
      <div className="modal" id="DeletedUsersModal" role="dialog">
        <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="modal-content adminModal-content col-lg-10 col-lg-offset-1 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" onClick={this.close.bind(this)} className="close " data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title row deleteTitle" id="exampleModalLabel">Deleted Users</h4>
            </div>
            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <DeletedEmplist
                getData={this.getData.bind(this)} 
                getpersons={this.props.getpersons.bind(this)} 
                tableHeading={this.state.tableHeading} 
                tableData={this.state.tableData} 
                DeletedUsersTable = {true}
              />      
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default DeletedUsers;



