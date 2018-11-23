const sqlite3 = require('sqlite3').verbose();
const path = require('path');
class DataBase{
    constructor(dbfile){
        let dbfilepath = path.resolve(__dirname, dbfile ? dbfile : './database.db3');
        this.db = new sqlite3.Database(dbfilepath);
        this.run("PRAGMA foreign_keys=ON");
        this.handleError = this.handleError.bind(this);
    }
    //UPDATE,DELETE
    run(sql,params=[]){
        return new Promise((resolve,reject)=>{
            this.db.run(sql,params,function(err){
                err ? reject(err) : resolve({_lastID:this.lastID, _changes:this.changes});
            })
        }).catch(this.handleError);
    }
    handleError(err){
        console.log(err);
    }
    //QUERY
    get(sql,params = []){
        return new Promise((resolve,reject)=>{
            this.db.get(sql,params,function(err,row){
                err ? reject(err) : resolve(row);
            })
        }).catch(this.handleError)
    }
    //All
    all(sql,params = []){
        return new Promise((resolve,reject)=>{
            this.db.all(sql,params,function(err,rows){
                err ? reject(err) : resolve(rows);
            })
        }).catch(this.handleError)
    }
    //EXEC
    exec(sql,params = []){
        return new Promise((resolve,reject)=>{
            this.db.exec(sql,params,function(err,rows){
                err ? reject(err) : resolve(rows);
            })
        }).catch(this.handleError);
    }
}

module.exports = DataBase;