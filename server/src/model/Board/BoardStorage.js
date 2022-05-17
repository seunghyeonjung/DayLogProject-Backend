"use strict"

const db=require("../../config/db");


class BoardStorage{
    static getBoard(where, id){
        return new Promise((resolve, reject)=>{
            console.log("조회 시작")
            const query="SELECT board_no as diary_no, board_content as content, board_image as image_url, board_like_count as like_count, board_post_date as date, diary_no, board_writer as writer_id, DATE_FORMAT(board_post_date,'%Y-%m-%d') AS date FROM capstone_design.board " + where;
            console.log(query);
            db.query(query ,[id], (err, data)=>{
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

    static saveBoard(id, no, content, date, image, like){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.board(board_writer, diary_no, board_content, board_post_date, board_image, board_like_count) VALUES(?, ?, ?, ?, ?, ?)";
            db.query(query, [id, no, content, date, image, like] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("게시물 저장 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static removeBoard(index){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capstone_design.board WHERE diary_no=?";
            db.query(query, [index] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("게시물 삭제 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static modifyLike(set, no){
        return new Promise((resolve, reject)=>{
            const query="UPDATE capstone_design.board SET board_like_count="+set+" WHERE board_no=?";
            db.query(query, [no] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }
}

module.exports=BoardStorage;