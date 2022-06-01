"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const UserStorage=require("./UserStorage");
const QAStorage=require("../QA/QAStorage");
const ProfileStorage=require("../User/ProfileStorage"); 
const BadgeStorage=require("../Badge/BadgeStorage");
const DiaryStorage=require("../Diary/DiaryStorage");
const jwt=require('jsonwebtoken');
const moment = require("moment");
const fs=require("fs");
const secret=process.env.JWT_SECRET_KEY;

class User{
    constructor(body){
        this.body=body;
    }

    async login(){
        try{   
            const user=await UserStorage.getUserInfo(this.body.id);

            if(user){
                if(user.member_id===this.body.id && user.pw===this.body.password){
                    const accessToken=jwt.sign({
                        userId : user.member_id,
                        userName : user.name
                    }, 
                    secret,
                    {
                        expiresIn:'1d'
                    });
                   

                    //refreshToken을 DB에 저장한다 가정
                    //DB에 저장한다면 member 테이블의 PK값이 FK값으로 저장되기 때문에 payload에 빈 객체를 할당
                    //JWT의 payload가 늘어날수록 오버헤드가 크기 때문

                    const refreshToken=jwt.sign({
                        userId : user.member_id
                    },
                    secret,
                    {
                        expiresIn:'14d'
                    });                    

                    console.log("1 : "+accessToken+", 2 : "+refreshToken);

                    //const res=await UserStorage.saveToken(user.member_id, refreshToken); //test 할 때만 실제로는 주석 지우기
                    let lastDate;
                    let isFirst;
                    const now=new Date(+new Date()+3240*10000).toISOString().split("T")[0];
                    const QA=(await QAStorage.getQA(user.member_id))[0];
                    console.log(QA);
                    if(QA==undefined) lastDate=null;
                    else {
                        lastDate=new moment(QA.date);
                        lastDate=lastDate.format("YYYY-MM-DD");
                    }
                
                    console.log("==============\n",now, lastDate);
                    if(now==lastDate) isFirst=false;
                    else if((now!=lastDate) || (lastDate==null)) isFirst=true;

                    const userInfo=await UserStorage.getUserInfo(user.member_id);
                    const nickname=userInfo.nickname;
                    const name=userInfo.name;
                    const email=userInfo.email;
                    const profile_image_url=(await ProfileStorage.getProfile(user.member_id))[0].profile_src;

                    //console.log(userInfo, name, nickname, email, profile_image_url);

                    return { success : true, AT : accessToken, RT : refreshToken, isFirst, name, nickname, profile_image_url, email};
                }
                return { success : false, status : 401, message: "비밀번호가 틀렸습니다." };
            }
            return { success : false, status : 401, message: "존재하지 않는 아이디입니다." };
        } catch(err){
            throw err
        }
    }

    async logout(){
        try{
            const res=await UserStorage.removeToken(this.body.userId);
            return res;

        }catch(err){
            return { success : false, message : err}
        }

    }

    async register(){
        try{
            //let success;
            console.log(this.body);
            const res=await UserStorage.saveUserInfo(this.body);
            if(res.success==true) await ProfileStorage.saveProfile(this.body.id, null);

            for(let i = 1 ; i < 16 ; i++ ){
                const num = await BadgeStorage.numBadge(i, this.body.id);
            }

            return res;

        }catch(err){
            return { success : false, message : err}
        }

    }

    async idCheck(){
        try{
            const res=await UserStorage.getUserInfo(this.body.id);
            if(res===undefined){
                return {success : true};
            }
            else return {success : false, message : "existed"};

        }catch(err){
            return { success : false, message : "이미 존재하는 아이디 입니다."}
        }
    }

