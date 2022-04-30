"use strict"

const ScheduleStorage=require("./ScheduleStorage");

class Schedule{
    constructor(req){
        this.req=req;
    }

    async getSchedule(){
        try{
            let today=new Date();
            let year=today.getFullYear();
            let res;
            let where;
            let last_day;

            switch(this.req.query.month){
                case "01" : last_day=new Date(year, 1, 0).getDate(); 
                break;
                case "02" : last_day=new Date(year, 2, 0).getDate(); 
                break;
                case "03" : last_day=new Date(year, 3, 0).getDate(); 
                break;
                case "04" : last_day=new Date(year, 4, 0).getDate(); 
                break;
                case "05" : last_day=new Date(year, 5, 0).getDate(); 
                break;
                case "06" : last_day=new Date(year, 6, 0).getDate(); 
                break;
                case "07" : last_day=new Date(year, 7, 0).getDate(); 
                break;
                case "08" : last_day=new Date(year, 8, 0).getDate(); 
                break;
                case "09" : last_day=new Date(year, 9, 0).getDate(); 
                break;
                case "10" : last_day=new Date(year, 10, 0).getDate(); 
                break;
                case "11" : last_day=new Date(year, 11, 0).getDate(); 
                break;
                case "12" : last_day=new Date(year, 0, 0).getDate(); 
                break;
            }
            console.log(year+", "+last_day);
            console.log(this.req.userId+", "+this.req.query.date);
            console.log(this.req.userId+", "+this.req.query.month);
            
            if(this.req.query.date===undefined) {
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+year+"-"+this.req.query.month+"-01' AND '"+year+"-"+this.req.query.month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                res=await ScheduleStorage.getSchedule(this.req.userId, where);
            }
            else{
                where="WHERE member_id=? AND DATE(schedule_start_date)="+"'"+this.req.query.date+"'";
                res=await ScheduleStorage.getSchedule(this.req.userId, where);
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveSchedule(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.body.title+", "+this.req.body.content+", "+this.req.body.start_date+", "+this.req.body.end_date);
            const res=await ScheduleStorage.saveSchedule(this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);
            //반환값으로 수정한 달의 schedule 다 보냄
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeSchedule(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.query.no);
            const res=await ScheduleStorage.removeSchedule(this.req.query.no);
            //반환값으로 수정한 달의 schedule 다 보냄
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifySchedule(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            console.log(this.req.query.no+", "+this.req.userId);
            console.log(this.req.body.title+", "+this.req.body.content+", "+this.req.body.start_date+", "+this.req.body.end_date);

            const res=await ScheduleStorage.modifySchedule(this.req.query.no, this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);
            //반환값으로 수정한 달의 schedule 다 보냄
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Schedule;