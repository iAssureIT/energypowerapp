import React,{Component} from 'react';
import {Line} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import axios from 'axios';

export default class MonthwiseExpenditure extends Component{
  constructor(props){
    super(props);
    this.state={
      "data" : {
        labels: [],
        datasets: [   
          {
            label: 'Expenditure',
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor:  'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(54, 162, 235, 0.5)',
            hoverBorderColor:  'rgba(54, 162, 235, 0.5)',
            data: []
          },
          {
            label: 'Budget',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 99, 132, 1)', 
            borderColor: 'rgba(255, 99, 132, 0.5)',
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
            hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
            data: []
          },
        ]
      }
    }
  }
 
  componentDidMount(){
    this.getmonthwiseExpen(this.props.year,this.props.center_ID);
  }
  getmonthwiseExpen(year,center_ID){
    var monthexp = {...this.state.data};
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    if(startYear && endYear && center_ID){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear+'/'+center_ID)
        .then((response)=>{
          var month = [];
          var monthlyPlanTotalBudget = [];
          var achievementTotalBudget = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              month.push(data.month);
              monthlyPlanTotalBudget.push(data.monthlyPlan_TotalBudget);
              achievementTotalBudget.push(data.curr_achievement_TotalBudget);
            })
            if (monthlyPlanTotalBudget.length > 0 || achievementTotalBudget.length > 0 ) {
              monthexp.datasets[0].data = achievementTotalBudget;
              monthexp.datasets[1].data = monthlyPlanTotalBudget;
              monthexp.labels           = month;
              this.setState({
                "data" : monthexp
              })
            }else{
              monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
              monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
              monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
              this.setState({
                "data" : monthexp
              })
            }
        }else{
           monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
            monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
            monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
            this.setState({
              "data" : monthexp
            }) 
        }  
      })
      .catch(function(error){        
      });
    }else{
      monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
      monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
      monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
      this.setState({
        "data" : monthexp
      })
    }
  }

  render() {
    return (
      <div>
       <Line data={this.state.data} height={190}  options={{responsive: true,stacked: true,}} />
      </div>
    );
  }
}

