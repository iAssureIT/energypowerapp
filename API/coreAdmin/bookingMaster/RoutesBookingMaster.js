const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../middlerware/check-auth.js');

const bookingMaster = require('./ControllerBookingMaster.js');

router.post('/post', bookingMaster.insertBooking);

router.post('/get/list', bookingMaster.fetchBookings);

router.post('/get/getBookingList', bookingMaster.getAdminBookingList);

router.post('/get/getcorporateBookingList', bookingMaster.getcorporateBookingList);

router.post('/getStatistics', bookingMaster.getStatistics);

router.get('/get/allList', bookingMaster.getAllBookings);

router.get('/get/getAllBookingListForGenerateBill', bookingMaster.getAllBookingListForGenerateBill);

router.get('/get/allListForAdmin', bookingMaster.getAllBookingsForAdmin);

router.get('/get/getBookingsByStatus/:status', bookingMaster.getBookings_By_status);

router.get('/get/getAllBookingsByStatus/:status', bookingMaster.getAllBookingsForAdmin_ByStatus);

router.post('/get/bookingList', bookingMaster.getBookings_User_status);

router.get('/get/count/:createdBy', bookingMaster.countBookings);

router.get('/get/countOfAllBookings', bookingMaster.countAllBookings);

router.get('/get/count/approvalReqBooking/:managerId', bookingMaster.countApprovalReqBookings);

router.get('/get/getAllApprovedBookings/:managerId', bookingMaster.getAllApprovedBookings);

router.get('/get/booking/:bookingID', bookingMaster.getBookingByID);

router.get('/get/bookingData/:bookingID', bookingMaster.getBookingByID_empDetails);

router.get('/get/getBookingsOfUser/:userID', bookingMaster.getBookings_User);

router.get('/get/getSingleBookingListForGenerateBill/:id', bookingMaster.getSingleBookingListForGenerateBill);

router.get('/get/allBooking/:managerId', bookingMaster.getAllApprovalReqBookings);

router.post('/get/allBookingForManager', bookingMaster.getAllBookingsForManager);

router.patch('/patch', bookingMaster.updateBooking);

router.delete('/delete/:bookingID', bookingMaster.deleteBooking);

router.get('/get/matchStatus/:bookingID',bookingMaster.matchBookingStatus);

router.get('/get/matchCRStatus/:bookingID',bookingMaster.matchCRBookingStatus);

router.get('/get/vendor/:bookingID',bookingMaster.getVendorDetail_ByBookingID);

router.get('/get/manager/:bookingID/:status',bookingMaster.managerDetail_ByID);

router.post('/bulkUploadbooking',bookingMaster.bulkUploadBooking);

router.get('/get/filedetails/:fileName', bookingMaster.filedetails);

router.post('/get/filter',bookingMaster.filterBookings);

router.post('/get/AdminBookingfilter',bookingMaster.getAdminfilterBookings);

router.post('/get/corporateBookingfilter',bookingMaster.getcorporatefilterBookings);

router.get('/get/getManagerBookingStatus/:bookingID',bookingMaster.getManagerBookingStatus);

router.post('/get/getAdminSearchBookings',bookingMaster.getAdminSearchBookings);

router.post('/get/getcorporateSearchBookings',bookingMaster.getcorporateSearchBookings);




//Driver App API  - Rushikesh Salunkhe
router.get('/get/list/:status/:personId', bookingMaster.getBookings);

router.get('/get/one/bookingfordriver/:bookingID', bookingMaster.singleBookingForDriver);

router.patch('/patch/status', bookingMaster.updateStatus);

router.patch('/patch/change_driver', bookingMaster.changeDriver);

router.get('/get/status/:bookingID', bookingMaster.getStatus);

router.patch('/patch/tripExpenses', bookingMaster.insert_trip_expenses);

router.patch('/patch/ratingToPassenger', bookingMaster.ratingToPassenger);

router.patch('/patch/updateRouteCoordinates', bookingMaster.update_routeCoordinates);

router.post('/post/trip_otp_verification', bookingMaster.trip_otp_verification);

router.post('/post/start_trip', bookingMaster.start_trip);


//Vendor APP API - Rushikesh Salunkhe
router.post('/post/bookingListForVendor', bookingMaster.getbookingListForVendor);

router.get('/get/one/bookingforvendor/:bookingID', bookingMaster.singleBookingForVendor);

router.patch('/patch/change_vehicle', bookingMaster.changeVehicle);



module.exports = router;