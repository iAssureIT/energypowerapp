import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import axios             from 'axios';

export default class CenterWisePieChart extends Component {
  constructor(props){
    super(props);
    this.state={
      "data" : {
      labels: [],
      datasets: [{
        data: [], 
        backgroundColor: [],
        hoverBackgroundColor: []
        }]
      }
    }
  }
 
  componentDidMount(){
    this.getCenterwiseData(this.props.year);
  }
  getCenterwiseData(year){
    var centerData = {...this.state.data};
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate && endDate){
        axios.get('/api/report/center/'+startDate+'/'+endDate+'/all/all/all/all/all')
        .then((response)=>{
          response.data.splice(-2); 
          var sector = [];
          var annualPlanTotalBudget = [];
          var piechartcolor =[];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              if(data.annualPlan_TotalBudget > 0){
                sector.push(data.name);
                annualPlanTotalBudget.push(data.annualPlan_TotalBudget);
                piechartcolor.push(this.getRandomColor());                
              }
            })
            if(annualPlanTotalBudget.length > 0){
              centerData.datasets[0].data = annualPlanTotalBudget;
              centerData.labels = sector;
              centerData.datasets[0].backgroundColor = piechartcolor;
              centerData.datasets[0].hoverBackgroundColor = piechartcolor;
              this.setState({
                "data" : centerData
              })
             
            }else{
              centerData.datasets[0].data = [500000,150000,90000,100000,200000];
              centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
              centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              this.setState({
                "data" : centerData
              })
            }

        }else{
            centerData.datasets[0].data = [500000,150000,90000,100000,200000];
            centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
            centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            this.setState({
              "data" : centerData
            })
        }
      }).catch(function (error) {
      });
    }else{
      centerData.datasets[0].data = [500000,150000,90000,100000,200000];
      centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
      centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      this.setState({
        "data" : centerData
      })
    }
  }
   getRandomColor(){
      var letters = '01234ABCDEF56789';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  render() {
    return (
      <div>
        <Pie height={150} data={this.state.data} options={{legend: {display: false},
        plugins: {
           labels: [{
            render: 'label',
            position: 'outside',
            fontColor: '#000',
            textMargin: 8
          },
          {
            render: 'percentage',
            fontColor: '#fff',
          }
           ]}}
          } />
      </div>
    );
  }
}