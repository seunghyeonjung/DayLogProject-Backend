"use strict"

const db=require("../../config/db");
const moment = require("moment");

class QAStorage {

    //qa 저장
    static saveQA(id, date, index){
        return new Promise((resolve, reject)=>{
            //console.log(id, start);
            //시작날짜 넣기
            const query1="INSERT INTO capstone_design.qa(member_id, qa_date, qa_choice) VALUES(?,?,?)";
            db.query(query1, [id, date, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        })
    }

    static getQA(id, where){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT qa_choice, DATE_FORMAT(qa_date,'%Y-%m-%d') as qa_date FROM capstone_design.qa WHERE member_id=? `+where,[id], function(err, qalist){
                
                if(err) reject(err);
                    else {
                        resolve(qalist);
                    };
            });
        
        });
    }




}

module.exports=QAStorage;