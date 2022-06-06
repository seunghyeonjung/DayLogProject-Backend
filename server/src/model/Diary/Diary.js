"use strict"

const DiaryStorage=require("./DiaryStorage");
const BoardStorage=require("../Board/BoardStorage");
const fs=require("fs");

//하트7개확인하기위한 뱃지스토리지
const BadgeStorage=require("../Badge/BadgeStorage");

//const moment=require('moment');
//const { KEYBCS2_BIN } = require("mysql/lib/protocol/constants/charsets");

function getDay(year,month){
    let last_day;

    switch(month){
        case "01" : last_day=new Date(year, 1, 0).getDate(); 
        break;
        case "02" : last_day=new Date(year, 2, 0).getDate(); 
        break;
        case "03" : last_day=new Date(year, 3, 0).getDate(); 
        break;
        case "04" : last_day=new Date(year, 4, 0).getDate(); 
        break;
        case "05" : last_day=new Date(year, 5, 0).getDate(); 
        break;
        case "06" : last_day=new Date(year, 6, 0).getDate(); 
        break;
        case "07" : last_day=new Date(year, 7, 0).getDate(); 
        break;
        case "08" : last_day=new Date(year, 8, 0).getDate(); 
        break;
        case "09" : last_day=new Date(year, 9, 0).getDate(); 
        break;
        case "10" : last_day=new Date(year, 10, 0).getDate(); 
        break;
        case "11" : last_day=new Date(year, 11, 0).getDate(); 
        break;
        case "12" : last_day=new Date(year, 0, 0).getDate(); 
        break;
    }

    return last_day;
};

class Diary{
    constructor(req){
        this.req=req;
    }

