"use strict"

const { json } = require("body-parser");

const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET_KEY;
const verify=require('./verify');
const UserStorage=require("../../model/UserStorage");

const auth={
    check : async function(request, response, next){
        const accessToken=request.headers["authorization"]; //front에서 헤더에 담아준 accesstoken
        console.log(accessToken);

        const decoded =verify.verifyToken(accessToken);

        if (decoded === "jwt_expired") {
            response.status(401).send({
                message: "JWT_EXPIRED",
        });
        } 
        else if(decoded==="unexpected_token")
        response.status(400).send({
            message: "JWT_FAIL",
        });
        else{
            request.userId=decoded.userId;
            console.log(request.userId);
            next();
        }

        /*if(accessToken===undefined){
            return response.json({ success : false, msg : "no Access Token"});
        }
        
        const res=verify.verifyToken(accessToken);

        console.log(res);

        if(res==="jwt expired"){//accesstoken 만료
            return response.json({ success : false, msg : "Access Token 만료"});
        }*/
        /*else if(res==="jwt "){

        }*/
        /*else{ 
            console.log("ok");
            next();
        }*/
        
    },

    auto : async function(request, response){
        const accessToken = request.body.access_token;

        
        const decoded =verify.verifyToken(accessToken);

        console.log(decoded);

        if (decoded === "jwt_expired") {
            response.status(401).send({
                message: "JWT_EXPIRED",
        });
        } 
        else if(decoded==="unexpected_token")
        response.status(400).send({
            message: "JWT_FAIL",
        });
        else{
            response.send(decoded);
        }
          
            //console.log(err.message);
            // access 토큰이 만료된 경우  => 만료되었다는 메시지 전송
            // access 토큰이 변조됨 => 틀리다는 메시지 전송 => 다시 로그인
        


    },

    update : async function(request, response){
        const refreshToken=request.headers.cookie.split("=")[1];

        console.log(refreshToken);
       
        const res=verify.verifyToken(refreshToken);


        /*if(dbToken){
            //const result=verify.verifyToken(refreshToken);
            //console.log(result);
            if(res==="jwt expired"){
                return response.json({ success : false, msg : "JWT_EXPIRED"});
            }
            else{ 
                if(dbToken.token===refreshToken){
                    const user=await UserStorage.getUserInfo(res.userId);
                    const new_accessToken=jwt.sign({
                        userId : user.member_id,
                        userName : user.name
                    }, 
                    secret,
                    {
                        expiresIn:'1h'
                    });

                    console.log(new_accessToken);

                    return response.json({ success : true, AT : new_accessToken});
                }
                else return response.json({ success : false, msg : "Refresh Token이 일치하지 않습니다."});
            }
        }
        else return response.json({ success : false, msg : "Refresh Token이 없습니다."});      
        }*/

        if(res==="jwt expired") return response.json({ success : false, message : "JWT_EXPIRED"});
        else{
            const dbToken=await UserStorage.getUserToken(res.userId);
            if(dbToken.token===refreshToken){
                const user=await UserStorage.getUserInfo(res.userId);
                const new_accessToken=jwt.sign({
                    userId : user.member_id,
                    userName : user.name
                }, 
                secret,
                {
                    expiresIn:'1h'
                });
                return response.json({ success : true, AT : new_accessToken});
            }
            else return response.json({ success : false, message : "Refresh Token이 일치하지 않습니다."});
        }
    }

    }

module.exports={
    auth,
};