import React,{Component}  from 'react';
import { render }         from 'react-dom';
import {Link}             from 'react-router-dom';
import moment             from 'moment';
import $                  from 'jquery';
import { Chart }          from "react-google-charts";

class AdminContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      allUserData : [],
      monthwiseRegistration :[10,20,30,40,50,60,70,80,90,100,110,120],
      CompetitionwiseReg : [],
      allPackages: [],
      PackagesPurchaseCnt: [],
      latestTweentyReg:[],
      userCount: 0,
      pieOptions      : "",
      pieData         : "",
      dataColumnChart : ""
    };
  }

  componentWillMount(){
    $('.sidebar').css({display:'block',background: '#222d32'});
  }

  componentDidMount() {
    const dataColumnChart = [
      ["Month", "Cost (Lac)", { role: "style" }],
      ["Oct", 3, "#6D78AD"],
      ["Nov", 4.5, "#5CCDA0"],
      ["Dec", 7, "#DF7970"],
      ["Jan", 4.5, "#4C9CA0"],
      ["Feb", 5, "#AE7D99"],
      ["Mar", 6, "#C9D45B"],
      ["Apr", 5.5, "#5592AC"],
      ["May", 7, "#F4C12E"],
      ["Jun", 4, "#CC68DE"],
      ["Jul", 5, "#F18230"],
      ["Aug", 7, "#79B2F5"],
      ["Sep", 1.5, "#424263"],
    ];
    
    const pieData=[
      ["Monthly", "Weekly"], 
      ["Monthly", 33], 
      ["Weekly", 42], 
      ["Daily", 25]
    ];

    const pieOptions = {
      title: "",
      pieHole: 0.6,
      slices: [
        {
          color: "#6D78AD"
        },
        {
          color: "#5CCDA0"
        },
        {
          color: "#DF7970"
        },
        {
          color: "#e9a227"
        }
      ],
      legend: {
        position: "bottom",
        alignment: "center",
        textStyle: {
          color: "233238",
          fontSize: 14,
          font: "montserrat",
        }
      },
      tooltip: {
        showColorCode: true
      },
      chartArea: {
        left: 0,
        top: 20,  
        width: "100%",
        height: "80%"
      },
      fontName: "Roboto"
    };

    this.setState({
      pieOptions      : pieOptions,
      pieData         : pieData,
      dataColumnChart : dataColumnChart
    })
  }

  allUserCount(){
    return this.state.allUserData.length;
  }

  componentDidUpdate(){
    
  }
  render(){

    return(
      <div>
        <div className="content-wrapper">
          <section className="content-header">
            <h1>Dashboard</h1>
          </section>
          <section className="content">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-orange">
                    <i className="fa fa-users"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Users<small></small></span>
                    <span className="info-box-text">
                      Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>789</b>
                    </span>
                    <span className="info-box-text">
                      Subscribed&nbsp;&nbsp;&nbsp;&nbsp;<b>718</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <i className="fa fa-users" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Vendors<small></small></span>
                    <span className="info-box-text">
                      Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>789</b>
                    </span>
                    <span className="info-box-text">
                      Active&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>718</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    <i className="fa fa-rupee" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Total Earning<small></small></span>
                    <span className="info-box-text">
                      YTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>15.00 L</b>
                    </span>
                    <span className="info-box-text">
                      MTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>03.15 L</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-bars"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Menu Orders<small></small></span>
                    <span className="info-box-text">
                      YTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>789</b>
                    </span>
                    <span className="info-box-text">
                      MTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>718</b>
                    </span>
                  </div>
                </div>
              </div>              
            </div>

            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12 graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                  <h4>Gross Earning <i className="fnt12">(Last 12 months)</i></h4>
                  {this.state.dataColumnChart!=="" ?
                  <div className="newCssBar">
                  <Chart
                      chartType="ColumnChart"
                      data={this.state.dataColumnChart}
                      width="100%"
                      height="300px"
                      legendToggle
                    />
                    </div>
                    :
                    <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center bgImgWt">
                          <img src="/images/cofficLoader.gif" alt="Logo_img" height="21%" width="21%" className="imgHt"/>
                        </div>
                    </div>
                  }
                </div>
              </div> 
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 row graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 row innerGraphWrap">
                  <h4>Subscription Details <i className="fnt12">(Last 12 months)</i></h4>
                  {this.state.pieData!=="" ?
                  <div className="col-lg-12 col-md-12 col-sm-12 newCssPie innerGraphWrap">
                      <Chart
                        chartType="PieChart"
                        data={this.state.pieData}
                        options={this.state.pieOptions}
                        graph_id="PieChart"
                        width={"100%"}
                        height={"230px"}
                        legend_toggle
                      />
                  </div>
                    :
                    <div>
                      <div className="col-lg-12 col-md-12 col-sm-12 row text-center ">
                        <img src="/images/cofficLoader.gif" alt="Logo_img" height="50%" width="50%" className="imgHt"/>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardDivider"></div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg" >
                  <h4>Cafewise current check-ins and check-outs <i className="fnt12b"><Link to="/dashboard/report1">(See More)</Link></i></h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg">
                  <h4>Latest Active Subscriptions <i className="fnt12b"><Link to="/dashboard/report1">(See More)</Link></i></h4>
                  <table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
                  <thead>
                    <tr className="tableHeader tableHeader20">
                      <th> SR.No. </th>
                      <th> Name of User </th>
                      <th> Package Name </th>
                      <th> Total Checkins </th>
                      <th> Checkins Left </th>
                      <th> Package Purchase Date </th>
                      <th> Package End Date </th>
                    </tr>                    
                  </thead>
                  {this.state.latestTweentyReg.length>0 ?
                  <tbody className="myTableData tableHeader20">
                   {this.state.latestTweentyReg.map((latestReg, index)=>{
                    return <tr key={index}>
                          <td>{latestReg.studentFullName}</td>
                          <td>{latestReg.franchiseName}</td>
                          <td>{latestReg.category}/{latestReg.subCategory}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{moment(latestReg.paymentDate).format("DD/MM/YYYY")}</td>
                        </tr>
                  })}
                  </tbody>
                  :
                  <tbody>
                    <tr>
                      <td>1.</td>
                      <td>Amit  Shinde</td>
                      <td>Monthly</td>
                      <td>30</td>
                      <td>12</td>
                      <td>01/09/2019</td>
                      <td>01/10/2019</td>
                    </tr> 
                    <tr>
                      <td>2.</td>
                      <td>Omkar Ronghe</td>
                      <td>Weekly</td>
                      <td>07</td>
                      <td>05</td>
                      <td>02/09/2019</td>
                      <td>02/10/2019</td>
                    </tr> 
                    <tr>
                      <td>3.</td>
                      <td>Karuna Khandale</td>
                      <td>Weekly</td>
                      <td>07</td>
                      <td>03</td>
                      <td>30/08/2019</td>
                      <td>30/09/2019</td>
                    </tr> 
                         
                 </tbody>
                }
                </table>
                </div>
              </div>              
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg">
                  <h4>Cafewise Seat Booking <i className="fnt12b"><Link to="/dashboard/report1">(See More)</Link></i></h4>
                  <table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
                  <thead>
                    <tr className="tableHeader tableHeader20">
                      <th> SR.No. </th>
                      <th> Café Name </th>
                      <th> City </th>
                      <th> Branch </th>
                      <th> Total Seats </th>
                      <th> Occupied Seats </th>
                      <th> Available Seats </th>
                    </tr>                                   
                  </thead>
                  {this.state.latestTweentyReg.length>0 ?
                  <tbody className="myTableData tableHeader20">
                   {this.state.latestTweentyReg.map((latestReg, index)=>{
                    return <tr key={index}>
                          <td>{latestReg.studentFullName}</td>
                          <td>{latestReg.franchiseName}</td>
                          <td>{latestReg.category}/{latestReg.subCategory}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{moment(latestReg.paymentDate).format("DD/MM/YYYY")}</td>
                        </tr>
                  })}
                  </tbody>
                  :
                  <tbody>
                    <tr>
                      <td>1.</td>
                      <td>Super Café </td>
                      <td>Jaipur</td>
                      <td>C Scheme</td>
                      <td>10</td>
                      <td>09</td>
                      <td>01</td>
                    </tr> 
                    <tr>
                      <td>2.</td>
                      <td>Great Royal Café</td>
                      <td>Pune</td>
                      <td>Magarpatta City</td>
                      <td>08</td>
                      <td>01</td>
                      <td>07</td>
                    </tr> 
                    <tr>
                      <td>3.</td>
                      <td>Pleasant Cafe</td>
                      <td>Delhi</td>
                      <td>Saket</td>
                      <td>09</td>
                      <td>06</td>
                      <td>03</td>
                    </tr>
                      
                 </tbody>
                }
                </table>
                </div>
              </div>
             
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default AdminContent;