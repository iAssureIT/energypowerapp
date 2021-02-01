import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import swal                 from 'sweetalert';
import { withRouter }       from 'react-router-dom';
import 'bootstrap/js/tab.js';
import './NotificationTemplate.css';
import './notification.css';

import TemplateContent from './TemplateContent.js';


class TemplateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           type : props.type,
           templateDetails : [], 
           templateValues : [],
           status:"",
           filteredSelectors: props.filteredSelectors 
        };
    }
    componentDidMount(){
        this.setState({
            type : this.props.type,
            filteredSelectors : this.props.filteredSelectors
        },()=>{this.getData()})
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            type : nextProps.type,
            filteredSelectors : nextProps.filteredSelectors
        },()=>{this.getData()})
    }

    getData(){
        if(this.state.filteredSelectors != ""){
            axios.post("/api/masternotifications/get/filterTemplate/"+this.state.type,this.state.filteredSelectors)
            .then((response) => {
              if(response.data){ 
                this.setState({
                    templateDetails:response.data,
                },()=>{
                    if(this.state.templateDetails && this.state.templateDetails.length > 0){
                        $('#'+this.state.templateDetails[0]._id).toggleClass('active').siblings().removeClass('active');
                        document.getElementById(this.state.templateDetails[0]._id).classList.add("active")
                        axios.get('/api/masternotifications/get/'+this.state.templateDetails[0]._id)
                        .then((response) => {
                            this.setState({
                                templateValues: response.data,
                                status:response.data.status
                            })
                            if(response.data.company === null){
                                this.setState({
                                    companyname : 'All'
                                })
                            }else{
                                var companyId = response.data.company ;
                                axios.get('/api/entitymaster/get/one/'+companyId)
                                .then((res)=>{
                                    this.setState({companyname : res.data[0].companyName})
                                })
                                .catch((error)=>{console.log(error)})
                            }
                        })
                        .catch((error)=>{console.log(error)})
                    }
                })
              }
            })
            .catch((error) => {
            })
        }else{
            axios.get('/api/masternotifications/get/listByType/'+this.state.type)
           .then((response) => { 
                this.setState({
                    templateDetails:response.data
                },()=>{
                    if(this.state.templateDetails && this.state.templateDetails.length > 0){
                        $('#'+this.state.templateDetails[0]._id).toggleClass('active').siblings().removeClass('active');
                        document.getElementById(this.state.templateDetails[0]._id).classList.add("active")
                        axios.get('/api/masternotifications/get/'+this.state.templateDetails[0]._id)
                        .then((response) => {
                            this.setState({
                                templateValues: response.data,
                                status:response.data.status
                            })
                            if(response.data.company === null){
                                this.setState({
                                    companyname : 'All'
                                })
                            }else{
                                var companyId = response.data.company ;
                                axios.get('/api/entitymaster/get/one/'+companyId)
                                .then((res)=>{
                                    this.setState({companyname : res.data[0].companyName})
                                })
                                .catch((error)=>{console.log(error)})
                            }
                        })
                        .catch((error)=>{console.log(error)})
                    }
                })
            })
           .catch((err)=>{console.log('error: ',err)})
            }
       
    }

    showTab(event){
		const target = event.target;
        var id = $(event.currentTarget).attr('id');
        axios.get('/api/masternotifications/get/'+id)
        .then((response) => {
            this.setState({
                templateValues: response.data,
                status: response.data.status
            })
            $('#'+response.data._id).toggleClass('active').siblings().removeClass('active');
            if(response.data.company === null){
                this.setState({
                    companyname : 'All'
                })
            }else{
                var companyId = response.data.company ;
                axios.get('/api/entitymaster/get/one/'+companyId)
                .then((res)=>{
                    this.setState({companyname : res.data[0].companyName})
                })
                .catch((error)=>{console.log(error)})
            }
        })
        .catch((error)=>{console.log(error)})
    }

    
    render() {

        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contentWrapper">
            {this.state.templateDetails && this.state.templateDetails.length > 0 ?
                <div>
                    <div className="col-md-3 col-sm-3 nopadding">
                        <ul className="brand-pills nopadding" role="tablist" id="leftTabs">
                        {this.state.templateDetails.map((data,index)=>{
                            return(
                                <li className="pill_temp" key={index} onClick={this.showTab.bind(this)} id={data._id} >{data.role+'-'+data.templateName}</li>
                            )
                        })}
                        </ul>
                    </div>
                    <div className="col-md-9 col-sm-9">
                        <TemplateContent templateValues={this.state.templateValues} getData={this.getData.bind(this)} company={this.state.companyname} status={this.state.status} />
                    </div>
                </div>
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noContent">No templates created yet for {this.state.type}</div>
            }
            </div>
        );
    }
}
export default TemplateList;

