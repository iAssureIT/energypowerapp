import React,{Component}      from 'react';
import axios                  from 'axios';
import {HorizontalBar}        from 'react-chartjs-2';
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

export default class CenterwiseBarChart extends Component{
  constructor(props){
    super(props);
    this.state={
      "data" : {
        labels: [],
        datasets: [

          {
            label: 'achi_month',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
            hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
            stack: '2',
            data: []
          },
          {
            label: 'annualPlan',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'cum_achi',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: '#e58b03',
            borderWidth: 1,
            hoverBackgroundColor:'#e58b03',
            hoverBorderColor:'#e58b03',
            stack: '1',
            data: []
          },
          {
            label: 'cum_monthly',
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor:  '#d01d19',
            borderWidth: 1,
            hoverBackgroundColor:  '#d01d19',
            hoverBorderColor:  '#d01d19',
            stack: '1',
            data: []
          },
          {
            label: 'monthlyPlan',
            backgroundColor:'#10a923',
            borderColor: '#10a923',
            borderWidth: 1,
            hoverBackgroundColor: '#10a923',
            hoverBorderColor: '#10a923',
            stack: '1',
            data: []
          },
          {
            label: 'per_achi',
            backgroundColor:'#e58b03',
            borderColor: '#e58b03',
            borderWidth: 1,
            hoverBackgroundColor:'#e58b03',
            hoverBorderColor:'#e58b03',
            stack: '1',
            data: []
          },
          {
            label: 'per_cum_achi',
            backgroundColor: '#d01d19',
            borderColor:  '#d01d19',
            borderWidth: 1,
            hoverBackgroundColor:  '#d01d19',
            hoverBorderColor:  '#d01d19',
            stack: '1',
            data: []
          }
        ]
      }
    }
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
  }
  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
    if (data) {
      return{
         data : data
      }
    }
  }

  render() {
    return (
      <div>
       <HorizontalBar data={this.state.data} height={350}  options={options} />
      </div>
    );
  }
}

