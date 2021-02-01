import React,{Component} from 'react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './StatusComponent.css';

export default class StatusComponent extends Component{
  
  constructor(props) {
   super(props);
    this.state = {

    }
  }
   
  componentDidMount(){
 
}

    
  render(){
    return(
        <main className="col-lg-3">
         <div className="col-lg-12 mainicon NOpadding" >
            <div className="row">
              <div className="col-lg-4 ccon1 " style={{backgroundColor:this.props.stats.color}} >
                <div className="row"><i className={"fa fa-"+this.props.stats.icon}></i></div>
              </div>
              <div className="col-lg-7 statusBox">
                {

                  this.props.stats.multipleValues ?  
                    <React.Fragment>
                      <div> <b> Centers : {this.props.stats.centerCount}</b> </div>
                       {this.props.stats.centerData && this.props.stats.centerData.length > 0 ?
                        this.props.stats.centerData.map((center,i)=>{
                          return(  
                            <div className="dashboardHeading1" key={i}>{center.typeOfCenter.split(' ')[0]}  : <strong>{center.count}</strong></div>
                          )
                        })
                        : null
                      }
                    </React.Fragment>
                  :
                    <div>
                      <div className="dashboardHeading">{this.props.stats.heading1}</div>
                      <div className="per"><strong>{this.props.stats.value1}</strong></div>
                      <div className="dashboardHeading">{this.props.stats.heading2}</div>
                      <div className="per"><strong>{this.props.stats.value2}</strong></div>
                    </div>              
                }
              </div>
            </div>
          </div>
        </main>  
        );
  }
}
