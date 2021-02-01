

{
    this.state.documentsName && this.state.documentsName.length > 0 ?
        this.state.documentsName.map((doc, i) => {
            return (
                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">

                    <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver  person">{doc.documentName}</label>
                    <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                            <div id="licenseNumber">

                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{doc.documentName} Number <i className="astrick">*</i>
                                    <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="GJ1220190000001" className="fa fa-question-circle"></i> </a>
                                </label>
                                <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.licenseNumber} ref="licenseNumber" name="licenseNumber" placeholder="MH2220675583563" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                            <div id="badgeNumber">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid From Date
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="056683" className="fa fa-question-circle"></i> </a>
                                </label>
                                <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" placeholder="056683" value={this.state.badgeNumber} ref="badgeNumber" name="badgeNumber" placeholder="" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                            <div id="effectiveUpto">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid To Date <i className="astrick">*</i>
                                </label>
                                <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.effectiveUpto} ref="effectiveUpto" name="effectiveUpto" min={moment(new Date).format("YYYY-MM-DD")} onChange={this.handleChange} />
                            </div>
                        </div>

                    </div>
                    <div className="form-margin col-lg-8 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person ">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">License Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  <div className="col-lg-1 col-md-2 col-sm-12 col-xs-12 driver person nopadding">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-upload"></i></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="licenseProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.licenseProof && this.state.licenseProof.length > 0 ?
                                        this.state.licenseProof.map((data, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={data} name="licenseProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        {
                                                          (data ? data.split('.').pop() : "") === "pdf" || (data ? data.split('.').pop() : "") === "PDF" ?
                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdfContainerPM" id="LogoImageUpOne">
                                                              <img src="/images/pdfImg.png"/>
                                                              <span>{(data ? data.split('.').pop() : "")}</span>
                                                          </div>
                                                          :
                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos2" id="licenseProof">
                                                            <img src={data} className="img-responsive logoStyle2" />
                                                          </div>
                                                        }

                                                    </div>
                                                </div>
                                            );
                                        })
                                        :
                                        null
                                  }
                                  </div>

                                </div>
                </div>
            );
        })
        :
        null
}