"use strict";

const { json } = require("body-parser");
//뱃지 정보

class BadgeInfo {
static Info(){
        let list = [];
        let a =  { Badge_no : 1 , badge_name : "첫 기록!", 
            description : "일기 3번 기록하기", final_count : 3};

        let b = { Badge_no : 2 , badge_name : "일주일 기록",
        description : "일기 7번 기록하기", final_count : 7};

        let c = { Badge_no : 3 , badge_name : "일기왕",
        description : "일기 30번 기록하기", final_count : 30};

        let d = { Badge_no : 4 , badge_name : "시작이 반",
        description : "Todolist 5번 기록하기", final_count : 5};

        let e = { Badge_no : 5 , badge_name : "바른 생활", 
        description : "Todolist 15번 기록하기", final_count : 15};

        let f = { Badge_no : 6 , badge_name : "계획적인 생활",
        description : "Todolist 30번 기록하기", final_count : 30};

        let g = { Badge_no : 7 , badge_name : "약속 지키기",
        description : "일정 1번 기록하기", final_count : 1};

        let h = { Badge_no : 8 , badge_name : "환영합니다",
        description : "출석 5번 하기", final_count : 5};

        let i = { Badge_no : 9 , badge_name : "기록은 즐거워",
        description : "30일 출석", final_count : 30};

        let j = { Badge_no : 10 , badge_name : "좋아해요", 
        description : "좋아요 5번 누르기", final_count : 5};

        let k = { Badge_no : 11 , badge_name : "좋아요",
        description : "좋아요 5번 받기", final_count : 5};

        let l = { Badge_no : 12 , badge_name : "좋은 기억",
        description : "좋아요 30번 받기", final_count : 30};

        let m = { Badge_no : 13 , badge_name : "추억 모으기", 
        description : "스크랩 10번 하기", final_count : 10};

        let n = { Badge_no : 14 , badge_name : "더불어 살기",
        description : "스크랩 30번 하기", final_count : 30};

        let o = { Badge_no : 15 , badge_name : "각양각색",
        description : "모든 기분 저장하기", final_count : 1};





        
        
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
        list.push(m);
        list.push(n);
        list.push(o);
        

        return list;

    }

}


//hello: hello와 동일하게 저장된 것
module.exports= BadgeInfo;