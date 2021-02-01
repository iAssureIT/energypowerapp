import React,{Component} from 'react';
import {Bar} from 'react-chartjs-2';
import axios             from 'axios';

const options = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
          }],
    },
    responsive: true,
    maintainAspectRatio: false     
};

export default class BarChart extends Component{
  constructor(props){
    super(props);
    this.state={
      "data" : {
        labels: [],
        datasets: [
          {
            label: 'Achievement Family Upgradation',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'Achievement Reach',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          }
        ]
      }
    }
  }

  componentDidMount(){
    this.getSectorwiseFamilyupg(this.props.year)
  }
  getSectorwiseFamilyupg(year){
    var oudata = {...this.state.data};
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate, endDate){
        axios.get('/api/report/sector/'+startDate+'/'+endDate+'/all/all/all/all')
        .then((response)=>{ 
          response.data.splice(-2);
          var sector = [];
          var annualPlanReach = [];
          var annualPlanFamilyUpgradation = [];

          var achievementReach = [];
          var achievementFamilyUpgradation = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              if(data.achievement_Reach > 0 || data.achievement_FamilyUpgradation > 0){ 
                sector.push(data.name);
                annualPlanReach.push(data.annualPlan_Reach);
                annualPlanFamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
                achievementReach.push(data.achievement_Reach);
                achievementFamilyUpgradation.push(data.achievement_FamilyUpgradation);                
              }            
            })

            if(achievementReach.length > 0 || achievementFamilyUpgradation.length > 0 ){
              oudata.datasets[0].data = achievementFamilyUpgradation;
              oudata.datasets[1].data = achievementReach;
              oudata.labels           = sector;
            }else{
              oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
              oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
              oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
              this.setState({
                "data" : oudata
              })
            } 
          }else{
            oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
            oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
            oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
            this.setState({
              "data" : oudata
            })     
          }   
      })
      .catch(function(error){        
      });
    }else{
       oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
        oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
        oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
        this.setState({
          "data" : oudata
        })
    }
  }

  render() {
    return (
      <div>
       <Bar data={this.state.data} height={300}  options={options} />
      </div>
    );
  }
}

