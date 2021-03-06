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

export default class ListOfRecordingLocations extends Component{

  constructor(props) {
    super(props);
    this.state = {

            "tableHeading": {
              clientDetails   : "Client Details",
              projectDetails  : "Department & Project",
              siteDetails     : "Site Details",
              locationName    : "Location Name",
              address         : "Address",
              recorderDetails : "Division",
              images          : "Images",
              actions         : 'Action',
              
      },
           "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/projectlocation/',
          paginationApply: false,
          searchApply    : false,
          editUrl        : '/projectlocation',
          listUrl        : '/listprojectloc'         
      },


            stateArray                :[],
            clientArray               :[],
            projectArray              :[],
            siteArray                 :[],
            divisionArray         :[],
            industryArray                :[],
            maxChannelsArray          :[],
            clientName                : '',   
            projectName               : '',   
            sitename                  : '',
            locationName     : '',
            division              : '',
            industry                     : '',
            process               : '',
            country                   : '',
            state                     : '',
            city                      : '',
            area                      : '',
            pincode                   : '',
            imgs                      : [],
            projectLocLatitude      : '',
            projectLocLongitude     : '',
            "editId"                  : props.match.params ? props.match.params.id : '',
            locationCount             : 0,
            tableData                 : [],
            images                    : [],
            isLoading                 : true,
  
    };
      this.handleChange  = this.handleChange.bind(this);
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
    this.getRecordingLocCount()
  }

 getRecordingLocCount(){
     axios.get("api/projectlocation/get/count")
      .then(res => {
          this.setState({locationCount:res.data.count})
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }
  
  getData(){
    axios.post('/api/projectlocation/get/list',filterData)
    .then((response)=>{
      var tabledata = response.data.map((a,i)=>{
        return{
          _id                    : a._id,
          clientDetails          : "<a target='_blank' href="+'/company-profile/'+a.client_id+">"+(a.clientName)+"</a>",
          projectDetails         : "<div class='divWrap'>"+a.department +"-"+ a.project+"</div>",
          siteDetails            : "<div class='divWrap'>"+a.siteName+"</div>",
          locationName           : "<div class='divWrap'>"+a.locationName+"</div>",
          address                : "<div class='divWrap'>"+a.address[0].addressLine1+"</div>",
          recorderDetails        : "<div><b>Industry : </b>"+a.industry+"</div>"+"<div><b>Process : </b>"+a.process+"</div>"+"<div><b>Division : </b>"+a.division+"</div>",
          images                 : a.images.length > 0 ? "<a target='_blank'  class='imageOuterContainerDM' title='Click to View' href="+(a.images[0])+"><embed src="+(a.images[0])+" class='tableImage'/></a><span class='col-lg-12 nopadding text-info pointerCls'  data-toggle='modal' data-target='#myModal' onclick=window.showImages('" +a._id +"')>View More</span>": "<img src='/images/noImagePreview.png' class='img-responsive tableImage'/>"
        }
      })
      this.setState({
        tableData : tabledata,
        isLoading : false,
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
  selectFilter(event){
    $(".filterWrapper").toggle();
  }

  resetFilter(event) {
    event.preventDefault();
    $('.category').prop('selectedIndex', 0);
    $('.Statesdata').prop('selectedIndex', 0);
    $('.districtsdata').prop('selectedIndex', 0);
    $('.searchEntity').val('');
    this.setState({
      'stateCode': 'Select State',
      'district' : 'Select District',
      'districtArray':[],
      'selector' : {},
      'initial': 'All',
    })

    for (var key in document.querySelectorAll('.alphab')) {
      $($('.alphab')[key]).css('background', '#ddd');
      $($('.alphab')[key]).css('color', '#000');
    }

    document.getElementById("filterallalphab").style.background = '#000';
    document.getElementById("filterallalphab").style.color = '#fff';

    var selector = this.state.selector;
    selector = {}
    this.setState({ selector: selector },()=>{
      this.getFilteredProducts(this.state.selector);
      this.getgridFilteredProducts(this.state.selector);
    })
  }

    onSelectedItemsChange(filterType, selecteditems){
    var selector=this.state.selector;
    this.setState({
        [selecteditems.currentTarget.getAttribute('name')]: selecteditems.currentTarget.value
      });
    if (filterType === 'state') {
      this.handleChangeState(selecteditems.currentTarget.value);
      delete selector.district
      selector.stateCode = selecteditems.currentTarget.value; 
    }
    if(filterType === 'district'){
      selector.district  = selecteditems.currentTarget.value; 
    }
    this.setState({ selector: selector },()=>{
      this.getFilteredProducts(this.state.selector);
      this.getgridFilteredProducts(this.state.selector);
    })
  }


  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  shortByAlpha(event) {
    event.preventDefault();

    for (var key in document.querySelectorAll('.alphab')) {
      $($('.alphab')[key]).css('background', '#ddd');
      $($('.alphab')[key]).css('color', '#000');
    }

    event.target.style.background = '#0275ce';
    event.target.style.color = '#fff';

    var selector=this.state.selector;
    if ($(event.target).attr('value') === 'All') {
      delete selector.initial;
      this.setState({ selector: selector },()=>{
        this.getFilteredProducts(this.state.selector);
        this.getgridFilteredProducts(this.state.selector);
      })
      
    } else {
      
      
      selector.initial = event.currentTarget.value; 

      this.setState({ selector: selector },()=>{
        this.getFilteredProducts(this.state.selector);
        this.getgridFilteredProducts(this.state.selector);
      })
    }
  }

  showImages(project_id){
    console.log("project_id",project_id);
    // var id = "#showProfile-"+id
    this.setState({project_id:project_id},()=>{
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
                                  <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Project Location List</h4>
                                   <a href="/projectlocation">
                                    <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
                                      <span className="col-lg-6 col-lg-offset-5 sentanceCase addButtonList"><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;Add New Project Location
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
                          <ShowingModalImages id={this.state.project_id}/>
                      </div>
                    </div>
                  </div>
               </div>
           </div>
      );
  }
}