    async removeMember(){
        try{
            console.log("유저",this.body.userId);
            let res=[];
            let diary_url=[];
            let query=["DELETE FROM capstone_design.member WHERE member_id="+"'"+this.body.userId+"';",
            "DELETE FROM capstone_design.memberbadge WHERE member_id="+"'"+this.body.userId+"';",
            "DELETE FROM capstone_design.qa WHERE member_id="+"'"+this.body.userId+"';",
            "DELETE FROM capstone_design.menstruationcycle WHERE member_id="+"'"+this.body.userId+"';"];
            let profile=(await ProfileStorage.getProfile(this.body.userId))[0];
            console.log(profile.profile_src);
            if(profile.profile_src!==null){ 
                profile=profile.profile_src.split(":3001")[1];
                
                if(fs.existsSync("./src/databases"+profile)){
                    try{
                        fs.unlinkSync("./src/databases"+profile);
                        console.log("프로필 이미지 삭제");
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }

            let where="WHERE member_id=?";
            const diary=await DiaryStorage.getDiary(this.body.userId, where);
            console.log(diary)
            if(diary.length!=0){
                for(let i=0; i<diary.length; i++){
                    if(diary[i].image_url!==undefined) diary_url.push(diary[i].image_url.split(":3001")[1]);
                }
                if(diary_url.length!=0){
                    for(let i=0; i<diary_url.length; i++){
                            if(fs.existsSync("./src/databases"+diary_url[i])){
                                try{
                                    console.log("일기 이미지 삭제");
                                    fs.unlinkSync("./src/databases"+diary_url[i]);
                                    
                                }
                                catch(err){
                                    console.log(err)
                                }
                            }
                    }
                }
            }

            for(let i=0; i<query.length; i++){
                console.log(query[i]);
                res=await UserStorage.removeUserInfo(query[i]);
                console.log(res);
            }
            
            for(let i=0; i<res.length; i++){
                if(res.success==false) {
                    res[0]={success : false};
                    break;
                }
            }
            console.log(res);
            if(res.success==true){
                return {result : "SUCCESS"};
            }
            else return {result : "FALSE", message : "회원 탈퇴 실패"};

        }catch(err){
            return { result : "FALSE", message : "회원 탈퇴 실패"};
        }
    }

    async changePW(){
        try{
            const {member_id, pw, email, name, nickname}=await UserStorage.getUserInfo(this.body.userId);
            let new_pw;
           
            if(pw!==this.body.body.password){
                console.log("일치X");
                return {result : "FALSE", message : "비밀번호가 일치하지 않습니다."};
            }
            console.log("일치");
            new_pw=this.body.body.new_password;

            const res=await UserStorage.modifyUserInfo(member_id, new_pw, email, name, nickname, this.body.userId);

            if(res.success==true){
                return {result : "SUCCESS", message : "비밀번호 변경에 성공했습니다."};
            }
            else return {result : "FALSE", message : "비밀번호 변경에 실패했습니다."};

        }catch(err){
            return { result : "FALSE", message : "비밀번호 변경에 실패했습니다."}
        }
    }

    async getProfile(){
        try{
            let profile=(await ProfileStorage.getProfile(this.body.userId))[0].profile_src;
            console.log(profile);
            if(profile==null) return {profile : null};

            profile=profile.split(":3001")[1];
            console.log(profile);

            return profile;
        }catch(err){
            return { success : false, message : err}
        }
    }

    async modifyProfile(){
        try{
            const res=await ProfileStorage.modifyProfile(this.body.userId, this.body.file.filename);
            console.log(res);
            if(res.success==true) return {result : "SUCCESS"};
            else return {result : "FALSE"};
        }catch(err){
            return { result : "FALSE", message : "프로필 이미지 변경에 실패했습니다."}
        }
    }

    async modifyUser(){
        try{
            const {member_id, pw, email, name, nickname}=await UserStorage.getUserInfo(this.body.userId);
            const new_name=this.body.body.new_name;
            const new_nickname=this.body.body.new_nickname;
            const new_email=this.body.body.new_email;
            const res=await UserStorage.modifyUserInfo(member_id, pw, new_email, new_name, new_nickname);
            const user=await UserStorage.getUserInfo(this.body.userId);
            const profile=(await ProfileStorage.getProfile(this.body.userId))[0].profile_src;
            console.log(res);
            if(res.success==true) return {result : "SUCCESS", name : user.name, nickname : user.nickname, profile_image_url : profile, eamil : user.email};
            else return {result : "FALSE"};
        }catch(err){
            return { result : "FALSE", message : "정보 변경에 실패했습니다."}
        }
    }

}

module.exports=User;