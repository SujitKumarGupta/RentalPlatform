

const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");




async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
 }
 main().then((res)=>{
    console.log("connection build")
 })
 .catch((err)=>{
    console.log("error occured")
 })
 

 const initdb= async ()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner:"66c652346ca7cc1b4a6bf47f"}))
    await listing.insertMany(initdata.data);
    console.log("data was initalized");
 }
 initdb();