class InterfaceModel{
    constructor(db){
        this.db = db;
    }
    create(sid,method = 'GET', path = 'mock'){
        const id = `i_${+(new Date())}_${Math.random().toString(32).substr(2,5)}`;
        const sql = `INSERT INTO  interface (id,sid,method,path) VALUES('${id}','${sid}','${method}','${path}')`;
        return this.db.run(sql).then(res=>{return {...res,sid,id,method,path}});
    }
    get(id){
        return this.db.get(`SELECT * FROM interface WHERE id='${id}'`);
    }
    getAll(sid){
        return this.db.all(`
        SELECT 
            interface.id,
            interface.sid,
            interface.method,
            interface.path 
        FROM interface WHERE sid='${sid}'
        `);
    }
    delete(id){
        return this.db.run(`DELETE FORM interface WHERE id='${id}'`);
    }
    update(id,data){
        let validFiled = ['path','method','req_params','req_body','req_header','res_body','res_header','res_cookie'];
        let setStrArr = [];
        for(let key in data){
            if(validFiled.indexOf(key) !== -1){
                setStrArr.push(` ${key} = '${data[key]}' `);
            }
        }
        if(!setStrArr.length){
            return Promise.resolve(true);
        }
        console.log(setStrArr);
        const sql = `UPDATE interface SET ${setStrArr.join(',')} WHERE id = '${id}' `;
        return this.db.run(sql);
    }
}

module.exports  = InterfaceModel
