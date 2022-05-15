"use strict"

const db=require("../../config/db");


class BoardStorage{
    static getBoard(where){
        return new Promise((resolve, reject)=>{
            console.log("최신순 조회 시작")
            const query="SELECT board_no as diary_no, board_content as content, board_image as image_url, board_like_count as like_count, board_post_date as date, diary_no, board_writer, DATE_FORMAT(board_post_date,'%Y-%m-%d') AS date FROM capstone_design.board " + where;
            console.log(query);
            db.query(query ,(err, data)=>{
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

    static saveBoard(id, no, content, date, image){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.board(board_writer, diary_no, board_content, board_post_date, board_image) VALUES(?, ?, ?, ?, ?)";
            db.query(query, [id, no, content, date, image] ,(err, data)=>{
                if(err) reject(err);
                else {
                    console.log("게시물 저장 성공");
                    resolve({success : true});
                }
            });
        });
    }

    static saveImage(id, image, no){
        return new Promise((resolve, reject)=>{
            //const query1="SELECT diary_no FROM capstone_design.diary  where member_id=?"
            const query="UPDATE capstone_design.diary SET diary_image=? WHERE member_id=? and diary_no=?";
            db.query(query, [image, id, no] ,(err, data)=>{
                if(err) reject(err);
                else resolve({success : true});
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

module.exports=BoardStorage;