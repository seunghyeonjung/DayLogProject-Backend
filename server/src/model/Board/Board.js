"use strict"

const BoardStorage=require("./BoardStorage");
const LikeStorage=require("./LikeStorage");
const ScrapStorage=require("./ScrapStorage");
const UserStorage=require("../User/UserStorage");
const { urlencoded } = require("body-parser");

class Board{
    constructor(req){
        this.req=req;
    }

    async getBoardLatest(){
        try{
            let where;
           
            where="ORDER BY board_post_date DESC";
            const latest_diary=await BoardStorage.getBoard(where);
            console.log(latest_diary);
            return latest_diary;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async getBoardHeart(){
        try{
            let where;
            
            where="ORDER BY board_like_count DESC";
            const heartest_diary=await BoardStorage.getBoard(where);
            return heartest_diary;

        }catch(err){
            return { success : false, message : err}
        }
    }
    
    async getBoard(){
        try{
            let where="WHERE board_writer=? AND board_no="+this.req.query.no;
        
            const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
            const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
            const writer_profile_url=null; //test 때만
            const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url};

            //console.log(diary_no, content, image_url, like_count, date, board_writer, writer_nickname, writer_profile_url, selected);
            return selected;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyLike(){
        try{
            const no=this.req.query.no;
            console.log(no);
            let where;
            let set;
            let is_shared;

            const is_scrap=await ScrapStorage.getScrap(no, this.req.userId);
            console.log(is_scrap);
            if(is_scrap.length!=0) is_shared=true;
            else is_shared=false;
        
            const res=await LikeStorage.getLike(no, this.req.userId);
            console.log(res);
            if(res.length!=0){
                const is_liked=false;
    
                set="board_like_count-1";
                await BoardStorage.modifyLike(set, no);
                await LikeStorage.removeLike(this.req.userId, no);

                where="WHERE board_writer=? AND board_no="+no;
                const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                const writer_profile_url=null; //test 때만

                const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                return selected;
                
            }
            else{
                const is_liked=true;

                set="board_like_count+1";
                await BoardStorage.modifyLike(set, no);
                await LikeStorage.saveLike(this.req.userId, no);

                where="WHERE board_writer=? AND board_no="+no;
                const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                const writer_profile_url=null; //test 때만

                const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                return selected;
            }

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyScrap(){
        try{
            const no=this.req.query.no;
            console.log(no);
            let where;
            let is_liked;

            const is_like=await LikeStorage.getLike(no, this.req.userId);
            console.log(is_like);
            if(is_like.length!=0) is_liked=true;
            else is_liked=false;
        
            const res=await ScrapStorage.getScrap(no, this.req.userId);
            console.log(res);
            if(res.length!=0){
                const is_shared=false;

                await ScrapStorage.removeScrap(this.req.userId, no);

                where="WHERE board_writer=? AND board_no="+no;
                const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                const writer_profile_url=null; //test 때만

                const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                return selected;
                
            }
            else{
                const is_shared=true;

                await ScrapStorage.saveScrap(this.req.userId, no);

                where="WHERE board_writer=? AND board_no="+no;
                const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                const writer_profile_url=null; //test 때만

                const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                return selected;
            }

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Board;