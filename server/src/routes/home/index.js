//라우터=>도메인으로 들어왔을 때 클라이언트의 요청을 연결
//"/login"=>요청 , function()=>기능(컨트롤러 영역)

"use strict";

const express=require("express");
const router=express.Router();

const checkToken=require("../middlewares/authorization");

const ctrl=require("./user.ctrl");

//router.get("/", ctrl.output.hello);
//router.get("/login", ctrl.output.login);
router.post("/members/login", ctrl.process.login);
router.post("/members/new", ctrl.process.register);
router.post("/members/idCheck", ctrl.process.idCheck);

router.get('/check', checkToken.auth.check);
router.get('/update', checkToken.auth.update);
router.post('/autoLogin', checkToken.auth.auto);

module.exports=router;