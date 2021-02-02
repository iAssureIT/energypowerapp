import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import axios                from 'axios';
import IAssureTable         from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import ShowingModalImages   from './ShowingModalImages.js';

const filterData = {
  search : 'All'
}

export default class ListOfCameraLocations extends Component{
  constructor(props) {
    super(props);
    this.state = {

      "tableHeading": {
        clientDetails         : "Client Details",
        recordingLocationName : "Project Location",
        locationName          : "Equipment Location",
        address               : "Address",
        cameraDetails         : "Equipment Details",
        images                : "Images",
        actions               : 'Action'
      },
       "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/cameralocation/',
          paginationApply: false,
          searchApply    : false,
          editUrl        : '/cameralocation',
          listUrl        : '/listofcameraloc'
      },

        clientArray               :[],
        projectArray              :[],
        siteArray                 :[],
        recorderTypeArray         :[],
        brandArray                :[],
        maxChannelsArray          :[],
        clientName                : '',   
        projectName               : '',   
        sitename                  : '',
        recordingLocationName     : '',
        recordingLocAddress       : '', 
        recorderType              : '',
        brand                     : '',
        maxchannels               : '',
        country                   : '',
        state                     : '',
        city                      : '',
        area                      : '',
        pincode                   : '',
        imgs                      : [],
        recordingLocLatitude      : '',
        recordingLocLongitude     : '',
        "editId"                  : props.match.params ? props.match.params.id : '',
        tableData                 : [],
        images                    : [],
        isLoading                 : true,
    };
      this.handleChange              = this.handleChange.bind(this);
      this.showImages = this.showImages.bind(this);

  }
   handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }
   componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.id;
      if(nextProps.match.params.id){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
    }
  }
 
  componentDidMount(){
    window.showImages = this.showImages;
    var editId = this.props.match.params.id;
    if(editId){     
      this.edit(editId);
    }
    this.getData();
    this.getCameraLocCount();
  }

  getCameraLocCount(){
     axios.get("/api/cameralocation/get/count")
      .then(res => {
          this.setState({locationCount:res.data.count})
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }

  
  getData(){
    axios.post('/api/cameralocation/get/list',filterData)

    .then((response)=>{
      console.log("response",response);
      var tabledata = response.data.map((a,i)=>{
        return{
          _id                    : a._id,
          clientDetails          : a.recording_id && a.recording_id.client_id ? "<a target='_blank' href="+'/company-profile/'+a.recording_id.client_id+">"+(a.recording_id.clientName)+"</a>" :"NA",
          recordingLocationName  : a.recordingLocationName,
          locationName           : "<div class='divWrap'>"+a.locationName+"</div>",
          address                : "<div class='divWrap'>"+a.address[0].addressLine1+"</div>",
          cameraDetails          : "<div><b>Industry : </b>"+a.cameraBrand+"</div>"+"<div><b>Actual Performance : </b>"+a.cameraResolution+"</div>"+"<div><b>Equipment Specifications : </b>"+a.cameraType+"</div>"+"<div><b>Equipment Model : </b>"+a.cameraModel+"</div>"+"<div><b>Url : </b>"+a.cameraUrl+"</div>",
          images                 : a.images.length > 0 ? "<a target='_blank'  class='imageOuterContainerDM' title='Click to View' href="+(a.images[0])+"><embed src="+(a.images[0])+" class=' tableImage'/></a><span class='col-lg-12 nopadding text-info pointerCls'  data-toggle='modal' data-target='#myModal' onclick=window.showImages('" +a._id +"')>View More</span>": "<img src='/images/noImagePreview.png' class='img-responsive tableImage'/>"
        }
      })
      this.setState({
        tableData : tabledata,
        isLoading : false
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
 
   searchEntity(event) {
    filterData.search = event.target.value;
    this.getData()
  }

   showImages(camralocation_id){
    console.log("camralocation_id",camralocation_id);
    // var id = "#showProfile-"+id
    this.setState({camralocation_id:camralocation_id},()=>{
      $('myModal').show()
    })
  }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="formWrapper">
                        <section className="content">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                            <div className="row">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                  <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Equipment Location List</h4>
                                   <a href="/cameralocation">
                                    <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
                                      <span className="col-lg-6 col-lg-offset-5 sentanceCase addButtonList"><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;Add New Equipment Location
                                      </span>
                                    </div>
                                  </a>  
                                </div> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">                  
                                 {/* <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
                                    <button type="button" className=" selectFilterBtn reset" onClick={this.selectFilter.bind(this)}>
                                      <i class="fa fa-filter"></i>&nbsp;&nbsp;<b> SELECT FILTER</b>
                                    </button>
                                  </div>*/}
                                  
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Total Records :&nbsp;&nbsp;<b>{this.state.locationCount}</b></h5>
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Filtered :&nbsp;&nbsp;<b>{this.state.tableData.length}</b></h5>
                                  <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right inLOE" >
                                    <span className="blocking-span" >
                                      <input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
                                        placeholder="Search..." onInput={this.searchEntity.bind(this)} />
                                    </span>
                                  </div>
                                </div>
                                {/*<div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls nopadding">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderBottomSO">
                                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 firstElement filterWrapper">
                                    <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
                                      <button type="button" className="reset selheight" onClick={this.resetFilter.bind(this)}>RESET FILTERS</button>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
                                      <select className="form-control resetinp selheight Statesdata" ref="states" name="stateCode" defaultValue={this.state.stateCode} 
                                      onChange={this.onSelectedItemsChange.bind(this,'state')}>
                                        <option disabled value="Select State">Select State</option>
                                        {this.state.statesArray &&
                                          this.state.statesArray.map((Statedata, index) => {
                                            return (
                                              <option key={index} value={Statedata.stateCode}>{this.camelCase(Statedata.stateName)}</option>
                                            );
                                          }
                                          )
                                        }
                                      </select>
                                    </div>
                                    <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
                                      <select className="form-control resetinp selheight districtsdata" ref="district" name="district" value={this.state.district}
                                      onChange={this.onSelectedItemsChange.bind(this,'district')}>
                                        <option value="Select District" disabled>Select District</option>
                                        {this.state.districtArray && this.state.districtArray.length > 0 &&
                                          this.state.districtArray.map((districtdata, index) => {
                                            return (
                                              <option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
                                            );
                                          }
                                          )
                                        }
                                      </select>
                                    </div>
                                  
                                  </div>

                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                      <button type="button" className="btn alphab allBtn"  id="filterallalphab" onClick={this.shortByAlpha.bind(this)} name="initial" value={this.state.initial} onChange={this.handleChange}>All</button>
                                      <button type="button" className="btn alphab" value="A" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>A</button>
                                      <button type="button" className="btn alphab" value="B" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>B</button>
                                      <button type="button" className="btn alphab" value="C" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>C</button>
                                      <button type="button" className="btn alphab" value="D" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>D</button>
                                      <button type="button" className="btn alphab" value="E" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>E</button>
                                      <button type="button" className="btn alphab" value="F" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>F</button>
                                      <button type="button" className="btn alphab" value="G" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>G</button>
                                      <button type="button" className="btn alphab" value="H" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>H</button>
                                      <button type="button" className="btn alphab" value="I" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>I</button>
                                      <button type="button" className="btn alphab" value="J" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>J</button>
                                      <button type="button" className="btn alphab" value="K" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>K</button>
                                      <button type="button" className="btn alphab" value="L" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>L</button>
                                      <button type="button" className="btn alphab" value="M" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>M</button>
                                      <button type="button" className="btn alphab" value="N" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>N</button>
                                      <button type="button" className="btn alphab" value="O" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>O</button>
                                      <button type="button" className="btn alphab" value="P" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>P</button>
                                      <button type="button" className="btn alphab" value="Q" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Q</button>
                                      <button type="button" className="btn alphab" value="R" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>R</button>
                                      <button type="button" className="btn alphab" value="S" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>S</button>
                                      <button type="button" className="btn alphab" value="T" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>T</button>
                                      <button type="button" className="btn alphab" value="U" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>U</button>
                                      <button type="button" className="btn alphab" value="V" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>V</button>
                                      <button type="button" className="btn alphab" value="W" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>W</button>
                                      <button type="button" className="btn alphab" value="X" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>X</button>
                                      <button type="button" className="btn alphab" value="Y" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Y</button>
                                      <button type="button" className="btn alphab" value="Z" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Z</button>
                                  </div>
                                </div>  */}      
                                <section className="content">
                                  <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <IAssureTable
                                        tableHeading={this.state.tableHeading}
                                        dataCount={this.state.dataCount}
                                        tableData={this.state.tableData}
                                        getData={this.getData.bind(this)}
                                        tableObjects={this.state.tableObjects}
                                        isLoading={this.state.isLoading}
                                      />
                                    </div>
                                  </div>
                                </section>
                            </div>
                          </div>
                        </section>
                    </div>
                </div>
                 <div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id="myModal"  role="dialog">
                    <div className=" modal-dialog adminModal adminModal-dialog">
                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"><b>Images</b></h4>
                      <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </div>
                       <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <ShowingModalImages id={this.state.camralocation_id}/>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
        );
    }
}
