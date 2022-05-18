"use strict"

const db=require("../../config/db");


class ProfileStorage{
    static getProfile(id){
        return new Promise((resolve, reject)=>{
            console.log("프로필 조회 시작");
            const query="SELECT CONCAT('http://localhost:3001/images/', profile_src) as profile_src, member_id FROM capstone_design.profile WHERE member_id=?";
            console.log(query);
            db.query(query, [id], (err, data)=>{
                if(err) {
                    console.log("프로필 조회 실패", err);
                    reject(err);
                }
                else {
                    console.log("프로필 조회 성공");
                    resolve(data);
                }
            });
        });
    }

    static saveProfile(id, no){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.like(board_no, member_id) VALUES(?, ?)";
            db.query(query, [no, id] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("좋아요 저장 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static removeProfile(id, no){
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
}

module.exports=ProfileStorage;