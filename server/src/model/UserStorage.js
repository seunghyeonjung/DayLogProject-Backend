"use strict"
//UserStorage=DB를 CRUD하는 역할만 수행
/*promise => 작업이 완료되어 결과를 반환해주는 시간은 보장하지 않지만 결과를 반환했을 때 다음 코드를 진행시키거나 에러 발생 시 에러 깔끔하게 처리
    -pending=비동기 처리 로직이 아직 완료되지 않은 상태 =>new Promise(function(resolve, reject)); 메서드 호출 시 대기 상태 function=콜백함수, resolve/reject=콜백함수 인자
    -fulfilled=비동기 처리가 완료되어 프로미스가 결과 값을 반환해준 상태 =>new Promise(function(resolve, reject){ resolve(); }); 수행 시 이행 상태, getData().then(function(resolvedData){ }); 처리 결과 값 받음
    -rejected=비동기 처리가 실패하거나 오류가 발생한 상태 => new Promise(function(resolve, reject){ reject(); }); 수행 시 실패 상태, getData().then().catch(function(err){ console.log(err) }); 결과 err 받음*/

const db=require("../config/db");


class UserStorage{
    static getUserInfo(id){
        return new Promise((resolve, reject)=>{
            const query="SELECT * FROM capstone_design.member WHERE member_id=?";
            db.query(query, [id] ,(err, data)=>{
                if(err) {
                    console.log(err.message);
                    reject(err.message);
                }
                else{ 
                    console.log(data[0]);
                    resolve(data[0]);
                }
            });
        });
    }

    static getUserToken(id){
        return new Promise((resolve, reject)=>{
            const query="SELECT token FROM capstone_design.tokens WHERE member_id=?";
            db.query(query, [id] ,(err, data)=>{
                if(err) reject(err);
                else resolve(data[0]);
            });
        });
    }

    static saveUserInfo(userInfo){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.member(member_id, pw, nickname, name, email) VALUES(?, ?, ? , ?, ?)";
            db.query(query, [userInfo.id, userInfo.password, userInfo.nickname, userInfo.name, userInfo.email] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        });
    }

    static saveToken(id, token){
        return new Promise((resolve, reject)=>{
            const query="INSERT INTO capstone_design.tokens(member_id, token) VALUES(?, ?)";
            db.query(query, [id, token] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true, msg : "save token"});
            });
        })
    }

    static removeToken(id){
        return new Promise((resolve, reject)=>{
            const query="DELETE FROM capstone_design.tokens WHERE member_id=?";
            db.query(query, [id] ,(err)=>{
                if(err) reject(err);
                else resolve({success : true});
            });
        })
    }

}

module.exports=UserStorage;