"use strict"

const db=require("../../config/db");
const moment = require("moment");

class QAStorage {

    //qa 저장
    static saveQA(id, date, index){
        return new Promise((resolve, reject)=>{
            console.log(id, date, index);
            //시작날짜 넣기
            const query1="INSERT INTO capstone_design.qa(member_id, qa_date, qa_choice) VALUES(?,?,?)";
            db.query(query1, [id, date, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        })
    }

    static getQA(id){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT qa_date as date, qa_choice as choice
                        FROM capstone_design.qa 
                        WHERE member_id=? 
                        AND (qa_date between date_add(NOW(), INTERVAL -1 MONTH) AND NOW());`,[id], function(err, qalist){

                
                if(err) reject(err);
                    else {
                        resolve(qalist);
                    };
            });
        
        });
    }




}

module.exports=QAStorage;