import React, { Component }     from 'react';
import "./PrivacyPolicy.css";
export default class PrivacyPolicy extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding BoxSize2">
				<div className="container-fluid">
					<div className="col-lg-10 col-lg-offset-1 col-md-10 col-sm-12 col-xs-12 noPadding About1 ">
						<h3 className="col-lg-5 col-xs-10 col-xs-offset-1  About2 ">Privacy Policy</h3>
						<h5 className="col-lg-5 col-xs-10 pull-right text-center mt30"><b>Effective Date : </b>29 September 2020</h5>
						<hr className="col-lg-10 col-lg-offset-1 col-xs-11" />
						<p className="col-lg-10 col-lg-offset-1 col-xs-11 policyTitle">This privacy notice tells you about our online collection and use of data, 
							how it is held and processed and how we respect your privacy. It also explains your rights under the law relating to your personal data. 
							This policy may be amended from time to time. We encourage visitors to and users of our website to regularly review our Privacy Policy.
						</p>
					{/*1*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
							<p className="col-lg-12  col-xs-12 terms2 noPadding">What Is Personal Data</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1 policy3 noPadding">
							<ul>
								<li>Personal data is ‘any information relating to an identifiable person who can be directly or indirectly identified in particular by reference to an identifier’.
									Personal data is, in simpler terms, any information about you that enables you to be identified. Personal data covers obvious information such as your name and contact details, but it also covers less obvious information such as identification numbers or account codes for example.
									iSecure Technology understand that your privacy is important to you and we are committed to protecting your privacy and meeting all our statutory obligations. This privacy policy informs you about our online collection and use of data via our website which is the only website we operate. By using this site, you understand and agree to the terms of this policy. 
								</li>
							</ul>		
						</div>
					{/*2*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
							<p className="col-lg-12  col-xs-12 terms2 noPadding">Registration for the Site and Collection of Your Personal Information</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>Where you choose to register to use the site, you will be required to provide certain Personal Information, including your username and password, your name, your mailing address, email address and phone number. 
								</li>
							</ul>		
						</div>
						{/*3*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Use of Your Personal Information</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>iSecure Technology collects and uses your personal information to operate and improve our site, to process your transactions and to provide customer service. We also use your personal information to communicate with you. We may also send you marketing emails to inform you of new products or services or other information that may be of interest.
								</li>
							</ul>	
						</div>
					{/*4*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Location data</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>We collect precise or approximate location data from a user’s mobile device if enabled by the user to do so.
								</li>
							</ul>		
						</div>
					{/*5*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Usage Data</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
								</li>
							</ul>		
						</div>
					{/*6*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Camera Access</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>
									You may require to provide camera access to us. We collect the photographs of various CCTV installations and related instruments after they are installed with the help of camera access. We store this photograph in Amazon S3 for secured storage and these photos would be deleted after 3 years of use.
								</li>
							</ul>
						</div>
					{/*7*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Security of Your Personal Information</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>
									The security of your personal information is important to us. We follow generally accepted industry standards to help protect your personal information. For instance, when you enter sensitive information on our online registration, we encrypt that information using secure socket layer (SSL) technology. No method of transmission over the internet, or method of electronic storage, is 100% secure. Therefore, while we strive to protect your personal information, we cannot guarantee its absolute security.
									If a password is used to protect your account and personal information, it is your responsibility to keep your password confidential.
								</li>
							</ul>
						
						</div>
					{/*8*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Service Providers</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>
									We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
									These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
								</li>
							</ul>		
						</div>
					{/*9*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Children's Privacy</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>
									Our Service does not address anyone under the age of 18 ("Children").
								</li>
								<li>
									We do not knowingly collect personally identifiable information from anyone under the age of 18. 
									If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. 
									If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
								</li>
								<li>
									By agreeing to this privacy policy you are giving your consent to receive phone calls and emails from us. 
									As you are agreeing with our privacy-policy, you abide with all the policies present in this document and all the others which will be added in this document in future.
								</li>
							</ul>		
						</div>
					{/*10*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Changes to This Privacy Policy</p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 noPadding">
							<ul>
								<li>
									We may update our Privacy Policy from time to time. We will notify you of any
									changes by posting the new Privacy Policy on this page.
								</li>
								<li>
									We will let you know via email and/or a prominent notice on our Service, prior
									to the change becoming effective and update the "effective date" at the top of
									this Privacy Policy.
								</li>
								<li>
									You are advised to review this Privacy Policy periodically for any changes.
									Changes to this Privacy Policy are effective when they are posted on this
									page.
								</li>
							</ul>	
						</div>
					{/*11*/}
						<div className="col-lg-10 col-lg-offset-1 col-xs-12 terms1">
						<p className="col-lg-12  col-xs-12 terms2 noPadding">Contact Us </p>
						</div>
						<div className="col-lg-10 col-lg-offset-1  policy3 mb20 noPadding">
							<ul>
								<li>If you have any questions about these Terms and Conditions, You can contact us by email: <b>staappproject@gmail.com</b> 
								</li>
							</ul>		
						</div>
						{/**/}
					</div>
				</div>
			</div>
		);
	}
}