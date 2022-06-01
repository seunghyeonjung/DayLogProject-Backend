"use strict"

const db=require("../../config/db");


class LikeStorage{
    static getLike(no, id){
        return new Promise((resolve, reject)=>{
            console.log("좋아요 조회 시작");
            const query="SELECT * FROM capstone_design.like WHERE board_no=? AND member_id=?";
            console.log(query);
            db.query(query, [no, id], (err, data)=>{
                if(err) {
                    console.log("조회 실패", err);
                    reject(err);
                }
                else {
                    console.log("조회 성공");
                    resolve(data);
                }
            });
        });
    }

    static saveLike(id, no){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.like(board_no, member_id) VALUES(?, ?)";
            db.query(query, [no, id] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("좋아요 저장 성공");
                    
                    //좋아요누르기 내가 누른거니까 id로 뱃지+1
                    const query10 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query10, [id, 10]);

                    db.query(`SELECT board_writer FROM capstone_design.board WHERE board_no=?`,[no], function(err, bw){

                        //좋아요받기 보드번호로 상대 id 찾아서 그 상대 뱃지 +1
                        const query11 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                        db.query(query11, [bw[0].board_writer, 11]);
                        const query12 = "UPDATE capstone_design.memberbadge SET goal_count = capstone_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                        db.query(query12, [bw[0].board_writer, 12]);
                       
                    })
                


                }
            });
        });
    }

    static removeLike(id, no){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capstone_design.like WHERE member_id=? AND board_no=?";
            db.query(query, [id, no] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("좋아요 삭제 성공");
                    resolve({success : true});
                }
            });
        });
    }
/*
    static maxLike(id){
        return new Promise((resolve, reject)=>{
            const query="SELECT MAX(borad_like_count) as like FROM capstone_design.board WHERE member_id=? ";
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("좋아요 많이받은 게시글");
                    resolve({success : true});
                }
            });
        });
    }
    */
}

module.exports=LikeStorage;