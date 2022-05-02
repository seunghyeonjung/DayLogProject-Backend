"use strict"

const ScheduleStorage=require("./ScheduleStorage");

function getDay(year,month){
    let last_day;

    //console.log("getDay : "+year+", "+month);

    switch(month){
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

    return last_day;
};

class Schedule{
    constructor(req){
        this.req=req;
    }

    async getSchedule(){
        try{
            let where;
            let month_schedules=[];
            const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            let last_day=getDay(this.req.query.year, month);

            
            //console.log(year+", "+last_day);
            //console.log(this.req.userId+", "+this.req.query.date);
            //console.log(this.req.userId+", "+this.req.query.month);
            
  
            where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+this.req.query.year+"-"+month+"-01' AND '"+this.req.query.year+"-"+month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
            month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
            
            if(month_schedules.length==0) return {haveSchedules : false}           
            else return {haveSchedules : true, month_schedules};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveSchedule(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            //console.log(this.req.body.title+", "+this.req.body.content+", "+this.req.body.start_date+", "+this.req.body.end_date);
            let where;
            let month_schedules=[];
            const date=this.req.body.start_date;
            const year=date.substr(0,4);
            const month=date.substr(5,2);
            let last_day=getDay(year, month);

            const res=await ScheduleStorage.saveSchedule(this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);
            //반환값으로 수정한 달의 schedule 다 보냄
            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
                
                if(month_schedules.length==0) return {haveSchedules : false}           
                else return {haveSchedules : true, month_schedules};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeSchedule(){
        try{
            //test 할 때만 userId -> 끝난 후 this.req.userId
            //userId="test123";
            const index=this.req.query.no;
            let month_schedules=[];
            let where="WHERE member_id=? AND schedule_no="+index;
            const date=(await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date;
            console.log(date);
            const year=date.substr(0,4);
            const month=date.substr(5,2);
            
            let last_day=getDay(year, month);
    
            const res=await ScheduleStorage.removeSchedule(index);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
                //반환값으로 수정한 달의 schedule 다 보냄
                if(month_schedules.length==0) return {haveSchedules : false}           
                else return {haveSchedules : true, month_schedules};
            }
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

            const index=this.req.query.no;
            let month_schedules=[];
            let where="WHERE member_id=? AND schedule_no="+index;
            const date=(await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date;
            console.log(date);
            const year=date.substr(0,4);
            const month=date.substr(5,2);
            
            let last_day=getDay(year, month);

            const res=await ScheduleStorage.modifySchedule(index, this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
                //반환값으로 수정한 달의 schedule 다 보냄
                if(month_schedules.length==0) return {haveSchedules : false}           
                else return {haveSchedules : true, month_schedules};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Schedule;