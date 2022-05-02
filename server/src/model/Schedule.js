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
            let p_month, p_year, n_month, n_year;
            let last_day;
            //const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            console.log(this.req.query.year, this.req.query.month);

            if(this.req.query.month==12) {
                p_month=Number(this.req.query.month-1);
                p_year=this.req.query.year
                n_month='01';
                n_year=Number(this.req.query.year)+1;
                p_month = p_month < 10 ? '0'+p_month : p_month;
                last_day=getDay(n_year, String(n_month));
            }
            else if(this.req.query.month==1){
                p_month='12';
                p_year=Number(this.req.query.year)-1;
                n_month=Number(this.req.query.month)+1;
                n_year=this.req.query.year;
                n_month = n_month < 10 ? '0'+n_month : n_month;
                last_day=getDay(n_year, String(n_month));
            }    
            else{
                p_month=Number(this.req.query.month-1);
                p_year=this.req.query.year;
                n_month=Number(this.req.query.month)+1;
                n_year=this.req.query.year;
                p_month = p_month < 10 ? '0'+p_month : p_month;
                n_month = n_month < 10 ? '0'+n_month : n_month;
                last_day=getDay(n_year, String(n_month));
                
            }

            
            console.log(p_month, p_year, n_month, n_year, last_day);
            //console.log(this.req.userId+", "+this.req.query.date);
            //console.log(this.req.userId+", "+this.req.query.month);
            
            where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+p_year+"-"+p_month+"-01' AND '"+n_year+"-"+n_month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
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
            let p_month, p_year, n_month, n_year;
            let last_day;
            const date=this.req.body.start_date;
            let year=date.substr(0,4);
            let month=date.substr(5,2);
            year=Number(year);
            month=Number(month);

            if(month==12) {
                p_month=month-1;
                p_year=year
                n_month='01';
                n_year=year+1;
                //p_month = p_month < 10 ? '0'+p_month : p_month;
                last_day=getDay(n_year, String(n_month));
            }
            else if(month==1){
                p_month='12';
                p_year=year-1;
                n_month=month+1;
                n_year=year;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                last_day=getDay(n_year, 0+String(n_month));
            }    
            else{
                p_month=month-1;
                p_year=year;
                n_month=month+1;
                n_year=year;
               // p_month = p_month < 10 ? '0'+p_month : p_month;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                if(n_month<10) last_day=getDay(n_year, 0+String(n_month));
                else last_day=getDay(n_year, String(n_month));
            }
            console.log(p_month, p_year, n_month, n_year, last_day);

            const res=await ScheduleStorage.saveSchedule(this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);
            //반환값으로 수정한 달의 schedule 다 보냄
            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+p_year+"-"+p_month+"-01' AND '"+n_year+"-"+n_month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
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
            let p_month, p_year, n_month, n_year;
            let last_day;
            let where="WHERE member_id=? AND schedule_no="+index;
            const date=(await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date;
            console.log(date);
            let year=date.substr(0,4);
            let month=date.substr(5,2);
            year=Number(year);
            month=Number(month);

            if(month==12) {
                p_month=month-1;
                p_year=year
                n_month='01';
                n_year=year+1;
                //p_month = p_month < 10 ? '0'+p_month : p_month;
                last_day=getDay(n_year, String(n_month));
            }
            else if(month==1){
                p_month='12';
                p_year=year-1;
                n_month=month+1;
                n_year=year;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                last_day=getDay(n_year, 0+String(n_month));
            }    
            else{
                p_month=month-1;
                p_year=year;
                n_month=month+1;
                n_year=year;
               // p_month = p_month < 10 ? '0'+p_month : p_month;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                if(n_month<10) last_day=getDay(n_year, 0+String(n_month));
                else last_day=getDay(n_year, String(n_month));
            }
            console.log(p_month, p_year, n_month, n_year, last_day);

            const res=await ScheduleStorage.removeSchedule(index);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+p_year+"-"+p_month+"-01' AND '"+n_year+"-"+n_month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
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
            let p_month, p_year, n_month, n_year;
            let last_day;
            let where="WHERE member_id=? AND schedule_no="+index;
            const date=(await ScheduleStorage.getSchedule(this.req.userId, where))[0].start_date;
            console.log(date);
            let year=date.substr(0,4);
            let month=date.substr(5,2);
            year=Number(year);
            month=Number(month);

            if(month==12) {
                p_month=month-1;
                p_year=year
                n_month='01';
                n_year=year+1;
                //p_month = p_month < 10 ? '0'+p_month : p_month;
                last_day=getDay(n_year, String(n_month));
            }
            else if(month==1){
                p_month='12';
                p_year=year-1;
                n_month=month+1;
                n_year=year;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                last_day=getDay(n_year, 0+String(n_month));
            }    
            else{
                p_month=month-1;
                p_year=year;
                n_month=month+1;
                n_year=year;
               // p_month = p_month < 10 ? '0'+p_month : p_month;
                //n_month = n_month < 10 ? '0'+n_month : n_month;
                if(n_month<10) last_day=getDay(n_year, 0+String(n_month));
                else last_day=getDay(n_year, String(n_month));
            }
            console.log(p_month, p_year, n_month, n_year, last_day);

            const res=await ScheduleStorage.modifySchedule(index, this.req.userId, this.req.body.title, this.req.body.content, this.req.body.start_date, this.req.body.end_date);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(schedule_start_date) BETWEEN '"+p_year+"-"+p_month+"-01' AND '"+n_year+"-"+n_month+"-"+last_day+"') ORDER BY schedule_start_date ASC";
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