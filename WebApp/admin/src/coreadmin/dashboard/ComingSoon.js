import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import { withRouter }       from 'react-router-dom';
import _                    from 'underscore';

import 'bootstrap/js/tab.js';
var apiLink = "";
class ComingSoon extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                    <section className="content">
                        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className='col-lg-12' style={{'text-align':'center', margin:'0 auto'}}>
                            <img src='/images/comingSoon.jpg' />
                            </div>
                        </div>
                    </section>
                </div>

        );
    }
}
export default withRouter(ComingSoon)


