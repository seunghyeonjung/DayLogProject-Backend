"use strict"

const db=require("../../config/db");


class DiaryStorage{
    static getDiary(id, where){
        return new Promise((resolve, reject)=>{
            const query="SELECT member_id, diary_no, diary_content as content, diary_date as date, CONCAT('http://localhost:3001/images/', diary_image) as image_url, emotion, share_y_n as shared, like_count, DATE_FORMAT(diary_date,'%Y-%m-%d') AS date, IF(share_y_n, 'true', 'false') as shared FROM asas.diary " + where;
            console.log(query);
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    static saveDiary(id, content, date, emotion, share, image){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO asas.diary(member_id, diary_content, diary_date, emotion, share_y_n, diary_image) VALUES(?, ?, ?, ?, ?, ?)";
            db.query(query, [id, content, date, emotion, share, image] ,(err, data)=>{
                if(err) reject(err);
                else {
                    //기록하고 카운트하기 성공..... 
                    const query4 = "UPDATE asas.memberbadge SET goal_count = asas.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query4, [id, 1]);

                    const query5 = "UPDATE asas.memberbadge SET goal_count = asas.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query5, [id, 2]);

                    const query6 = "UPDATE asas.memberbadge SET goal_count = asas.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query6, [id, 3]);

                    resolve({success : true});
                }
            });
        });
    }

    static saveImage(id, image, no){
        return new Promise((resolve, reject)=>{
            //const query1="SELECT diary_no FROM asas.diary  where member_id=?"
            const query="UPDATE asas.diary SET diary_image=? WHERE member_id=? and diary_no=?";
            db.query(query, [image, id, no] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static removeDiary(index){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM asas.diary WHERE diary_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyDiary(index, id, content, date, emotion, share){
        return new Promise((resolve, reject)=>{
            const query="UPDATE asas.diary SET diary_content=?, diary_date=?, emotion=?, share_y_n=? WHERE member_id=? AND diary_no=?";
            db.query(query, [content, date, emotion, share, id, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyShare(change, index){
        return new Promise((resolve, reject)=>{
            const query="UPDATE asas.diary SET share_y_n=? WHERE diary_no=?";
            db.query(query, [change, index] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static modifyLike(like, index){
        return new Promise((resolve, reject)=>{
            const query="UPDATE asas.diary SET like_count=? WHERE diary_no=?";
            db.query(query, [like, index] ,(err)=>{
                if(err) reject(err);
                else {
                    console.log("좋아요 수정 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static getall(id){
        return new Promise((resolve, reject)=>{
            const query="SELECT emotion FROM asas.diary WHERE member_id=?";
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    
    static savebadge15(id){
        return new Promise((resolve, reject)=>{

            const query15 = "UPDATE asas.memberbadge SET goal_count = asas.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
            db.query(query15, [id, 15] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }
}

module.exports=DiaryStorage;