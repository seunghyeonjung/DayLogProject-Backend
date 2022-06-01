"use strict"

const db=require("../../config/db");


class BadgeStorage {

    //뱃지 조회 정보 출력
    static getBadge(id){
        return new Promise((resolve, reject)=>{
            db.query(`SELECT badge_no, goal_count, challenge_y_n as challenge FROM asas.memberbadge WHERE member_id=?`,[id], function(err, badgelist){
                
                if(err) reject(err);
                    else {
                        resolve(badgelist);
                    };
            });
        
        });
    }

    //회원가입시 회원의 뱃지 리스트 만들기
    static numBadge(num, id){
        const query="INSERT INTO asas.memberbadge(badge_no, member_id) VALUES(?,?)";
        db.query(query, [num, id]), (err)=>{
            console.log(num, id);
            if(err) reject(err);
            else resolve({success : true});    
        }
    }


    static modifyBadge(id, new_badge_no, old_badge_no){ //챌린지에는 yes가 담겨오기? default no 설정?
        return new Promise((resolve, reject)=>{

            const query="UPDATE asas.memberbadge SET challenge_y_n='false' WHERE member_id=? and badge_no=?"; 
            db.query(query, [id, old_badge_no], (err, data)=>{ 

                if(err) reject(err); 
                else {
                    const query2="UPDATE asas.memberbadge SET challenge_y_n='true' WHERE member_id=? and badge_no=?"; 
                    db.query(query2, [id, new_badge_no], (err, data)=>{ //아이디와 해당하는 뱃지넘버의 도전여부를 바꾼다

                        
                        if(err) reject(err); 
                        else resolve({success : true});
                    })
                }
            })

        })
    }


}


module.exports=BadgeStorage;