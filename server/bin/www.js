"use strict";

const app=require("../server");
const port=process.env.port || 5000;

app.listen(port, function(){
    console.log('서버가 정상적으로 실행되었습니다.');
    console.log('develop branch 입니다.');
});