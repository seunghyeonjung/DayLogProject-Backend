"use strict";
//비동기 처리 메서드가 프로미스 객체를 반환해야 await가 의도한 대로 동작
//비동기 처리=특정 코드의 연산이 끝날 대까지 코드의 실행을 멈추지 않고 다음 코드를 먼저 실행하는 자바스크립트 특성
//서버에서 데이터를 보내줄 때까지 기다리지 않고 다른 코드를 실행하고 있음


const { json } = require("body-parser");
const User = require("../../model/User/User");

//body로 데이터를 전달하면 request.body로 접근해야함
const process={
    login : async function(request, response){
        const user=new User(request.body);
        const res=await user.login();
        console.log(res);
        response.cookie("refreshToken", res.RT, {
            maxAge: 60 * 60 * 24 * 14,
            httpOnly: true,
            secure: true,
        });
        if(res.success===true) return response.send({success : res.success, AT : res.AT, user : res.user, message : res.message});
        else return response.status(401).send(res.message);
    },

    logout : async function(request, response){
        request.userId="test123"; //실제 test 시 주석
        const user=new User(request.userId); 
        const res=await user.logout();
        console.log(res);
        response.clearCookie("refreshToken").send();
    },

    register : async function(request, response){
        const user=new User(request.body);
        const res=await user.register();
        console.log(res);
        return response.json(res);
    },

    idCheck : async function(request, response){
        const user=new User(request.body);
        const res=await user.idCheck();
        console.log(res);
        return response.json(res);
    }
}

//hello: hello와 동일하게 저장된 것
module.exports={
   process,
};