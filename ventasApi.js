var sql = require("mssql");

/**
 * example testing route without JWT auth.
 * @param {*} req 
 * @param {*} res 
 */
exports.test = function(req, res){
    res.send("{'send':'This is from another file'}")
};

/**
 * example function to route.
 * @param {*} req 
 * @param {*} res 
 * @param {*} pool 
 */
exports.callStoredProcedure = function(req,res,pool){

    let query = "DECLARE @outvar3 varchar(50) \
    EXEC dbo.getUsuarioAuto 'Profcoms','prograVN2003',@Resultado=@outvar3 OUTPUT; \
    select @outvar3;" 

    pool.request()
        .input('UsuarioId',sql.VarChar,'Profcom')
        .input('Password',sql.VarChar,'prograVN2003')
        .output('Resultado',sql.VarChar)
        .query(query,(err, result) => {

            if(err){
                res.send(err)
            }
            console.log('result',result);

            pool.request().query(query,(err,result)=>{
                res.send(result)
            })
    })

}
