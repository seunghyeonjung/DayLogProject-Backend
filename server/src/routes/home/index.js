//라우터=>도메인으로 들어왔을 때 클라이언트의 요청을 연결
//"/login"=>요청 , function()=>기능(컨트롤러 영역)

"use strict";

const express=require("express");
const router=express.Router();

const sharp=require("sharp");
const fs=require("fs");
const multer=require('multer');
const storage=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/databases/images')
    },
    filename: function(req, file, cb){
        console.log(file.originalname);
        cb(null, Date.now()+'_'+file.originalname);
    }
});

const _storage=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/databases/profiles')
    },
    filename: function(req, file, cb){
        cb(null, file.filename+'-'+Date.now())
    }
});

const fileFilter=(req, file, cb)=>{
    const typeArray=file.mimetype.split('/');
    const fileType=typeArray[1];

    if(fileType=='jpg' || fileType=='png' || fileType=='jpeg'){
        console.log("ok");
        req.fileValidationError=null;
        cb(null, true);
    }
    else{
        console.log("no");
        req.fileValidationError=".jpg, .png, .jpeg 파일만 업로드 가능합니다.";
        cb(null, false);
    }
}

const diary_upload=multer({storage:storage, fileFilter:fileFilter}).single('image');
const profile_upload=multer({storage:_storage, fileFilter:fileFilter});
let image;


const checkToken=require("../middlewares/authorization");
const user_ctrl=require("./user.ctrl");
const todo_ctrl=require("./todo.ctrl");
const schedule_ctrl=require("./schedule.ctrl");
const diary_ctrl=require("./diary.ctrl");

const menstruation_ctrl=require("./menstruation.ctrl");
const board_ctrl=require("./board.ctrl");

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
router.post("/diary/image",checkToken.auth.check, function(req, res, next){
    diary_upload(req, res, function(err){
        console.log(req.file);
        console.log(req.file.path);
        if(req.fileValidationError!=null){
            console.log(req.fileValidationError);
            return res.status(400).send(req.fileValidationError);
        }
        if(err) {
            console.log(err);
            return res.status(400).send({message : err});
        }
        else{
            console.log("ok", req.file.filename, req.file.path);
            image=req.file.filename;
            next();
        }
    })
}, function(req, res, next){
    try{
        sharp(req.file.path)
        .resize({width:240, height:360, fit:'fill'})
        .withMetadata()
        .toBuffer((err, buffer)=>{
            if(err) throw err;
            fs.writeFile(req.file.path, buffer, (err)=>{
                if(err) throw err;
            })
        })
        next();
    }
    catch(err){
        console.log(err);
    }
},diary_ctrl.process.saveImage);


//생리 관련
router.post("/members/cycle/new", checkToken.auth.check, menstruation_ctrl.process.saveMenstruation);
router.post("/members/cycle", checkToken.auth.check, menstruation_ctrl.process.getMenstruation);

//공유 게시판 관련
router.get("/board/latest", checkToken.auth.check, board_ctrl.process.getBoardLastest);
router.get("/board/heart", checkToken.auth.check, board_ctrl.process.getBoardHeart);
router.get("/board/diary", checkToken.auth.check, board_ctrl.process.getBoard);


module.exports=router;