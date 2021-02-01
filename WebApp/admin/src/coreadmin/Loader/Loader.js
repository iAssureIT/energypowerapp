import React, { Component } 		from 'react';
import "./Loader.css";
export default class Loader extends Component {
	constructor(props){
    super(props);
	     
  	}

    render(){
      //var tempdata = [1,2,3];
      var tempdata = [];
      for (var i = 0; i < this.props.productLoaderNo; i++) {
        tempdata.push(i);
      }
      if (this.props.type == "fullpageloader" ) {
        return(
          <div>
            <div className="fullpageloader">Loading&#8230;</div>
          </div>
        );
      }
      else if(this.props.type == "collageloader"){
        return(
        <div  className="productLoader">
          {
            tempdata.map((data,index)=>{
            return( 
              <div className="item col-lg-4 col-md-4 col-sm-4 col-xs-4" key={index}>
              <div className="">
                <div className="card">
                  <div className="item-top">
                    <div className="loaderImg">
                    </div>
                    <div className="productDetails">
                      <div className="innerDiv">
                        <div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            );
            })
          }
        </div>
      )
      }
      else if(this.props.type == "carouselloader"){

        return (
          <div  className="productLoader">
          {
            tempdata.map((data,index)=>{
            return( 
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <div className="card">
                  <div className="item-top">
                    <div className="loaderImg">
                      
                    </div>
                    <div className="productDetails">
                      <div className="innerDiv">
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
                            
                          </div>
                          <div className=" col-lg-7 col-md-7 col-sm-12 col-xs-12 NOpadding">
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          }
          </div>
        );
      } else{
        return (null);
      }
      
       
    }
}

