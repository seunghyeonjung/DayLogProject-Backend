"use strict"

const db=require("../../config/db");
const moment = require("moment");

class MenstruationStorage {

    //시작일 저장
    static saveStart(id, start){
        return new Promise((resolve, reject)=>{
            //console.log(id, start);
            //시작날짜 넣기
            const query1="INSERT INTO asas.menstruationcycle(member_id, cycle_start_date) VALUES(?,?)";
            db.query(query1, [id, start] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        })
    }


    //주기 가져오는 쿼리
    static getCycle(id){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT menstruation_cycle as cycle FROM asas.member WHERE member_id=?`,[id], function(err, oldcycle){
                
                if(err) reject(err);
                    else {
                        console.log("데이터", oldcycle[0].cycle);
                        resolve(oldcycle);
                        
                    };
            })
        
        })
    }

    //최신 시작일(이번달) 가져오는 쿼리 
    static getStart(id){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT type, DATE_FORMAT(cycle_start_date ,'%Y-%m-%d') as date 
                        FROM asas.menstruationcycle 
                        WHERE member_id=? 
                        order by cycle_start_date desc 
                        Limit 1`,[id], function(err, start){
                if(err) reject(err);
                    else {
                        resolve(start)};
            })
        })
    }

        //시작일 가져오는 쿼리
    static getAllStart(id){
            return new Promise((resolve, reject)=>{
                db.query(`SELECT type, DATE_FORMAT(cycle_start_date ,'%Y-%m-%d') as date
                            FROM asas.menstruationcycle 
                            WHERE member_id=? 
                            order by cycle_start_date desc`
                            ,[id], function(err, start){

                    if(err) reject(err);
                        else resolve(start);
                })
            })
        }
    
    



    //주기 저장
    static saveCycle(id, cycle){
        return new Promise((resolve, reject)=>{
            //기존 주기 값 oldcycle 가져오는 쿼리문
            db.query(`SELECT menstruation_cycle FROM asas.member WHERE member_id=?`,[id], function(err, oldcycle){
                console.log(oldcycle);

                //바꿔넣는쿼리문
                    const query2="UPDATE asas.member SET menstruation_cycle=? WHERE member_id=?";   
                    if(oldcycle === cycle || !cycle)
                        return oldcycle; //기존 주기와 같으면 넘어가고
                    else ( //다르면 바꿔 넣는 쿼리문
                     db.query(query2, [cycle, id], (err, data)=>{
                            if(err) reject(err);
                            else resolve({success : true});
                        })
                    );
    
            });
        })
    }
    /*
    //시작일 + 예정일 가져오기
    static getStart(){
        let month_menstruations=[];
        const month =  Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
        let last_day=getDay(this.req.query.year, month);
    }
    */
}

module.exports=MenstruationStorage;