"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const UserStorage=require("./UserStorage");
const QAStorage=require("../QA/QAStorage");
const ProfileStorage=require("../User/ProfileStorage"); 
const jwt=require('jsonwebtoken');
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
                    const now=new Date().toISOString().slice(0,10);
                    const QA=(await QAStorage.getQA(user.member_id, 'ORDER BY qa_date DESC limit 0,1'))[0];
                    const lastDate=QA.qa_date;
                    let isFirst;

                    if(now==lastDate) isFirst=false;
                    else isFirst=true;

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
            const res=await UserStorage.removeToken(this.body);
            return res;

        }catch(err){
            return { success : false, message : err}
        }

    }

    async register(){
        try{
            const res=await UserStorage.saveUserInfo(this.body);
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
            return { success : false, message : err}
        }
    }

}

module.exports=User;