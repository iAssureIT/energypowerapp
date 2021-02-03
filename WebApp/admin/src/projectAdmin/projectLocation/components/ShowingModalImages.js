import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import axios                from 'axios';
import IAssureTable         from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
 
 const filterData = {
    search : 'All'
}

export default class ListOfRecordingLocations extends Component{

  constructor(props) {
    super(props);
    this.state = {
      images : '',
    }
  }
   
 
  componentWillReceiveProps(nextProps){
    this.getData(nextProps.id)
  }
  componentDidMount(){
    this.getData(this.props.id)
  }

 getData(id){
    axios.get('/api/recordinglocation/get/one/'+id)
    .then((response)=>{
      this.setState({
        images : response.data.images,
      })
    })
    .catch((err)=>{console.log('err: ',err)})
  }
 
  render() {
        return (
          <div>
            {this.state.images && this.state.images.length > 0 ?
              this.state.images.map((item,index)=>{
                return(
                   <a href={item} target="_blank"  className="imageOuterContainerDM" title="Click to View"><embed src={item} className='col-lg-6 img-responsive tableImage' style={{height:"300px",width:'50%','border': '1px solid #d4d4d4'}}/></a>
                )
              })
              :
              null
            }
          </div>
      );
  }
}
