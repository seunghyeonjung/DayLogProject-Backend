"use strict"

const DiaryStorage=require("./DiaryStorage");
//const moment=require('moment');
//const { KEYBCS2_BIN } = require("mysql/lib/protocol/constants/charsets");

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

class Diary{
    constructor(req){
        this.req=req;
    }

    async getDiary(){
        try{
            let where;
            const year=this.req.query.year;
            const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            const last_day=getDay(year,month);
            let month_diary=[];
            let current_diary=[];
            console.log(Object.keys(this.req.query));
            if(Object.keys(this.req.query)=="no"){
                where="WHERE member_id=? AND diary_no="+this.req.query.no;
                const res=await DiaryStorage.getDiary(this.req.userId, where);
                return res;
            }
            else{
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await DiaryStorage.getDiary(this.req.userId, where);

                //console.log("diary : ",month_diary);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);

                //console.log("current diary : ",current_diary);

                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", month_diary, current_diary};

            }

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveDiary(){
        try{
            let where;
            let image;
            let month_diary=[];
            let current_diary=[];
            const year=(this.req.body.date).substring(0,4);
            const month=(this.req.body.date).substring(5,7);
            const last_day=getDay(year, month)

            console.log(year, month, last_day);

            
            if(this.req.body.image) image=this.req.body.image;
            else image=null;

            console.log("Diary : "+this.req.userId, this.req.body.content, this.req.body.date, image, this.req.body.emotion, this.req.body.share)

            const res=await DiaryStorage.saveDiary(this.req.userId, this.req.body.content, this.req.body.date, image, this.req.body.emotion, this.req.body.share);
            
            if(res.success==true){
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                return {month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeDiary(){
        try{
            const index=this.req.query.no;
            let month_diary=[];
            let current_diary=[];
            let where="WHERE member_id=? AND diary_no="+index;
            const date=(await DiaryStorage.getDiary(this.req.userId, where))[0].date;
            const year=date.substring(0,4);
            const month=date.substring(5,7);
            const last_day=getDay(year, month);

            console.log(year, month, last_day);

            const res=await DiaryStorage.removeDiary(index);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyDiary(){
        try{
            const index=this.req.query.no;
            let month_diary=[];
            let current_diary=[];
            let where="WHERE member_id=? AND diary_no="+index;
            const date=(await DiaryStorage.getDiary(this.req.userId, where))[0].date;
            const year=date.substring(0,4);
            const month=date.substring(5,7);
            const last_day=getDay(year, month);

            const res=await DiaryStorage.modifyDiary(index, this.req.userId, this.req.body.content, this.req.body.date, this.req.body.image, this.req.body.emotion, this.req.body.share);

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyShare(){
        try{
            const index=this.req.query.no;
            let change;
            let res;
            let month_diary=[];
            let current_diary=[];
            let where="WHERE member_id=? AND diary_no="+index;
            const date=(await DiaryStorage.getDiary(this.req.userId, where))[0].date;
            const share=(await DiaryStorage.getDiary(this.req.userId, where))[0].share;
            const year=date.substring(0,4);
            const month=date.substring(5,7);
            const last_day=getDay(year, month);

            if(share==="false"){
                change=1;
                res=await DiaryStorage.modifyShare(change, index);
            }
            else{
                change=0;
                res=await DiaryStorage.modifyShare(change, index);
            }

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Diary;