    async getDiary(){
        try{
            let where;
            const year=this.req.query.year;
            const month = Number(this.req.query.month) < 10 ? '0'+this.req.query.month : this.req.query.month;
            const last_day=getDay(year,month);
            let month_diary=[];
            let current_diary=[];
            console.log(Object.keys(this.req.query));
            if(Object.keys(this.req.query)=="no"){
                where="WHERE member_id=? AND diary_no="+this.req.query.no;
                const res=await DiaryStorage.getDiary(this.req.userId, where);
                return res[0];
            }
            else{
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await DiaryStorage.getDiary(this.req.userId, where);

                //console.log("diary : ",month_diary);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);

                console.log(month_diary.length, current_diary.length);

                if(month_diary.length==0 && current_diary.length==0) return {message : "EMPTY"};
                else if(month_diary.length!=0 && current_diary.length==0) return {message : "FILL", month_diary, current_diary : null};
                else if(month_diary.length==0 && current_diary.length!=0) return {message : "FILL", month_diary : null, current_diary};
                else return {message : "FILL", month_diary, current_diary};

            }

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveDiary(){
        try{
            let where;
            let image=null;
            let month_diary=[];
            let current_diary=[];
            const year=(this.req.body.date).substring(0,4);
            const month=(this.req.body.date).substring(5,7);
            const last_day=getDay(year, month)

            console.log(year, month, last_day);
            console.log("Diary : "+this.req.userId, this.req.body.content, this.req.body.date, this.req.body.emotion, this.req.body.share, image);

            where="WHERE member_id=? AND diary_date="+"'"+this.req.body.date+"'";
            const exist=(await DiaryStorage.getDiary(this.req.userId, where))[0];
            console.log(exist)
            if(exist!=undefined) return {success : false, status : 401};

            const res=await DiaryStorage.saveDiary(this.req.userId, this.req.body.content, this.req.body.date, this.req.body.emotion, this.req.body.share, image);

            where="WHERE member_id=? ORDER BY diary_no DESC limit 0,1";
            const result=await DiaryStorage.getDiary(this.req.userId, where);
            const no=result[0].diary_no;
            console.log(result, no);

            //다이어리 하트 7개되는지 확인하는 코드
            //뱃지달성했다면 넘어가도록 짜야함
            const condition = await BadgeStorage.getBadge(this.req.userId);
            const all_emotion = await DiaryStorage.getall(this.req.userId);
            if(condition[14].goal_count === 0){
                let red=0;
                let orange=0;
                let yel=0;
                let gre=0;
                let blue=0;
                let nav=0;
                let pup=0;
                for(let i = 0 ; i< all_emotion.length ; i++){
                    if(all_emotion[i].emotion===1){
                       red++;
                    }
                    if(all_emotion[i].emotion===2){
                        orange++;
                    }
                    if(all_emotion[i].emotion===3){
                       yel++;
                    }
                    if(all_emotion[i].emotion===4){
                       gre++;
                    }
                    if(all_emotion[i].emotion===5){
                        blue++;
                    }
                    if(all_emotion[i].emotion===6){
                        nav++;
                    }
                    if(all_emotion[i].emotion===7){
                        pup++;
                    }
                }

                if(red===0 || orange===0 || yel===0 || gre===0|| blue===0|| nav===0|| pup===0){
                    //하나라도 사용한적없다면 넘어가기
                }
                else{
                    const save15 = await DiaryStorage.savebadge15(this.req.userId);
                }
            }
            
            if(res.success==true){
                if(this.req.body.share===true){
                    console.log("추가");
                    const like=0;
                    await BoardStorage.saveBoard(this.req.userId, no, this.req.body.content, this.req.body.date, image, like);
                }

                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                return {success : true, month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async saveImage(){
        try{
            let where="WHERE member_id=? ORDER BY diary_no DESC limit 0,1";
            const no=(await DiaryStorage.getDiary(this.req.userId, where))[0].diary_no;
            console.log(no);
            const res=await DiaryStorage.saveImage(this.req.userId, this.req.file.filename, no);

            if(res.success==true){
                const diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];
                const share=diary.shared;
                console.log("save board image",diary, share);
                if(share=="true"){
                    const image=diary.image_url;
                    console.log("save board image",image);

                    await BoardStorage.modifyImage(image, no);
                }
                
            }
            console.log(res);
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyImage(){
        try{
            let res;
            let where="WHERE member_id=? AND diary_no="+this.req.query.no;
            const diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];
            console.log(diary);
            console.log(diary.image_url);

            if(diary.image_url==null){
                res=await DiaryStorage.saveImage(this.req.userId, this.req.file.filename, this.req.query.no);
                console.log("수정 이미지 저장하기")
            }

            else{
                const image=diary.image_url.split(":3001")[1];
                
                if(fs.existsSync("./src/databases"+image)){
                    try{
                        fs.unlinkSync("./src/databases"+image);
                        console.log("일기 이미지 삭제");
                    }
                    catch(err){
                        console.log(err)
                    }
                }

                res=await DiaryStorage.saveImage(this.req.userId, this.req.file.filename, this.req.query.no);
            }

            if(res.success==true) return {success : true};
            else return {success : false};

        }catch(err){
            return { success : false, message : err}
        }
    }

    async removeDiary(){//삭제 시 이미지도
        try{
            const index=this.req.query.no;
            let month_diary=[];
            let current_diary=[];
            let diary_url=null;
            let where="WHERE member_id=? AND diary_no="+index;
            const diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];
            console.log("다이어리", diary, diary.image_url);
            if(diary.image_url!=null) diary_url=diary.image_url.split(":3001")[1];
            
            const date=diary.date;
            const year=date.substring(0,4);
            const month=date.substring(5,7);
            const last_day=getDay(year, month);

            console.log(year, month, last_day);

            const res=await DiaryStorage.removeDiary(index);

            if(fs.existsSync("./src/databases"+diary_url)){
                try{
                    fs.unlinkSync("./src/databases"+diary_url);
                    console.log("이미지 삭제");
                }
                catch(err){
                    console.log(err)
                }
            }

            if(res.success==true){
                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyDiary(){//프로필 변경이랑 동일하게
        try{
            const index=this.req.query.no;
            let where="WHERE member_id=? AND diary_no="+index;
            const diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];
            //const date=diary.date;
            const last_share=diary.shared;
            //const year=date.substring(0,4);
            //const month=date.substring(5,7);
            //const last_day=getDay(year, month);

            const res=await DiaryStorage.modifyDiary(index, this.req.userId, this.req.body.content, this.req.body.date, this.req.body.emotion, this.req.body.share);

            if(res.success==true){
                const {member_id, diary_no, content, date,  image_url, emotion, like_count, shared}=(await DiaryStorage.getDiary(this.req.userId, where))[0];
                
                console.log(member_id, diary_no, content, date,  image_url, emotion, shared, like_count);
                console.log("일기 수정", last_share, shared);

                if(last_share=='false' && shared=='true'){
                    console.log("공유 변경으로 인한 추가");
                    await BoardStorage.saveBoard(this.req.userId, diary_no, content, date, image_url, like_count);
                }

                if(last_share=='true' && shared=='false'){
                    console.log("공유 변경으로 인한 삭제");
                    //where="WHERE board_writer=? AND diary_no="+ diary_no;
                    //const like=(await BoardStorage.getBoard(where, this.req.userId))[0].like_count;

                    //await DiaryStorage.modifyLike(like, index);
                    await BoardStorage.removeBoard(diary_no);
                }

                if(last_share=='true' && shared=='true'){

                    const mes=await BoardStorage.modifyBoard(diary_no, member_id, content, date, image_url);
                    console.log(mes);
                }

                
                
                return {edited_diary : {diary_no, member_id, date, content, emotion, shared, image_url}};
            }
            return res;

        }catch(err){
            return { success : false, message : err};
        }
    }

    async modifyShare(){
        try{
            const index=this.req.query.no;
            let change;
            let res;
            let selected_diary=[];
            let month_diary=[];
            let current_diary=[];
            let where="WHERE member_id=? AND diary_no="+index;
            let date=(await DiaryStorage.getDiary(this.req.userId, where))[0].date;
            let shared=(await DiaryStorage.getDiary(this.req.userId, where))[0].shared;
            const year=date.substring(0,4);
            const month=date.substring(5,7);
            const last_day=getDay(year, month);
   
            if(shared==="false"){
                change=1;
                res=await DiaryStorage.modifyShare(change, index);
            }
            else{
                change=0;
                res=await DiaryStorage.modifyShare(change, index);
            }

            if(res.success==true){
                shared=(await DiaryStorage.getDiary(this.req.userId, where))[0].shared;
                const content=(await DiaryStorage.getDiary(this.req.userId, where))[0].content;
                const image=(await DiaryStorage.getDiary(this.req.userId, where))[0].image_url;
                const like=(await DiaryStorage.getDiary(this.req.userId, where))[0].like_count;
                console.log(shared, content, image, like);

                if(shared=='true'){
                    console.log("공유 변경으로 인한 추가");
                    where="WHERE member_id=? AND diary_no="+index;

                    await BoardStorage.saveBoard(this.req.userId, index, content, date, image, like);
                }

                else if(shared=='false'){
                    console.log("공유 변경으로 인한 삭제");
                    where="WHERE board_writer=? AND diary_no="+index;
                    //const like=(await BoardStorage.getBoard(where, this.req.userId))[0].like_count;

                    //await DiaryStorage.modifyLike(like, index);
                    await BoardStorage.removeBoard(index);
                }

                where="WHERE member_id=? AND diary_no="+this.req.query.no;
                selected_diary=(await DiaryStorage.getDiary(this.req.userId, where))[0];

                where="WHERE member_id=? AND (DATE(diary_date) BETWEEN '"+year+"-"+month+"-01' AND '"+year+"-"+month+"-"+last_day+"') ORDER BY diary_date ASC";
                month_diary=await DiaryStorage.getDiary(this.req.userId, where);

                where="WHERE member_id=? ORDER BY diary_date DESC limit 0,6";
                current_diary=await DiaryStorage.getDiary(this.req.userId, where);
                
                if(month_diary.length==0) return {message : "EMPTY"}           
                else return {message : "FILL", selected_diary, month_diary, current_diary};
            }
            return res;

        }catch(err){
            return { success : false, message : err}
        }
    }

}

module.exports=Diary;