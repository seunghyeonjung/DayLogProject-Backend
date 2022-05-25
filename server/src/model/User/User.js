"use strict"
//User=데이터를 가지고 검증 및 조작하는 역할만 수행
//jwt=header의 인코딩 값과 payload의 인코딩 값을 합친 해시값

const BadgeStorage=require("../Badge/BadgeStorage");
const UserStorage=require("./UserStorage");
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

                    const res=await UserStorage.saveToken(user.member_id, refreshToken);

                    return { success : true, AT : accessToken, RT : refreshToken, user : user.nickname};
                }
                return { status : 401, message: "비밀번호가 틀렸습니다." };
            }
            return { status : 401, message: "존재하지 않는 아이디입니다." };
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
            //뱃지리스트 기록이 없다면 만들기
            //뱃지 1~12넣기
            for(let i = 1 ; i < 13 ; i++ ){
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
            return { success : false, message : err}
        }
    }

}

    

module.exports=User;