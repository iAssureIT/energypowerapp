import React, { Component } from 'react';
import { render } from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import swal          from 'sweetalert';


export default class AreaBulkupload extends Component{

	constructor(props){
		super(props);
	}

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});	
	}


	uploadCSV(event){
        event.preventDefault();
        
        UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
				Meteor.call( 'CSVUploadarea', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){

                    		swal({
                              text: "Area Added Successfully",
                              title:""
                            });

                            $('#addcountrie' ).css({'display':'block'});
						              	$('#bulkuploads').css({'display':'none'});
    
                            $(".uploadFileInput").val('');
                            setTimeout(()=>{ 
                                
                                UserSession.delete("allProgressbarSession", Meteor.userId());
                                UserSession.delete("progressbarSession", Meteor.userId());
                            }, 8000);
                    	}else{
	                            swal({
                                position 		  : 'top-right',
                                type     		  : 'warning',
                                title    		  : 'Nothing to upload.',
                                showConfirmButton : true,
                                
                            }); 
                            $('#addcountrie' ).css({'display':'block'});
							$('#bulkuploads').css({'display':'none'});                      		
                        }       
         			}
      			});

		    }
        });
    }

	render(){
       return(
        	<div className="blkupld" >
        	    <div className="wrapperTitle col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 masterHeading">
						<h4><i className="fa fa-map-marker" aria-hidden="true"></i> Add Area</h4>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 bulkUploadBtn">
						<button type="submit" className="fa fa-file btn btnBulk pull-right col-lg-4 col-md-4 col-sm-12 col-xs-12" onClick={this.Bulkuploadform.bind(this)} > Form Entry</button>
					</div>
				</div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkuploadTitle">
					<h4><i className="fa fa-upload" aria-hidden="true"></i> Area Bulk Upload</h4>
				</div>
				<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 bulkUploadWrapper" >
					<div className="csvDLWrap">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 "></div>
						<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
							<a href="/csv/taluka.csv" download>
								<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
							</a>
						</div>
						<h4><b>Instructions</b></h4>
						<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
							<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Area Data</b> into this system.</li>
							<li><b>2)</b> File Format must be *.CSV.</li>
							<li><b>3)</b> Following is the format of .CSV file.</li>
												
						</ul>
					</div>
			 	 	
					
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  csvDLWrap">
						<div className="bulkcountry col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="fieldTitle control-label statelabel"><b>Upload Areas</b></span></div>
						<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control fieldTitle col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
					</div>
				
				</div>

			</div>		
			
			
	    );
	} 
}

