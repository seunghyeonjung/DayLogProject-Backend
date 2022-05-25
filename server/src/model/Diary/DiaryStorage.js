"use strict"

const db=require("../../config/db");


class DiaryStorage{
    static getDiary(id, where){
        return new Promise((resolve, reject)=>{
            const query="SELECT member_id, diary_no, diary_content as content, diary_date as date, diary_image as image, emotion, share_y_n as share, DATE_FORMAT(diary_date,'%Y-%m-%d') AS date, IF(share_y_n, 'true', 'false') as share FROM capstone_design.diary " + where;
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    static saveDiary(id, content, date, image, emotion, share){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.diary(member_id, diary_content, diary_date, diary_image, emotion, share_y_n) VALUES(?, ?, ?, ?, ?, ?)";
            db.query(query, [id, content, date, image, emotion, share] ,(err, data)=>{
                if(err) reject(err);
                else {
                    //기록하고 카운트하기 성공..... 
                console.log("-------------");
                const query4 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                db.query(query4, [id, 1]);
                console.log("-------------");
                const query5 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                db.query(query5, [id, 2]);
                console.log("-------------");
                const query6 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                db.query(query6, [id, 3]);
 
                    
                    resolve({success : true})};
            });
        });
    }

    static removeDiary(index){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capstone_design.diary WHERE diary_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyDiary(index, id, content, date, image, emotion, share){
        return new Promise((resolve, reject)=>{
            const query="UPDATE capstone_design.diary SET diary_content=?, diary_date=?, diary_image=?, emotion=?, share_y_n=? WHERE diary_no=?";
            db.query(query, [content, date, image, emotion, share, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyShare(change, index){
        return new Promise((resolve, reject)=>{
            const query="UPDATE capstone_design.diary SET share_y_n=? WHERE diary_no=?";
            db.query(query, [change, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }
}

module.exports=DiaryStorage;