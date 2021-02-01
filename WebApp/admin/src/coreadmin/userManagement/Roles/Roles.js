import React, { Component }     from 'react';
import TwoFieldForm             from '../../Master/TwoFieldForm/TwoFieldForm.js';
class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "locationType": "",
            "oneFields" : {
                placeholder     : "Add the name of entity & press 'Enter' Key",
                title           : "Roles Entity",
                attributeName   : "rolesentity"
            },
            "oneTableHeading": {
                rolesentity     : "Roles Entity",
                actions         : 'Action',
            },
            "oneTableObjects": {
                deleteMethod: 'delete',
                apiLink     : '/api/rolesentitymaster/',
                paginationApply: false,
                searchApply : false,
                editUrl     : '/umroleslist/oneField',
                editUrl1    : '/umroleslist'
            },

            "fields" : {
                placeholder          : "Enter Role Name",
                title                : "Roles",
                secondtitle          : "Roles Entity",
                attributeName        : "role",
                secondAttributeId    : "rolesentityId",
                secondAttributeName  : "rolesentity"
            },
            "tableHeading": {
                rolesentity         : "Roles Entity",
                role                : "Roles  Name",
                actions             : "Action",
            },
            "tableObjects": {
                deleteMethod    : 'delete',
                apiLink         :'/api/roles/',
                apiLink2        :'/api/rolesentitymaster/',
                paginationApply : false,
                searchApply     : false,
                editUrl         : '/umroleslist'
            },
            "startRange"    : 0,
            "limitRange"    : 10,
            // "editId"        : '',
            // "oneeditId"     : '',
            "editId"        : this.props.match.params ? this.props.match.params.fieldID : '',
            "oneeditId"     : this.props.match.params ? this.props.match.params.fieldID : '',

        };
    }
  componentDidMount() {
        var editId = this.props.match.params.fieldID;
        console.log("this.props.editId==>",editId);
        this.setState({
            editId: editId
        })
        var editId = this.props.match.params.fieldID;
        window.scrollTo(0, 0);
    }
     componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.fieldID;
        if (nextProps.match.params.fieldID) {
            this.setState({
                editId: editId
            })
        }
    }
    render() {
        // console.log("this.props.editId==>",this.state.editId);
        return (
            <div className="container-fluid ">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 rolestwofiledform ">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <TwoFieldForm   
                            fields={this.state.fields}
                            tableHeading={this.state.tableHeading}
                            tableObjects={this.state.tableObjects}
                            editId ={this.state.editId}
                            oneFields={this.state.oneFields}
                            oneTableHeading={this.state.oneTableHeading}
                            oneTableObjects={this.state.oneTableObjects}
                            oneeditId ={this.props.oneFieldEditId}
                            history={this.props.history} 
                        />
                    </div> 
                </div>
            </div>
        )
    }
}
export default Roles;

