class ServerModel{
    constructor(db){
        this.db = db;
    }
    create(name){
        const sid = `s_${+(new Date())}_${Math.random().toString(32).substr(2,4)}`;
        const sql = `INSERT INTO server (sid,name,port,prefix) VALUES('${sid}','${name}',3000,'')`;
        return this.db.run(sql).then(res=>{return {...res,sid,name}});
    }
    get(){
        const sql = `SELECT * FROM server`;
        return this.db.all(sql);
    }
    delete(sid){
        const sql = `DELETE FROM server WHERE sid='${sid}'`;
        return  this.db.run(sql);
    }
    update(sid,server){
        let strArr = [];
        let validFiled = ['name','port','prefix'];
        for(let key in server){
            if(validFiled.indexOf(key) !== -1){
                strArr.push(` ${key} = '${server[key]}' `);
            }
        }
        if(!strArr.length){
            return Promise.resolve('');
        }
        const sql = `UPDATE server SET ${strArr.join(',')} WHERE sid='${sid}'`;
        return this.db.run(sql);
    }
}

module.exports = ServerModel;