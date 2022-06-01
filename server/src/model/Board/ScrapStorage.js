"use strict"

const db=require("../../config/db");


class ScrapStorage{
    static getScrap(no, id, where){
        return new Promise((resolve, reject)=>{
            console.log("스크랩 조회 시작")
            const query="SELECT * FROM capston_design.scrap "+where;
            console.log(query);
            db.query(query ,[no, id], (err, data)=>{
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

    static saveScrap(id, no){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capston_design.scrap(board_no, member_id) VALUES(?, ?)";
            db.query(query, [no, id] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("스크랩 저장 성공");
                    //스크랩하기
                    const query13 = "UPDATE capston_design.memberbadge SET goal_count = capston_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query13, [id, 13]);
                    const query14 = "UPDATE capston_design.memberbadge SET goal_count = capston_design.memberbadge.goal_count + 1 WHERE member_id=? and badge_no=? ";
                    db.query(query14, [id, 14]);


                    resolve({success : true});
                }
            });
        });
    }

    static removeScrap(id, no){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capston_design.scrap WHERE member_id=? AND board_no=?";
            db.query(query, [id, no] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("스크랩 삭제 성공");
                    resolve({success : true});
                }
            });
        });
    }
}

module.exports=ScrapStorage;