"use strict";

const { json } = require("body-parser");
//뱃지 정보

class BadgeInfo {
static Info(){
        let list = [];
        let a =  { Badge_no : 1 , badge_name : "첫 기록!", 
            description : "일기 1번 기록하기", final_count : 1 };

        let b = { Badge_no : 2 , badge_name : "작심삼일 돌파!",
        description : "일기 4번 기록하기", final_count : 4 };

        let c = { Badge_no : 3 , badge_name : "일기왕 !",
        description : "일기 10번 기록하기", final_count : 10 };

        let d = { Badge_no : 4 , badge_name : "첫 할일 작성!",
        description : "Todolist 1번 기록하기", final_count : 1 };

        let e = { Badge_no : 5 , badge_name : "할 일이 늘어난다..", 
        description : "Todolist 3번 달성하기", final_count : 3 };

        let f = { Badge_no : 6 , badge_name : "열심히 사는 중 !",
        description : "Todolist 10번 달성하기", final_count : 10 };

        let g = { Badge_no : 7 , badge_name : "첫 일정 기록!",
        description : "일정 1번 기록하기", final_count : 1 };

        let h = { Badge_no : 8 , badge_name : "첫 출석!",
        description : "첫 출석", final_count : 1 };

        let i = { Badge_no : 9 , badge_name : "할 일이 늘어난다..", 
        description : "Todolist 3번 달성하기", final_count : 3 };

        let j = { Badge_no : 10 , badge_name : "열심히 사는 중 !",
        description : "Todolist 10번 달성하기", final_count : 10 };

        let k = { Badge_no : 11 , badge_name : "첫 일정 기록!",
        description : "일정 1번 기록하기", final_count : 1 };

        let l = { Badge_no : 12 , badge_name : "첫 출석!",
        description : "첫 출석", final_count : 1 };

        
        
        list.push(a);
        list.push(b);
        list.push(c);
        list.push(d);
        list.push(e);
        list.push(f);
        list.push(g);
        list.push(h);
        list.push(i);
        list.push(j);
        list.push(k);
        list.push(l);

        return list;

    }

}


//hello: hello와 동일하게 저장된 것
module.exports= BadgeInfo;