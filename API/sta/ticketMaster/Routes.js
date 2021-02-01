const express 	= require("express");
const router 	= express.Router();

const ticketsMaster = require('./Controller.js');

router.post('/post', ticketsMaster.create_Ticket);

router.post('/post/list', ticketsMaster.list_Tickets);

router.get('/get/client_list/:client_id/:status', ticketsMaster.client_tickets_list);

router.get('/get/one/:ticket_id', ticketsMaster.fetch_one);

router.post('/get/paginationcount', ticketsMaster.pagination_count);

router.post('/get/totalcount', ticketsMaster.total_count);


router.patch('/update/:ticket_id', ticketsMaster.update_Ticket);

router.patch('/temp/delete/:ticket_id', ticketsMaster.temp_delete_Ticket);

router.get('/get/deleted', ticketsMaster.get_deleted_tickets);

router.patch('/restore/delete/:ticket_id', ticketsMaster.restore_delete_Ticket);

router.delete('/permanent/delete/:ticket_id', ticketsMaster.permanent_delete_Ticket);

router.patch('/patch/status', ticketsMaster.updateStatus);

router.patch('/patch/reopen_ticket', ticketsMaster.reopenTicket);

router.patch('/patch/ticket_allocation', ticketsMaster.ticket_allocation);

router.patch('/patch/service_request', ticketsMaster.serviceRequest);



//Technician API
router.get('/get/technician_dashboard_count/:technician_id', ticketsMaster.technician_dashboard_count);

router.get('/get/client_dashboard_count/:client_id', ticketsMaster.client_dashboard_count);

router.get('/get/technician_list/:technician_id/:status', ticketsMaster.technician_tickets_list);


//Dashboard API
router.get('/get/count/:status', ticketsMaster.get_count);

router.get('/get/tickets_status_wise', ticketsMaster.tickets_status_wise);

router.get('/get/client_wise_tickets', ticketsMaster.client_wise_tickets);

router.get('/get/month_wise_tickets/:startDate/:endDate', ticketsMaster.month_wise_tickets);

module.exports = router;