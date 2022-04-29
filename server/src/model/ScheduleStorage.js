"use strict"

const db=require("../config/db");


class ScheduleStorage{
    static getSchedule(id, where){
        return new Promise((resolve, reject)=>{
            console.log(where);
            const query="SELECT *, DATE_FORMAT(schedule_start_date,'%Y-%m-%d') AS schedule_start_date, DATE_FORMAT(schedule_end_date,'%Y-%m-%d') AS schedule_end_date FROM capstone_design.schedule " + where;
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    static saveSchedule(id, title, content, start_date, end_date){
        return new Promise((resolve, reject)=>{
            console.log(id+", "+title+", "+content+", "+start_date+", "+end_date);
            const query="INSERT INTO capstone_design.schedule(member_id, schedule_title, schedule_content, schedule_start_date, schedule_end_date) VALUES(?, ?, ?, ?, ?)";
            db.query(query, [id, title, content, start_date, end_date] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static removeSchedule(index){
        return new Promise((resolve, reject)=>{
            console.log(index);
            const query="DELETE FROM capstone_design.schedule WHERE schedule_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifySchedule(index, id, title, content, start_date, end_date){
        return new Promise((resolve, reject)=>{
            console.log(index+", "+id+", "+title+", "+content+", "+start_date+", "+end_date);
            const query="UPDATE capstone_design.schedule SET schedule_no=?, member_id=?, schedule_title=?, schedule_content=?, schedule_start_date=?, schedule_end_date=? WHERE schedule_no=?";
            db.query(query, [index, id, title, content, start_date, end_date, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }
}

module.exports=ScheduleStorage;