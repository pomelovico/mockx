class LogModel{
    constructor(db){
        this.db = db;
    }
    create(server,request){
        let {sid,url} = server,
            {method,req_header,req_body,res_body,res_header}= request;
        const lid = `l_${+(new Date())}_${Math.random().toString(32).substr(2,4)}`;
        const sql = `INSERT INTO logger (lid,sid,url,method,req_header,req_body,res_header,res_body,time) `+
            `VALUES('${lid}','${sid}','${url}','${method}','${req_header}','${req_body}','${res_header}','${res_body}','${+new Date()}')`;
        return this.db.run(sql).then(res=>{return {...server,lid}});
    }
    get(sid){
        const sql = `SELECT * FROM logger WHERE sid = '${sid}'`;
        return this.db.all(sql);
    }
}

module.exports = LogModel;