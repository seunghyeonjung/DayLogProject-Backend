"use strict"

const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET_KEY;

module.exports={
    verifyToken(token){
            try{
                const decoded=jwt.verify(token, secret);
                return decoded;
            }catch(err){
                if(err.message.includes('Unexpected')) return 'unexpected_token';
                else return 'jwt_expired';
            }
    }
}