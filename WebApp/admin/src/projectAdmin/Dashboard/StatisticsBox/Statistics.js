import React,{Component} from 'react';
import { render } from 'react-dom';
import axios                    from 'axios';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../dashboard.css';

export default class Statistics extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      bgColor:props.bgColor,
      faIcon:props.faIcon,
      display:props.display,
      firstField:"",
      secondField:"",
      firstFieldCount:0,
      secondFieldCount:0
    }
  }
   
  componentDidMount(){
    if(this.props.display){
      this.setState({
        firstField: this.props.firstField,
        firstFieldName: this.props.firstField.Field,
        secondField: this.props.secondField,
        secondFieldName: this.props.secondField.Field,
        bgColor: this.props.bgColor,
        faIcon: this.props.faIcon,
      },()=>{this.getData()})
    }
    
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        firstField: nextProps.firstField,
        firstFieldName: nextProps.firstField.Field,
        secondField: nextProps.secondField,
        secondFieldName: nextProps.secondField.Field,
        bgColor: nextProps.bgColor,
        faIcon: nextProps.faIcon,
      },()=>{this.getData()})
    }
  }

  getData(){
    var firstFieldMethod = this.state.firstField.method ;
    var firstFieldPath = this.state.firstField.path ;

    var secondFieldMethod = this.state.secondField.method ;
    var secondFieldPath = this.state.secondField.path ;

    axios({
      method: firstFieldMethod,
      url: firstFieldPath
    })
    .then((response)=>{
      this.setState({
        firstFieldCount:response.data.count
      })
    })
    .catch((err)=>{console.log('entitymaster err: ',err)})

    axios({
      method: secondFieldMethod,
      url: secondFieldPath
    })
    .then((response)=>{
      this.setState({
        secondFieldCount:response.data.count
      })
    })
    .catch((err)=>{console.log('entitymaster err: ',err)})
  }

    
  render(){
    return(
      <div>
      {this.state.display ?
        <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="info-box cursor" onClick={()=>this.props.history.push(this.props.path)}>
              <span className={"info-box-icon "+this.state.bgColor}><i className={"fa "+this.state.faIcon} aria-hidden="true"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">{this.state.firstFieldName}</span>
                <span className="info-box-number">{this.state.firstFieldCount}</span>
                <span className="info-box-text">{this.state.secondFieldName}</span>
                <span className="info-box-number">{this.state.secondFieldCount}</span>
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
