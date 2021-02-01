import React, { Component }                                  from 'react';
import moment               from 'moment';
import $                                                     from 'jquery';
import axios                                                 from 'axios';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';
import Chart from 'chart.js';
import CenterwiseBarChart from './CenterwiseBarChart.js';
import './Chart.css';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";

export default class CenterwiseBarChart1 extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      'year'                        : "FY 2019 - 2020",
      "years"                       :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],      
      "per_cum_achi"        : [],
      "cum_achi"            : [],
      "cum_monthly"         : [],
      "annualPlan"          : [],
      "source"              : [],
      "tableHeading"                : {
        name                           : "Center",
        annualPlan_Reach               : "annualPlan_Reach",
        annualPlan_FamilyUpgradation   : "annualPlan_FamilyUpgradation",
        achievement_Reach              : "achievement_Reach",
        achievement_FamilyUpgradation  : "achievement_FamilyUpgradation",
        annualPlan_TotalBudget         : "annualPlan_TotalBudget",
        monthlyPlan_TotalBudget        : "monthlyPlan_TotalBudget",  
        achievement_TotalBudget        : "achievement_TotalBudget",
        monthlyPlan_Total              : "monthlyPlan_Total",
        achievement_Total              : "achievement_Total",  
        Per_Periodic  : "Per_Periodic", 
               
      },


    }
  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCenters();
    this.getData(this.state.year, this.state.center_ID);

  }
  
    componentWillReceiveProps(nextProps){
      this.getAvailableCenters();
      this.getData(this.state.year, this.state.center_ID);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
        });
    }
    getAvailableCenters(){
        axios({
          method: 'get',
          url: '/api/centers/list',
        }).then((response)=> {
          this.setState({
            availableCenters : response.data,
            center           : response.data[0].centerName+'|'+response.data[0]._id
          },()=>{
            var center_ID = this.state.center.split('|')[1];
            this.setState({
              center_ID        : center_ID
            },()=>{
            this.getData(this.state.year, this.state.center_ID);
            })
          })
        }).catch(function (error) {
        });
    } 
    selectCenter(event){
        var selectedCenter = event.target.value;
        this.setState({
          [event.target.name] : event.target.value,
          selectedCenter : selectedCenter,
        },()=>{
          var center_ID = this.state.selectedCenter.split('|')[1];
          this.setState({
            center_ID :center_ID,            
          },()=>{
            this.getData(this.state.year, this.state.center_ID);
          })
        });
    } 


 
  getData(year, center_ID){
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = moment(new Date()).format("YYYY-MM-DD");
    if(startDate, endDate, center_ID){
        axios.get('/api/report/center/'+startDate+'/'+endDate+'/'+center_ID)
        .then((response)=>{
        var name                           = [];
        var annualPlan_Reach               = [];
        var annualPlan_FamilyUpgradation   = [];
        var achievement_Reach              = [];
        var achievement_FamilyUpgradation  = [];
        var annualPlan_TotalBudget         = [];
        var monthlyPlan_Total              = [];
        var achievement_TotalBudget        = [];
        var monthlyPlan_TotalBudget        = [];
        var achievement_Total              = [];
        var Per_Periodic                   = [];
        
        
          if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              name.push(data.name);
              annualPlan_Reach.push(data.annualPlan_Reach);
              annualPlan_FamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
              achievement_Reach.push(data.achievement_Reach);
              achievement_FamilyUpgradation.push(data.achievement_FamilyUpgradation);
              annualPlan_TotalBudget.push(data.annualPlan_TotalBudget);
              monthlyPlan_Total.push(data.monthlyPlan_Total);
              achievement_TotalBudget.push(data.achievement_TotalBudget);
              monthlyPlan_TotalBudget.push(data.monthlyPlan_TotalBudget);
              achievement_Total.push(data.achievement_Total);
              Per_Periodic.push(data.Per_Periodic);
            })
          this.setState({
            "name"               : name.splice(-2),
            "annualPlan_Reach"               : annualPlan_Reach.splice(-2),
            "annualPlan_FamilyUpgradation"   : annualPlan_FamilyUpgradation.splice(-2),
            "achievement_Reach"              : achievement_Reach.splice(-2),
            "achievement_FamilyUpgradation"  : achievement_FamilyUpgradation.splice(-2),
            "annualPlan_TotalBudget"         : annualPlan_TotalBudget.splice(-2),
            "monthlyPlan_Total"              : monthlyPlan_Total.splice(-2),
            "achievement_TotalBudget"        : achievement_TotalBudget.splice(-2),
            "monthlyPlan_TotalBudget"        : monthlyPlan_TotalBudget.splice(-2),
            "achievement_Total"              : achievement_Total.splice(-2),
            "Per_Periodic"                   : Per_Periodic.splice(-2),
          
          },()=>{
            this.setState({
              "name"                           : name,
              "annualPlan_Reach"               : annualPlan_Reach,
              "annualPlan_FamilyUpgradation"   : annualPlan_FamilyUpgradation,
              "achievement_Reach"              : achievement_Reach,
              "achievement_FamilyUpgradation"  : achievement_FamilyUpgradation,
              "annualPlan_TotalBudget"         : annualPlan_TotalBudget,
              "monthlyPlan_Total"              : monthlyPlan_Total,
              "achievement_TotalBudget"        : achievement_TotalBudget,
              "monthlyPlan_TotalBudget"        : monthlyPlan_TotalBudget,
              "achievement_Total"              : achievement_Total,
              "Per_Periodic"                   : Per_Periodic,
            });      
          })
        }
        var tableData = response.data.map((a, i)=>{
            return {
              name                           : a.name,
              annualPlan_Reach               : a.annualPlan_Reach,
              annualPlan_FamilyUpgradation   : a.annualPlan_FamilyUpgradation,
              achievement_Reach              : a.achievement_Reach,
              achievement_FamilyUpgradation  : a.achievement_FamilyUpgradation,
              annualPlan_TotalBudget         : a.annualPlan_TotalBudget,
              monthlyPlan_TotalBudget        : a.monthlyPlan_TotalBudget,
              achievement_TotalBudget        : a.achievement_TotalBudget,
              monthlyPlan_Total              : a.monthlyPlan_Total,
              achievement_Total              : a.achievement_Total,
              Per_Periodic                   : a.Per_Periodic,
            } 
        })  
        this.setState({
          tableData : tableData
        },()=>{
        })
      })
      .catch(function(error){        
      });
    }
  }

  render(){ 
    
    return(
      <div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <label className="formLable">Center</label><span className="asterix"></span>
                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                    <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                        <option className="hidden" >-- Select --</option>
                        {
                          this.state.availableCenters && this.state.availableCenters.length >0 ?
                          this.state.availableCenters.map((data, index)=>{
                            return(
                              <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                            );
                          })
                          :
                          null
                        }
                    </select>
                </div>
            </div>
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <label className="formLable">Year</label><span className="asterix"></span>
              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                 <option className="hidden" >-- Select Year --</option>
                 {
                  this.state.years.map((data, i)=>{
                    return <option key={i}>{data}</option>
                  })
                 }
                </select>
              </div>
            </div>  
        </div>  
        <div className="col-lg-6">
          <CenterwiseBarChart 
            center                         ={this.state.name}
            annualPlan_Reach               ={this.state.annualPlan_Reach}
            annualPlan_FamilyUpgradation   ={this.state.annualPlan_FamilyUpgradation}
            achievement_Reach              ={this.state.achievement_Reach}
            achievement_FamilyUpgradation  ={this.state.achievement_FamilyUpgradation}
            annualPlan_TotalBudget         ={this.state.annualPlan_TotalBudget}
            monthlyPlan_Total              ={this.state.monthlyPlan_Total}
            achievement_TotalBudget        ={this.state.achievement_TotalBudget}
            monthlyPlan_TotalBudget        ={this.state.monthlyPlan_TotalBudget}
            achievement_Total              ={this.state.achievement_Total}
            Per_Periodic                   ={this.state.Per_Periodic}
          />
        </div>
        <div className="col-lg-6">
          <IAssureTable 
         
          getData={this.getData.bind(this)} 
          tableHeading={this.state.tableHeading} 
          tableData={this.state.tableData} 
          // tableObjects={this.state.tableObjects}
          />
  
        </div>
     
      </div>  
        <br/>
        
      </div>
      );
  }
}
