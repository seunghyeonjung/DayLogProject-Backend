"use strict"

const db=require("../../config/db");


class ProfileStorage{
    static getProfile(id){
        return new Promise((resolve, reject)=>{
            console.log("프로필 조회 시작");
            const query="SELECT if(isnull(profile_src), null, CONCAT('http://localhost:3001/profiles/', profile_src)) as profile_src, member_id FROM capston_design.profile WHERE member_id=?";
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

    static saveProfile(id, profile){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capston_design.profile(member_id, profile_src) VALUES(?, ?)";
            db.query(query, [id, profile] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("프로필 저장 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static modifyProfile(id, profile){
        return new Promise((resolve, reject)=>{
            const query="UPDATE capston_design.profile SET profile_src=? WHERE member_id=?";
            db.query(query, [profile, id] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("프로필 변경 성공");
                    resolve({success : true});
                }
            });
        });
    }


    static removeProfile(id, no){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capston_design.like WHERE member_id=? AND board_no=?";
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