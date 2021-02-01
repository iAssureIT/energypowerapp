const mongoose	        = require("mongoose");
const MonthlyReimbursemet      = require('./Model.js');


exports.pay_reimbursement = (req,res,next)=>{
    const monthyear = req.body.monthyear;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];
    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;
    MonthlyReimbursemet.findOne({
        "startDate" : {$gte    : startDate}, 
        "endDate"   : {$gte    : endDate},
        "person_id"   : req.body.person_id, 
    })
    .exec()
    .then(data=>{
        console.log("data",data);
        if(data){
            MonthlyReimbursemet.updateOne(
                {_id:data._id},
                {
                    $set:{paid : data.paid+req.body.paid},
                    $push:{paidArray:{
                            paid        : req.body.paid,
                            updatedAt   : new Date(),
                            updatedBy   : req.body.updatedBy
                        }
                    }
                }
            )
            .exec()
            .then(data=>{
                res.status(200).json({ updated : true, reimbursement_id : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
                console.log("error---->",err);
            });
        }else{
            const monthlyReimbursemet = new MonthlyReimbursemet({
                _id                  : new mongoose.Types.ObjectId(),
                startDate            : startDate,
                endDate              : endDate,
                person_id            : req.body.person_id,
                paid                 : req.body.paid,
                paidArray            :{
                                        paid        : req.body.paid,
                                        updatedAt   : new Date(),
                                        updatedBy   : req.body.updatedBy
                                    },
                createdBy            : req.body.updatedBy,
                createdAt            : new Date()
            })
            monthlyReimbursemet.save()
            .then(data=>{
                res.status(200).json({ created : true, reimbursement_id : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
                console.log("error---->",err);
            });
        }
    })
    .catch()
    
};