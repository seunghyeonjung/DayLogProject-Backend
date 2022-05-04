"use strict"

const ScheduleStorage=require("./ScheduleStorage");
const moment=require('moment');

function getDay(year,month){
    let last_day;

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

            //console.log(this.req.query);

            const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            const date=moment(this.req.query.year+"-"+month);
            const previous=(date.clone().subtract(1, "months")).format("YYYY-MM");
            const next=(date.clone().add(1, "months")).format("YYYY-MM");
            const last_day=getDay(next.substring(0,4), next.substring(5));
       
            where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+previous+"-01' AND '"+next+"-"+last_day+"') ORDER BY schedule_start_date ASC";

            month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
            
            if(month_schedules.length==0) return {haveSchedules : false}           
            else return {haveSchedules : true, month_schedules};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveSchedule(){
        try{
            let where;
            let month_schedules=[];

            const date=moment(this.req.body.start_date);
            const previous=(date.clone().subtract(1, "months")).format("YYYY-MM");
            const next=(date.clone().add(1, "months")).format("YYYY-MM");
            const last_day=getDay(next.substring(0,4), next.substring(5,8));

            const res=await ScheduleStorage.saveSchedule(this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);
            
            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+previous+"-01' AND '"+next+"-"+last_day+"') ORDER BY schedule_start_date ASC";
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
            const index=this.req.query.no;
            let month_schedules=[];
            let where="WHERE member_id=? AND schedule_no="+index;

            const date=moment((await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date);
            const previous=(date.clone().subtract(1, "months")).format("YYYY-MM");
            const next=(date.clone().add(1, "months")).format("YYYY-MM");
            const last_day=getDay(next.substring(0,4), next.substring(5,8));

            const res=await ScheduleStorage.removeSchedule(index);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+previous+"-01' AND '"+next+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
                
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
            const index=this.req.query.no;
            let month_schedules=[];
            let where="WHERE member_id=? AND schedule_no="+index;

            const date=moment((await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date);
            const previous=(date.clone().subtract(1, "months")).format("YYYY-MM");
            const next=(date.clone().add(1, "months")).format("YYYY-MM");
            const last_day=getDay(next.substring(0,4), next.substring(5,8));

            const res=await ScheduleStorage.modifySchedule(index, this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+previous+"-01' AND '"+next+"-"+last_day+"') ORDER BY schedule_start_date ASC";
                month_schedules=await ScheduleStorage.getSchedule(this.req.userId, where);
               
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