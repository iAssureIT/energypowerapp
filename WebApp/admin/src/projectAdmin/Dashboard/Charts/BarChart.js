import React,{Component} from 'react';
import { render } from 'react-dom';
import {Bar} from 'react-chartjs-2';
import axios             from 'axios';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../dashboard.css';

const options = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
          }],
    },
    plugins:{labels:false},
    responsive: true,
    maintainAspectRatio: false     
};
export default class BarChart extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      boxColor:props.boxColor,
      title:props.title,
      display:props.display,
      "data" : {
      labels: [],
      datasets: [{
            label: 'Month Wise Tickets',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          }]
      }
    }
  }
   
  componentDidMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        boxColor: nextProps.boxColor,
        title: nextProps.title,
        apiData : nextProps.api,
      },()=>{this.getData()})
    }
  }

  getData(){
    var data = {...this.state.data};

    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
        axios({
          method: Method,
          url: Path
        })
        .then((response)=>{ 
          console.log("response=>",response);
          var booking = [];
          var piechartcolor =[];
          var totalTickets = [];
         if(response.data && response.data.length >0){
            response.data.map((data,index)=>{ 
              booking.push(data.name);
              totalTickets.push(data.totalTickets);
            })
          if (totalTickets.length > 0) {
            data.datasets[0].data = totalTickets;
            data.labels = booking;
            this.setState({
              "data" : data
            })
            
          }
        }  
      })
      .catch((error)=>{  
        console.log('error=>',error)      
      });
    }
  }

    
  render(){
    
    return(
      <div>
      {this.state.display ?
        <div className="col-md-6">
          <div className={"box "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
            {this.state.data && this.state.data.datasets[0].data.length > 0 ?
              <Bar data={this.state.data} height={300}  options={options} />
            :
            <div>
              <img className="chartStyle" src="/images/bar.gif"/>
              <p className="pull-right noChartData">No Data Found</p>
            </div>
            }
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
