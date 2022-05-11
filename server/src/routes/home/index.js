//라우터=>도메인으로 들어왔을 때 클라이언트의 요청을 연결
//"/login"=>요청 , function()=>기능(컨트롤러 영역)

"use strict";

const express=require("express");
const router=express.Router();



const checkToken=require("../middlewares/authorization");
const user_ctrl=require("./user.ctrl");
const todo_ctrl=require("./todo.ctrl");
const schedule_ctrl=require("./schedule.ctrl");
const diary_ctrl=require("./diary.ctrl");

const menstruation_ctrl=require("./menstruation.ctrl");


//router.get("/", user_ctrl.output.hello);
//router.get("/login", user_ctrl.output.login);
router.post("/members/login", user_ctrl.process.login); //로그인
//router.delete("/members/logout", checkToken.auth.check, user_ctrl.process.logout);//로그아웃
router.delete("/members/logout", user_ctrl.process.logout); //logout test 때만 사용
router.post("/members/new", user_ctrl.process.register); //회원가입
router.post("/members/idCheck", user_ctrl.process.idCheck); //아이디 중복 체크
//router.delete("/members/logout", user_ctrl.process.logout);

//토큰 관련
router.get('/check', checkToken.auth.check);
router.get('/update', checkToken.auth.update);
router.post('/autoLogin', checkToken.auth.auto);

//todolist 관련
//router.get("/todolist", checkToken.auth.check, todo_ctrl.process.getTodo);
router.get("/todolist/calendar", checkToken.auth.check, todo_ctrl.process.getTodo);
router.get("/todolist/check", checkToken.auth.check, todo_ctrl.process.modifyTodo);
router.post("/todolist", checkToken.auth.check, todo_ctrl.process.saveTodo);
router.delete("/todolist",checkToken.auth.check, todo_ctrl.process.removeTodo);

//일정 관련
//router.get("/schedule", checkToken.auth.check, schedule_ctrl.process.getSchedule);
router.get("/schedule/calendar", checkToken.auth.check, schedule_ctrl.process.getSchedule);
router.put("/schedule", checkToken.auth.check, schedule_ctrl.process.modifySchedule);
router.post("/schedule", checkToken.auth.check, schedule_ctrl.process.saveSchedule);
router.delete("/schedule",checkToken.auth.check, schedule_ctrl.process.removeSchedule);

//일기 관련
router.get("/diary", checkToken.auth.check, diary_ctrl.process.getDiary);
router.get("/diary/calendar", checkToken.auth.check, diary_ctrl.process.getDiary);
router.get("/diary/share", checkToken.auth.check, diary_ctrl.process.modifyShare);
router.put("/diary", checkToken.auth.check, diary_ctrl.process.modifyDiary);
router.post("/diary", checkToken.auth.check, diary_ctrl.process.saveDiary);
router.delete("/diary",checkToken.auth.check, diary_ctrl.process.removeDiary);


//생리 관련
router.post("/members/cycle/new", checkToken.auth.check, menstruation_ctrl.process.saveMenstruation);
router.post("/members/cycle", checkToken.auth.check, menstruation_ctrl.process.getMenstruation);


module.exports=router;