
	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
	var nodeMailer   					= require('nodemailer');
	const globalVariable 				= require('./nodemon.js');

	mongoose.connect('mongodb://localhost/'+globalVariable.dbname,{
		useCreateIndex: true,
		useNewUrlParser: true,
	})
	mongoose.promise = global.Promise;

	app.use(morgan("dev"));
	app.use('/uploads', express.static('uploads'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		if (req.method === "OPTIONS") {
			res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
			return res.status(200).json({});
		}
		next();
	});

	// Routes - Core Admin
    
    const systemSecurityRoutes 				= require('./coreAdmin/systemSecurity/RoutesSystemSecurity.js');
	const userRoutes 						= require('./coreAdmin/userManagement/RoutesUsers.js');
	const rolesRoutes						= require('./coreAdmin/rolesManagement/RoutesRoles.js');
	const masternotificationRoutes			= require('./coreAdmin/notificationManagement/RoutesMasterNotification.js');
	const notificationRoutes				= require('./coreAdmin/notificationManagement/RoutesNotification.js');
	const companySettingsRoutes				= require('./coreAdmin/companySettings/RoutesCompanySettings.js');
	
	const personMasterRoutes				= require("./sta/personMaster/RoutesPersonMaster.js");
	const projectSettingRoutes 				= require('./coreAdmin/projectSettings/RoutesProjectSettings.js');
	const globalMasterRoutes 					= require('./coreAdmin/globalMaster/RoutesGlobalMaster.js');
	const preferencesRoutes 					= require('./coreAdmin/preferences/RoutesPreferences.js');
	const paymentgatewayRoutes 				= require('./coreAdmin/paymentgateway/Routes.js');

	const rolesentitymasterRoutes			= require('./coreAdmin/RoleEntityMaster/Routes.js');
	const documententitymasterRoutes	= require("./coreAdmin/DocumentEntityMaster/Routes.js");
	const documentListMasterRoutes		= require("./coreAdmin/DocumentListMaster/Routes.js");

	/*sta*/
	const equipmentlocationRoutes 			= require('./sta/equipmentLocation/Routes.js');
	const projectlocationRoutes 	    = require('./sta/projectLocation/Routes.js');
	const addTicketRoutes       	    = require('./sta/ticketMaster/Routes.js');
	const addsiteRoutes          	    = require('./sta/siteMaster/Routes.js');
	const addprojectRoutes          	= require('./sta/projectMaster/Routes.js');
	const vehicleMasterRoutes		    = require("./sta/vehicleMaster/Routes.js");
	const fuelReimbursementRoutes		= require("./sta/fuelReimbursement/Routes.js");
	const monthlyReibursementRoutes		= require("./sta/monthlyReimbursement/Routes.js");

	/*clientMaster*/
	const entityRoutes					= require("./sta/entityMaster/RoutesEntityMaster.js");


	/*Single field masters*/
	const industryMasterRoutes    	    = require('./sta/industryMaster/Routes.js');
	const divisionMasterRoutes    	= require('./sta/divisionMaster/Routes.js');
	const processRoutes         	= require('./sta/processMaster/Routes.js');
	const equipmentSpecificationsRoutes    	= require('./sta/equipmentSpecifications/Routes.js');
	const taskTypeMasterRoutes      	= require('./sta/taskTypeMaster/Routes.js');
	const actualPerformanceRoutes      	= require('./sta/actualPerformance/Routes.js');
	const equipmentModelRoutes      	    = require('./sta/equipmentModel/Routes.js');
	const departmentMasterRoutes		= require("./coreAdmin/departmentMaster/RoutesDepartmentMaster.js");
	const designationMasterRoutes		= require("./coreAdmin/designationMaster/RoutesDesignationMaster.js");
	const locationTypeMasterRoutes		= require("./coreAdmin/locationTypeMaster/RoutesLocationTypeMaster.js");
	/*Tracking Url*/
    const attendanceRoutes                	= require("./sta/attendance/Routes.js");
    /*Report Url*/
    const reportRoutes                	= require("./sta/reports/Routes.js");
	const EventMappingRoutes				= require("./coreAdmin/EventMappingMaster/RoutesEventMapping.js");
	const EventTokenRoutes			= require("./coreAdmin/EventTokenMaster/RoutesEventTokenMaster.js");
	//URL's collection wise
	//coreAdmin


	// app.use("/roles", rolesRoutes);
 //    app.use('/projectsettings',projectSettingRoutes);
    app.use("/api/roles", rolesRoutes);
	app.use('/api/projectsettings',projectSettingRoutes);
	app.use("/api/auth", systemSecurityRoutes);
	app.use("/api/users", userRoutes);
	app.use("/api/masternotifications",masternotificationRoutes);
	app.use('/api/notifications',notificationRoutes);
	app.use('/api/companysettings',companySettingsRoutes);
	app.use("/api/personmaster", personMasterRoutes);
	app.use('/api/globalmaster',globalMasterRoutes);
	app.use("/api/locationtypemaster", locationTypeMasterRoutes);
	app.use("/api/locationtypemaster", locationTypeMasterRoutes);
	app.use("/api/rolesentitymaster", rolesentitymasterRoutes);
	app.use('/api/preferences',preferencesRoutes);
	app.use("/api/paymentgateway", paymentgatewayRoutes);
	app.use("/api/documententitymaster", documententitymasterRoutes);
	app.use("/api/documentlistmaster", documentListMasterRoutes);
    // app.use("/users", userRoutes);

	/*app.use("/roles", rolesRoutes);
	app.use("/masternotifications",masternotificationRoutes);
	app.use('/notifications',notificationRoutes);
	app.use('/companysettings',companysettingsRoutes);
	app.use('/projectsettings',projectSettingRoutes);*/

	
	app.use("/api/eventmapping", EventMappingRoutes);
	app.use("/api/EventToken", 					EventTokenRoutes);

	/*sta*/
	app.use('/api/equipmentlocation',equipmentlocationRoutes);
	app.use('/api/projectlocation',projectlocationRoutes);
	app.use('/api/tickets',addTicketRoutes);
	app.use('/api/addsite',addsiteRoutes);
	app.use('/api/addproject',addprojectRoutes);
	app.use('/api/monthlyreimbursement',monthlyReibursementRoutes);

	/*single field*/
	app.use('/api/industryMaster',industryMasterRoutes);
	app.use('/api/divisionMaster',divisionMasterRoutes);
	app.use('/api/equipmentSpecifications',equipmentSpecificationsRoutes);
	app.use('/api/process',processRoutes);
	app.use('/api/taskTypeMaster',taskTypeMasterRoutes);
	app.use('/api/actualPerformance',actualPerformanceRoutes);
	app.use('/api/equipmentModel',equipmentModelRoutes);
	app.use("/api/departmentmaster", departmentMasterRoutes);
	app.use("/api/designationmaster", designationMasterRoutes);
	app.use("/api/locationtypemaster", locationTypeMasterRoutes);
	app.use("/api/vehiclemaster", vehicleMasterRoutes);
	app.use("/api/fuelReimbursement", fuelReimbursementRoutes);

	/*client master*/
	app.use("/api/entitymaster", entityRoutes);
	/*Tracking Url*/
	app.use("/api/attendance",attendanceRoutes);
	/*Report Url*/
	app.use("/api/reports",reportRoutes);


	app.post('/send-email', (req, res)=> {
	let transporter = nodeMailer.createTransport({
		host: globalVariable.emailHost,
		port: globalVariable.emailPort,
		auth: {
			user: globalVariable.user,
			pass: globalVariable.pass
		}
	});
	console.log("transporter",transporter);
	let mailOptions = {
		from   : '"iAssureIT" <'+globalVariable.user+'>', // sender address
		to     : req.body.email, // list of receivers
		subject: req.body.subject, // Subject line
		text   : req.body.text, // plain text body
		html   : req.body.mail // html body
	};	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {			
			return "Failed";
		}
		if(info){
			res.status(200).json({ 
				message: "Success",
			});
		}else{
			res.status(401).json({ 
				message: "Failed",
			});
		}
		res.render('index');
	});
});


	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500);
		res.json({
				error: {
				message: error.message
				}
			});
	});

	module.exports = app;