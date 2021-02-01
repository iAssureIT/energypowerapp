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

export default class monthBarChartbudget extends Component{
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
            stack: '1',
            data: []
          },
          {
            label: 'Budget',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
            hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
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
      data.datasets[0].data = props.expenditure ? props.expenditure : "";
      data.datasets[1].data = props.budget ? props.budget : "";
    
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

