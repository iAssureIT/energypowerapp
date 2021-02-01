import React,{Component} from 'react';
import {Bar} from 'react-chartjs-2';
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
            label: 'Actual Beneficiaries',
            backgroundColor: 'rgba(255, 255,102, 1)',
            borderColor:  'rgba(255, 255,102, 1)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(255, 255,102, 0.5)',
            hoverBorderColor:  'rgba(255, 255,102, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'Outreach',
            
            borderWidth: 1,
          
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 0.5)',
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
            hoverBorderColor: 'rgba(75, 192, 192, 0.5)',
            stack: '1',
            data: []
          },
        
        ]
      }
    }
  }
 
  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
    if (data) {
      data.datasets[0].data = props.ActualBeneficiaries ? props.ActualBeneficiaries : "";
      data.datasets[1].data = props.PlannedBeneficiaries ? props.PlannedBeneficiaries : "";
   
      data.labels = props.months;
      return{
         data : data
      }
     
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

