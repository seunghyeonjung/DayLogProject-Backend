"use strict"

const BoardStorage=require("./BoardStorage");
const DiaryStorage=require("../Diary/DiaryStorage");
const LikeStorage=require("./LikeStorage");
const ScrapStorage=require("./ScrapStorage");
const UserStorage=require("../User/UserStorage");
const ProfileStorage=require("../User/ProfileStorage");
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
            let is_shared;
            let is_liked;
        
            const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
            const writer_nickname=(await UserStorage.getUserInfo(writer_id)).nickname;
            const writer_profile_url=(await ProfileStorage.getProfile(writer_id))[0].profile_src; //test 때만

            where="WHERE board_no=? AND member_id=?"
            const is_scrap=await ScrapStorage.getScrap(this.req.query.no, this.req.userId, where);
            console.log(is_scrap);
            if(is_scrap.length!=0) is_shared=true;
            else is_shared=false;

            const is_like=await LikeStorage.getLike(this.req.query.no, this.req.userId);
            console.log(is_like);
            if(is_like.length!=0) is_liked=true;
            else is_liked=false;

            const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};
            //console.log(diary_no, content, image_url, like_count, date, board_writer, writer_nickname, writer_profile_url, selected);
            return selected;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async getSecret(){
        try{
            let where="WHERE member_id=? AND share_y_n=0";
        
            const secret_diary=await DiaryStorage.getDiary(this.req.userId, where);
            const nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
            const profile_url=(await ProfileStorage.getProfile(this.req.userId))[0].profile_src; //test 때만

            return {nickname, profile_url, secret_diary};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async getShare(){
        try{
            let where="WHERE member_id=? AND share_y_n=1";
        
            const share_diary=await DiaryStorage.getDiary(this.req.userId, where);
            const nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
            const profile_url=(await ProfileStorage.getProfile(this.req.userId))[0].profile_src; //test 때만

            console.log("리턴")
            return {nickname, profile_url, share_diary};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async getScrap(){
        try{
            let where;
            let scrap_diary=[];
        
            where="WHERE member_id="+"'"+this.req.userId+"'";
            let board_no=await ScrapStorage.getScrap(0, "", where);
            console.log(board_no);

            for(let i=0; i<board_no.length; i++){
                console.log(i);
                where="WHERE board_no="+board_no[i].board_no;
                const diary_no=(await BoardStorage.getBoard(where, ""))[0].diary_no;
                console.log(diary_no);
                where="WHERE member_id=? AND diary_no="+diary_no;
                const diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];
                console.log(diary);
                scrap_diary.push(diary);
            }

            console.log(scrap_diary);

            const nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
            const profile_url=(await ProfileStorage.getProfile(this.req.userId))[0].profile_src; //test 때만

            //console.log(diary_no, content, image_url, like_count, date, board_writer, writer_nickname, writer_profile_url, selected);
            return {nickname, profile_url, scrap_diary};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async getProfile(){
        try{
            let where;
            console.log(this.req.query.member_id);
            where="WHERE board_writer=? ORDER BY board_post_date DESC";
            const share_diary=await BoardStorage.getBoard(where, this.req.query.member_id);
            console.log(share_diary);
            const writer_nickname=(await UserStorage.getUserInfo(this.req.query.member_id)).nickname;
            console.log(writer_nickname);
            const writer_profile_url=(await ProfileStorage.getProfile(this.req.query.member_id))[0].profile_src; //test 때만
            console.log(writer_profile_url);
            return {writer_nickname, writer_profile_url, share_diary};

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

            where="WHERE board_no=? AND member_id=?"
            const is_scrap=await ScrapStorage.getScrap(no, this.req.userId, where);
            console.log(is_scrap);
            if(is_scrap.length!=0) is_shared=true;
            else is_shared=false;
        
            const res=await LikeStorage.getLike(no, this.req.userId);
            console.log(res);
            if(res.length!=0){
                const is_liked=false;
    
                set="board_like_count-1";
                await BoardStorage.modifyLike(set, no);
                const mes=await LikeStorage.removeLike(this.req.userId, no);

                if(mes.success==true){
                    where="WHERE board_writer=? AND board_no="+no;
                    const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                    const writer_nickname=(await UserStorage.getUserInfo(writer_id)).nickname;
                    const writer_profile_url=(await ProfileStorage.getProfile(writer_id))[0].profile_src; //test 때만

                    const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                    return {selected, success:true};
                }
                else return {success:false};
            }
            else{
                const is_liked=true;

                set="board_like_count+1";
                await BoardStorage.modifyLike(set, no);
                const mes=await LikeStorage.saveLike(this.req.userId, no);

                if(mes.success==true){
                    where="WHERE board_writer=? AND board_no="+no;
                    const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                    const writer_nickname=(await UserStorage.getUserInfo(writer_id)).nickname;
                    const writer_profile_url=(await ProfileStorage.getProfile(writer_id))[0].profile_src; //test 때만

                    const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                    return {selected, success:true};
                }
                else return {success:false};
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
        
            where="WHERE board_no=? AND member_id=?"
            const res=await ScrapStorage.getScrap(no, this.req.userId, where);
            console.log(res);
            if(res.length!=0){
                const is_shared=false;

                const mes=await ScrapStorage.removeScrap(this.req.userId, no);

                if(mes.success==true){
                    where="WHERE board_writer=? AND board_no="+no;
                    const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                    const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                    const writer_profile_url=(await ProfileStorage.getProfile(this.req.userId))[0].profile_src; //test 때만

                    const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                    return {selected, success:true};
                }
                else return {success:false};
                
            }
            else{
                const is_shared=true;

                const mes=await ScrapStorage.saveScrap(this.req.userId, no);

                if(mes.success==true){
                    where="WHERE board_writer=? AND board_no="+no;
                    const {diary_no, content, image_url, like_count, date, writer_id}=(await BoardStorage.getBoard(where, this.req.userId))[0];
                    const writer_nickname=(await UserStorage.getUserInfo(this.req.userId)).nickname;
                    const writer_profile_url=(await ProfileStorage.getProfile(this.req.userId))[0].profile_src; //test 때만

                    const selected={diary_no, content, image_url, like_count, date, writer_id, writer_nickname, writer_profile_url, is_liked, is_shared};

                    return {selected, success:true};
                }
                else return {success:false};
            }

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Board;