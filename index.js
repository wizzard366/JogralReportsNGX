var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql");
var path = require('path');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var compression = require('compression');
var fs = require('fs');

var public_app = express();


var PUBLIC_PORT = 80;
//var conf_file = JSON.parse(fs.readFileSync('/home/mtaracena/jogralReports/server_config.json', 'utf8'));
var conf_file = JSON.parse(fs.readFileSync('server_config.json', 'utf8'));
var environment = conf_file.conf.environment;
var servers = conf_file.servers;

var connectionPools = {};
var storeCodes={};


/* create coonection pools for each environment */

servers.forEach(element => {
    
    if (element.enabled) {
        var config = {
            user: element["db-user"],
            password: element["db-pass"],
            server: element["db-server"],
            database: element["db-name"],
            id:element["db-id"],
            code:element["db-empresa-id"]
        }
        storeCodes[element["db-id"]]=element["db-empresa-id"];      
        connectionPools[config.id] = new sql.Connection(config);

        connectionPools[config.id].on('error', err => {
            console.log("ERROR: Pool[" + "" + config.id + "]=> ", err);
        });
        connectionPools[config.id].connect(err => {
            if (err)
                console.log("ERROR: Testing Pool[" + "" + config.id + "]=> ", err);
        })

    }
})


function removeFailServer(poolKey){
    this.connectionPools[poolKey]
}


if (environment == "prod") {
    var fs = require('fs');
    var https = require('https');
    var key = fs.readFileSync('/etc/letsencrypt/live/jogral.info/privkey.pem');
    var cert = fs.readFileSync('/etc/letsencrypt/live/jogral.info/cert.pem');
    var https_options = {
        key: key,
        cert: cert
    };
    var PORT = 443;
    var HOST = '0.0.0.0';
} else {
    var PORT = 3000;
}


app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));



// Setting configuration for INV database
var config = {
    user: 'sa',
    password: 'OEM02panorama',
    server: '10.10.1.4',//Internal:10.10.1.4 External:186.151.248.234
    database: 'PCINVJes'
};


app.set('superSecret', 'thisisthesecret');



// Sets up our view engine to load
/*app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/



app.use(express.static(path.join(__dirname, 'ng2-admin/dist/'), { dotfiles: 'allow' }));
app.use('/node_modules', express.static(path.join(__dirname, 'ng2-admin/node_modules/')));

public_app.use(express.static(path.join(__dirname, './public_root/'), { dotfiles: 'allow' }));

public_app.get('/', function (req, res) {
    res.redirect('https://' + req.header('Host') + req.url);
});


// get an instance of the router for api routes
var apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/:serverid/authenticate', function (req, res) {

    // find the user

    let UsuarioId = req.body.username;
    let query = "Select Nombre,Password,UsuarioId,Corre1 from ERPUsuarios where UsuarioId=@usuarioid";
    
    pool = req.params.serverid;

    
    
    connectionPools[pool].request().input('usuarioid', sql.VarChar, UsuarioId).query(query, (err, result) => {


        if (err) {
            console.log(err);
            res.json({ 'err': err });
        }

        if (typeof result[0] == 'undefined' || result[0] == null) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            let pass = result[0].Password;
            let userid = result[0].UsuarioId;
            let name = result[0].Nombre;
            let corre = result[0].Corre1;
            if (pass === req.body.password) {
                // if user is found and password is right
                // create a token
                var token = jwt.sign({ data: userid, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, app.get('superSecret'), {

                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    name: name,
                    corre: corre
                });
            } else {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }

        }
    });


});


apiRoutes.get('/servers', function (req, res) {
    var response = [];

    servers.forEach((element, i) => {
        if(element['enabled']===true){
            response.push({
                name: element["db-server-name"],
                index: element["db-id"],
            })
        }
    });

    res.json(response);
});



apiRoutes.get('/:serverid/test/', function (req, res) {

    pool = req.params.serverid;
    console.log("serverid",req.params.serverid);
    if (pool) {

        //request = new sql.Request(connectionPools[pool]);

        /* connectionPools[pool].request().query("select 1 as number", (err, result) => {
            if (err) { res.send(err) }
            res.send(result);
        }); */

        res.send(req.params.serverid)
    }

});


// TODO: route middleware to verify a token
apiRoutes.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});






//get product sales info last 3 years
apiRoutes.get('/:serverid/producto/:pid/yearsales/', function (req, res) {

    let ProductoId = req.params.pid;

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    

    let query = "Select  fd.EmpresaId, fd.ProductoId, Ano=Datepart(yyyy,f.Fecha), \
    Mes=Datepart(MM,f.Fecha),  Cantidad=Sum(fd.Cantidad*um.Factor), Monto=Round(Sum(fd.PrecioTotal),2) \
    From FACDocumento f, FACDocumentoDet fd, INVProducto p, INVProductoUMedida um \
    Where f.EmpresaId=@EmpresaId and f.AplicadoInvent=1 And f.Anulado=0 and \
            Datepart(yyyy,f.Fecha)>= Datepart(yyyy,getdate())-2  And \
            fd.EmpresaId=f.EmpresaId And fd.TurnoId=f.TurnoId And fd.TipoDocId=f.TipoDocId and f.NumeroDoc=fd.NumeroDoc and \
            p.EmpresaId=fd.EmpresaId and p.ProductoId=fd.ProductoId and p.ProductoId=@ProductoId And \
            um.EmpresaId=fd.EmpresaId And um.ProductoId=fd.ProductoId and um.UMedidaId=fd.UMedidaId And um.Descripcion=fd.DescUMedida \
    Group by fd.EmpresaId, fd.ProductoId,  Datepart(yyyy,f.Fecha), Datepart(MM,f.Fecha) \
    Order By  Datepart(yyyy,f.Fecha), Datepart(MM,f.Fecha)";


    connectionPools[poolKey].request()
        .input('ProductoId', sql.NVarChar, ProductoId)
        .input('EmpresaId',sql.NVarChar,empresaId)
        .query(query, (err, result) => {
            res.send(result);
            console.log(err);
        });
});

//get product sales info date interval
apiRoutes.get('/:serverid/producto/:id/ventas', function (req, res) {

    var ProductoId = req.params.id;
    var startDate = decodeURIComponent(req.query['startDate']);
    var endDate = decodeURIComponent(req.query['endDate']) + ' 23:59';
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];


    var query = "Select  fd.EmpresaId, fd.ProductoId, f.Fecha,  Cantidad=Sum(fd.Cantidad*um.Factor), Monto=Sum(fd.PrecioTotal)\
    From FACDocumento f, FACDocumentoDet fd, INVProducto p, INVProductoUMedida um\
    Where f.EmpresaId=@EmpresaId and f.AplicadoInvent=1 And f.Anulado=0 and \
            f.Fecha between @Desde And @Hasta And\
            fd.EmpresaId=f.EmpresaId And fd.TurnoId=f.TurnoId And fd.TipoDocId=f.TipoDocId and f.NumeroDoc=fd.NumeroDoc and\
            p.EmpresaId=fd.EmpresaId and p.ProductoId=fd.ProductoId and p.ProductoId=@ProductoId And\
            um.EmpresaId=fd.EmpresaId And um.ProductoId=fd.ProductoId and um.UMedidaId=fd.UMedidaId And um.Descripcion=fd.DescUMedida\
    Group by fd.EmpresaId, fd.ProductoId, f.Fecha\
    Order By f.Fecha"



    connectionPools[poolKey].request()
        .input('ProductoId', sql.NVarChar, ProductoId)
        .input('EmpresaId',sql.Int,empresaId)
        .input('Desde', sql.NVarChar, startDate)
        .input('Hasta', sql.NVarChar, endDate).query(query, (err, result) => {
            res.send(result);
            console.log(err);
        });
})


// Get product by id
apiRoutes.get('/:serverid/producto/:id', function (req, res) {

    var id_parameter = req.params.id;

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select p.EmpresaId as empresaId,p.ProductoId as productoId,p.Descripcion as descripcion, a.Descripcion as area, s.Descripcion as subArea, m.Descripcion as marca, p.Costo as costo, p.AfectoIVA as afectoIva ' +
        'from INVProducto p, INVXArea a, INVXAreaSubArea s, INVXMarca m ' +
        'Where p.EmpresaId=@EmpresaId And ProductoId=@id_parameter ' +
        'And a.EmpresaId=p.EmpresaId and a.AreaId=p.AreaID ' +
        'And s.EmpresaId=p.EmpresaId and s.AreaID=p.AreaID and s.SubAreaId=p.SubAreaID ' +
        'And m.EmpresaId=p.EmpresaId and m.MarcaId=p.MarcaId;';

    connectionPools[poolKey].request()
        .input('id_parameter', sql.VarChar, id_parameter)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
        });

    /* var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_parameter', sql.Int, id_parameter).query(query, (err, result) => {
            res.send(result);
        });

    }) */

});

// Get product by description
apiRoutes.get('/:serverid/producto/description/:desc', function (req, res) {


    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select p.EmpresaId as empresaId,p.ProductoId as productoId,p.Descripcion as descripcion, a.Descripcion as area, s.Descripcion as subArea, m.Descripcion as marca, p.Costo as costo, p.AfectoIVA as afectoIva ' +
        'from INVProducto p, INVXArea a, INVXAreaSubArea s, INVXMarca m ' +
        'Where p.EmpresaId=@EmpresaId And p.Descripcion LIKE @descParam ' +
        'And a.EmpresaId=p.EmpresaId and a.AreaId=p.AreaID ' +
        'And s.EmpresaId=p.EmpresaId and s.AreaID=p.AreaID and s.SubAreaId=p.SubAreaID ' +
        'And m.EmpresaId=p.EmpresaId and m.MarcaId=p.MarcaId;';



    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

// get measurements by product id
apiRoutes.get('/:serverid/producto/:id/umedida', function (req, res) {
    var id_parameter = req.params.id;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];


    var query = 'Select EmpresaId,ProductoId,UMedidaId,Descripcion,Base,Factor  ' +
        'From INVProductoUMedida ' +
        'Where EmpresaId=@EmpresaId And ProductoId=@id_parameter ';



    connectionPools[poolKey].request()
        .input('id_parameter', sql.VarChar, id_parameter)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });



});




//get prices by product id and measurement
apiRoutes.get('/:serverid/precios/producto/:id/umedida/:umid/:umdesc', function (req, res) {
    var id_parameter = req.params.id;
    var id_umedida = req.params.umid;
    var desc_umedida = req.params.umdesc;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];


    var query = 'Select pr.EmpresaId,pr.ProductoId,pr.UMedidaId,pr.DescUMedida, pr.TipoPrecioId ,tp.Descripcion as TipoPrecio, pr.PrecioVenta, Round(pr.MargenSobreCosto,4) as MargenSobreCosto ' +
        'From INVProductoPrecio pr, INVXTipoPrecio tp ' +
        'Where pr.EmpresaId=@EmpresaId And pr.ProductoId=@id_parameter ' +
        'And pr.UMedidaId=@id_umedida ' +
        'And pr.DescUMedida=@desc_umedida ' +
        'And tp.EmpresaId=pr.EmpresaId And tp.TipoPrecioId=pr.TipoPrecioId;'


    connectionPools[poolKey].request()
        .input('id_umedida', sql.NVarChar, id_umedida)
        .input('desc_umedida', sql.NVarChar, desc_umedida)
        .input('id_parameter', sql.VarChar, id_parameter)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });




});




// get price range
apiRoutes.get('/:serverid/precios/rangos/producto/:id/umedida/:umid/:umdesc/pricetype/:ptypeid', function (req, res) {
    var id_parameter = req.params.id;
    var id_umedida = req.params.umid;
    var desc_umedida = req.params.umdesc;
    var id_ptype = req.params.ptypeid;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];



    var query = 'Select pr.EmpresaId, pr.ProductoId, pr.UMedidaId, pr.DescUMedidaId, pr.TipoPrecioId, pr.Desde, pr.Hasta, pr.PrecioVenta, Round(pr.MargenSobreCosto,4) as MargenSobreCosto  ' +
        'From INVProductoPRRango pr ' +
        'Where pr.EmpresaId=@EmpresaId And pr.ProductoId=@id_parameter ' +
        'And pr.UMedidaId=@id_umedida ' +
        'And pr.DescUMedidaId=@desc_umedida ' +
        'And TipoPrecioId=@id_ptype;'



    connectionPools[poolKey].request()
        .input('id_ptype', sql.Int, id_ptype)
        .input('id_umedida', sql.NVarChar, id_umedida)
        .input('desc_umedida', sql.NChar, desc_umedida)
        .input('id_parameter', sql.VarChar, id_parameter)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            console.log({'err':err,'result':result})
            res.send(result);
    });



});

/* get stock */
apiRoutes.get('/:serverid/producto/:id/existencias/umedida/factor/:factor', function (req, res) {

    var id_parameter = req.params.id;
    var factor_umedida = req.params.factor;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];


    var query = 'Select pb.EmpresaId,pb.ProductoId,b.Descripcion as Bodega, pb.UMedidaId, pb.DescUMedidaId, (pb.SaldoActual / @Factor) as SaldoActual  ' +
        'From INVProductoBodega pb, INVXBodega b ' +
        'where pb.EmpresaId=@EmpresaId And pb.ProductoId=@id_parameter ' +
        'And b.EmpresaId=pb.EmpresaId and b.BodegaId=pb.BodegaId; ';


    connectionPools[poolKey].request()
        .input('id_parameter', sql.VarChar, id_parameter)
        .input('Factor', sql.Int, factor_umedida)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });





});



// Graficas

/* ventas totales por mes y year */
apiRoutes.get('/:serverid/sales/year/:year', function (req, res) {

    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select Ano as Year, Sum(Enero) AS Enero, Sum(Febrero) AS Febrero, Sum(Marzo) As Marzo, Sum(Abril) As Abril, \
    Sum(Mayo) As Mayo, Sum(Junio) As Junio, Sum(Julio) As Julio, Sum(Agosto) As Agosto, Sum(Septiembre) As Septiembre, \
    Sum(Octubre) As Octubre, Sum(Noviembre) As Noviembre, Sum(Diciembre) As Diciembre   \
                From INVRepWEBVentasVendedor where Ano>=@Year And Fuente=\'Ventas\' \
                Group By Ano';
    

    connectionPools[poolKey].request().input('Year', sql.Int, year).query(query, (err, result) => {
        res.send(result);
    });





});

/* Ventas por Marca del Mes Actual  este es de PIE */
apiRoutes.get('/:serverid/sales/brand', function (req, res) {

    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select top 5 m.Descripcion as Marca, Round(Sum(d.PrecioTotal),2) as Total ' +
        'from FACDocumento f, FACDocumentoDet d, INVXMarca m, INVProducto p ' +
        'Where f.EmpresaId=@EmpresaId And Month(f.Fecha)=Month(getdate()) And YEAR(f.Fecha)=YEAR(getdate()) And f.AplicadoInvent=1 And f.Anulado=0 And ' +
        'd.EmpresaId=f.EmpresaId And d.TipoDocId=f.TipoDocId And d.NumeroDoc=f.NumeroDoc And d.TurnoId=f.TurnoId And ' +
        'p.EmpresaId=d.EmpresaId And p.ProductoId=d.ProductoId And ' +
        'm.EmpresaId=p.EmpresaId And m.MarcaId=p.MarcaId ' +
        'Group by m.Descripcion ' +
        'Order by Sum(d.PrecioTotal) DESC ';


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
        res.send(result);
    });


});

/* Ventas por Vendedor del Mes Actual   */
apiRoutes.get('/:serverid/sales/salesman', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select v.NombreCompleto as Vendedor, Round(Sum(f.Total),2) as Total  ' +
        'from FACDocumento f,  FACXVendedor v ' +
        'Where f.EmpresaId=@EmpresaId And Month(f.Fecha)=Month(getdate()) And YEAR(f.Fecha)=YEAR(getdate()) And f.AplicadoInvent=1 And f.Anulado=0 And ' +
        'v.EmpresaId=f.EmpresaId and v.UsuarioId=f.UsuarioPedido ' +
        'Group by v.NombreCompleto ';


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });


});


/* no enmpresa parameter */
/* ventas por vendedor y proyecciones */
apiRoutes.get('/:serverid/sales/salesman/proyections', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * From INVRepWEBVentasVendedor where EmpresaId=@EmpresaId order by VendedorId ';
    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {

        res.send(result);
    });


});


/* no enmpresa parameter */
/* ventas por vendedor y proyecciones por año */
apiRoutes.get('/:serverid/sales/salesman/proyections/:year', function (req, res) {

    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * From INVRepWEBVentasVendedor where Ano=@year and EmpresaId=@EmpresaId order by VendedorId ';



    connectionPools[poolKey].request()
        .input('year', sql.Int, year)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });


});

apiRoutes.get('/:serverid/sales/brand/product/:marcaId/:year', function (req, res) {

    var marcaId = req.params.marcaId;
    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * From INVRepWEBMarcaProducto where MarcaId=@marcaId and Ano>=@year and EmpresaId=@EmpresaId order by Ano DESC';


    connectionPools[poolKey].request()
        .input('marcaId', sql.NVarChar, marcaId)
        .input('year', sql.Int, year)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });


});

/* no enmpresa parameter */
/* Ventas por Laboratorio ultimos 3 años */
apiRoutes.get('/:serverid/sales/brand/:marcaId/:year', function (req, res) {

    var marcaId = req.params.marcaId;
    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * From INVRepWEBMarca where MarcaId=@marcaId and Ano>=@year  and EmpresaId=@EmpresaId';


    connectionPools[poolKey].request()
        .input('marcaId', sql.NVarChar, marcaId)
        .input('year', sql.Int, year)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
        res.send(result);
    });


});


/**  top 10 clientes por vendedor */
apiRoutes.get('/:serverid/sales/salesman/:salesmanId/topclients/:year/:month', function (req, res) {

    var salesmanId = req.params.salesmanId;
    var year = req.params.year;
    var month = req.params.month;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];


    var query = 'SELECT  TOP 5 f.EmpresaId, f.ClienteId, f.Nombre, VendedorId = v.VendedorId, Nombre = v.NombreCompleto, Total = Sum(f.Total)\
                    FROM    dbo.FACDocumento f, dbo.FACXVendedor v\
                    WHERE   f.EmpresaId = @EmpresaId AND f.AplicadoInvent = 1 AND f.Anulado = 0 AND datepart(yyyy, f.Fecha) = @year And datepart(MM, f.Fecha) = @month AND f.UsuarioPedido <> \'NPineda9\' AND \
                            v.EmpresaId = f.EmpresaId AND v.VendedorId = f.VendedorId And v.VendedorId=@salesmanId\
                    GROUP BY f.EmpresaId, f.ClienteId, f.Nombre, v.VendedorId, v.NombreCompleto\
                    ORDER BY Sum(f.Total) DESC\
                    ';


    connectionPools[poolKey].request()
        .input('salesmanId', sql.NVarChar, salesmanId)
        .input('year', sql.Int, year)
        .input('month', sql.Int, month)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });


});



/* búsqueda por marca/laboratorio */
apiRoutes.get('/:serverid/brand/:brandName', function (req, res) {

    var brandName = req.params.brandName;
    var brand_queryParam = '%' + brandName + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * from INVXMarca  ' +
        'Where Descripcion like @brandName AND EmpresaId=@EmpresaId';


    connectionPools[poolKey].request()
        .input('brandName', sql.NVarChar, brand_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {

        res.send(result);
    });


});


/* Ventas por Cliente por Año*/
apiRoutes.get('/:serverid/clients/salesperyear/:year/:cuser', function (req, res) {

    
    var clientUser = req.params.cuser;
    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'SELECT d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor, ' +
        'Round(SUM(CASE WHEN Mes = 01 THEN Total ELSE 0 END),2) AS Enero, ' +
        'Round(SUM(CASE WHEN Mes = 02 THEN Total ELSE 0 END),2) AS Febrero, ' +
        'Round(SUM(CASE WHEN Mes = 03 THEN Total ELSE 0 END),2) AS Marzo, ' +
        'Round(SUM(CASE WHEN Mes = 04 THEN Total ELSE 0 END),2) AS Abril, ' +
        'Round(SUM(CASE WHEN Mes = 05 THEN Total ELSE 0 END),2) AS Mayo, ' +
        'Round(SUM(CASE WHEN Mes = 06 THEN Total ELSE 0 END),2) AS Junio, ' +
        'Round(SUM(CASE WHEN Mes = 07 THEN Total ELSE 0 END),2) AS Julio, ' +
        'Round(SUM(CASE WHEN Mes = 08 THEN Total ELSE 0 END),2) AS Agosto, ' +
        'Round(SUM(CASE WHEN Mes = 09 THEN Total ELSE 0 END),2) AS Septiembre, ' +
        'Round(SUM(CASE WHEN Mes = 10 THEN Total ELSE 0 END),2) AS Octubre, ' +
        'Round(SUM(CASE WHEN Mes = 11 THEN Total ELSE 0 END),2) AS Noviembre, ' +
        'Round(SUM(CASE WHEN Mes = 12 THEN Total ELSE 0 END),2) AS Diciembre, ' +
        'Round(SUM(Total),2) AS Total ' +
        'FROM (SELECT f.EmpresaId,Ano = DATEPART(YYYY,f.Fecha), Mes = DATEPART(MM,f.Fecha),Cliente = f.ClienteId,NombreCliente = f.Nombre,Vendedor = v.NombreCompleto,Total = Sum(f.Total)FROM dbo.FACDocumento f, dbo.FACXVendedor v ' +
        'Where f.EmpresaId=@EmpresaId And f.AplicadoInvent=1 And f.Anulado=0 And datepart(yyyy,f.Fecha)>=@year And f.UsuarioPedido <> \'NPineda9\' and v.EmpresaId=f.EmpresaId And v.VendedorId=f.VendedorId ' +
        'GROUP BY f.EmpresaId, DATEPART(YYYY,f.Fecha),DATEPART(MM,f.Fecha), f.ClienteId, f.Nombre,v.NombreCompleto ' +
        ') d WHERE d.Cliente = @clientUser GROUP BY d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor ' +
        'Order By Ano ASC ';

    connectionPools[poolKey].request()
        .input('year', sql.Int, year)
        .input('clientUser', sql.Int, clientUser)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
            console.log(err);
    });


});



/******** */
/* Ventas por Cliente por Año Top 10*/
apiRoutes.get('/:serverid/clients/top/salesperyear/:year', function (req, res) {

    
    var clientUser = req.params.cuser;
    var year = req.params.year;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'SELECT top 10 d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor, ' +
        'Round(SUM(CASE WHEN Mes = 01 THEN Total ELSE 0 END),2) AS Enero, ' +
        'Round(SUM(CASE WHEN Mes = 02 THEN Total ELSE 0 END),2) AS Febrero, ' +
        'Round(SUM(CASE WHEN Mes = 03 THEN Total ELSE 0 END),2) AS Marzo, ' +
        'Round(SUM(CASE WHEN Mes = 04 THEN Total ELSE 0 END),2) AS Abril, ' +
        'Round(SUM(CASE WHEN Mes = 05 THEN Total ELSE 0 END),2) AS Mayo, ' +
        'Round(SUM(CASE WHEN Mes = 06 THEN Total ELSE 0 END),2) AS Junio, ' +
        'Round(SUM(CASE WHEN Mes = 07 THEN Total ELSE 0 END),2) AS Julio, ' +
        'Round(SUM(CASE WHEN Mes = 08 THEN Total ELSE 0 END),2) AS Agosto, ' +
        'Round(SUM(CASE WHEN Mes = 09 THEN Total ELSE 0 END),2) AS Septiembre, ' +
        'Round(SUM(CASE WHEN Mes = 10 THEN Total ELSE 0 END),2) AS Octubre, ' +
        'Round(SUM(CASE WHEN Mes = 11 THEN Total ELSE 0 END),2) AS Noviembre, ' +
        'Round(SUM(CASE WHEN Mes = 12 THEN Total ELSE 0 END),2) AS Diciembre, ' +
        'Round(SUM(Total),2) AS Total ' +
        'FROM (SELECT f.EmpresaId,Ano = DATEPART(YYYY,f.Fecha), Mes = DATEPART(MM,f.Fecha),Cliente = f.ClienteId,NombreCliente = f.Nombre,Vendedor = v.NombreCompleto,Total = Sum(f.Total)FROM dbo.FACDocumento f, dbo.FACXVendedor v ' +
        'Where f.EmpresaId=@EmpresaId And f.AplicadoInvent=1 And f.Anulado=0 And datepart(yyyy,f.Fecha)=@year And f.UsuarioPedido <> \'NPineda9\' and v.EmpresaId=f.EmpresaId And v.UsuarioId=f.UsuarioPedido ' +
        'GROUP BY f.EmpresaId, DATEPART(YYYY,f.Fecha),DATEPART(MM,f.Fecha), f.ClienteId, f.Nombre,v.NombreCompleto ' +
        ') d GROUP BY d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor ' +
        'Order By Total DESC ';

    connectionPools[poolKey].request()
        .input('year', sql.Int, year)
        .input('clientUser', sql.Int, clientUser)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
            console.log(err);
    });


});


/* clientes */
apiRoutes.get('/:serverid/clients/:name', function (req, res) {

    var name = req.params.name;
    name = "%" + name + "%";
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'select C.ClienteId, C.NIT, C.Nombre, C.Apellido, C.NombreComercial from CXCCliente  as C ' +
        'where C.EmpresaId = @EmpresaId and C.NombreComercial like @name ' +
        'Order By C.NombreComercial DESC ';

    connectionPools[poolKey].request()
        .input('name', sql.NVarChar, name)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
        res.send(result);
        console.log(err);
    });


});


/* ventas por laboratorio y proyección */
apiRoutes.get('/:serverid/sales/labs/:year', function (req, res) {


    let poolKey = req.params.serverid;
    let year = req.params.year;
    let empresaId = storeCodes[poolKey];


    var query2 = "Select 'Proyeccion' as Fuente, MarcaId, Descripcion, Ano, \
                    Sum(Case When Mes=1  Then Proyeccion Else 0 END) AS Enero, \
                    Sum(Case When Mes=2  Then Proyeccion Else 0 END) AS Febrero, \
                    Sum(Case When Mes=3  Then Proyeccion Else 0 END) AS Marzo, \
                    Sum(Case When Mes=4  Then Proyeccion Else 0 END) AS Abril, \
                    Sum(Case When Mes=5  Then Proyeccion Else 0 END) AS Mayo, \
                    Sum(Case When Mes=6  Then Proyeccion Else 0 END) AS Junio, \
                    Sum(Case When Mes=7  Then Proyeccion Else 0 END) AS Julio, \
                    Sum(Case When Mes=8  Then Proyeccion Else 0 END) AS Agosto, \
                    Sum(Case When Mes=9  Then Proyeccion Else 0 END) AS Septiembre, \
                    Sum(Case When Mes=10 Then Proyeccion Else 0 END) AS Octubre, \
                    Sum(Case When Mes=11 Then Proyeccion Else 0 END) AS Noviembre, \
                    Sum(Case When Mes=12 Then Proyeccion Else 0 END) AS Diciembre, \
                    Sum(Total) as Total \
                From (Select m.MarcaId, m.Descripcion, Year(mp.Desde) as Ano, Month(mp.Desde) as Mes, Proyeccion as Proyeccion, Sum(Proyeccion) as Total \
                    from INVXMarcaPro mp, INVXMarca m \
                    Where m.EmpresaId=@EmpresaId And \
                            mp.EmpresaId=m.EmpresaId And mp.MarcaId=m.MarcaId \
                    Group By m.MarcaId, m.Descripcion, Year(mp.Desde), Month(mp.Desde),Proyeccion \
                ) as D \
                Where Ano = @year \
                Group By  MarcaId, Descripcion, Ano \
                Union \
                Select 'Ventas' as Fuente, MarcaId, Descripcion, Ano, \
                    Sum(Case When Mes=1  Then Proyeccion Else 0 END) AS Enero, \
                    Sum(Case When Mes=2  Then Proyeccion Else 0 END) AS Febrero,  \
                    Sum(Case When Mes=3  Then Proyeccion Else 0 END) AS Marzo,  \
                    Sum(Case When Mes=4  Then Proyeccion Else 0 END) AS Abril,  \
                    Sum(Case When Mes=5  Then Proyeccion Else 0 END) AS Mayo, \
                    Sum(Case When Mes=6  Then Proyeccion Else 0 END) AS Junio, \
                    Sum(Case When Mes=7  Then Proyeccion Else 0 END) AS Julio, \
                    Sum(Case When Mes=8  Then Proyeccion Else 0 END) AS Agosto, \
                    Sum(Case When Mes=9  Then Proyeccion Else 0 END) AS Septiembre, \
                    Sum(Case When Mes=10 Then Proyeccion Else 0 END) AS Octubre, \
                    Sum(Case When Mes=11 Then Proyeccion Else 0 END) AS Noviembre, \
                    Sum(Case When Mes=12 Then Proyeccion Else 0 END) AS Diciembre, \
                    Sum(Total) as Total \
                From (Select m.MarcaId, m.Descripcion, Year(mp.Desde) as Ano, Month(mp.Desde) as Mes, Ejecutado as Proyeccion, Sum(Ejecutado) as Total \
                    from INVXMarcaPro mp, INVXMarca m \
                    Where m.EmpresaId=@EmpresaId And \
                            mp.EmpresaId=m.EmpresaId And mp.MarcaId=m.MarcaId \
                    Group By m.MarcaId, m.Descripcion, Year(mp.Desde), Month(mp.Desde),Ejecutado \
                ) as D \
                Where Ano = @year \
                Group By  MarcaId, Descripcion, Ano";

    

    connectionPools[poolKey].request()
        .input('year', sql.Int, year)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query2, (err, result) => {
        res.send(result);
        console.log(err);   
    });


});

apiRoutes.get('/:serverid/sales/labsbyseller/', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = "Select 'Proyeccion' as Fuente, VendedorId, NombreCompleto,MarcaId, Descripcion, Ano, \
                    Sum(Case When Mes=1  Then Proyeccion Else 0 END) AS Enero, \
                    Sum(Case When Mes=2  Then Proyeccion Else 0 END) AS Febrero, \
                    Sum(Case When Mes=3  Then Proyeccion Else 0 END) AS Marzo, \
                    Sum(Case When Mes=4  Then Proyeccion Else 0 END) AS Abril, \
                    Sum(Case When Mes=5  Then Proyeccion Else 0 END) AS Mayo, \
                    Sum(Case When Mes=6  Then Proyeccion Else 0 END) AS Junio, \
                    Sum(Case When Mes=7  Then Proyeccion Else 0 END) AS Julio, \
                    Sum(Case When Mes=8  Then Proyeccion Else 0 END) AS Agosto, \
                    Sum(Case When Mes=9  Then Proyeccion Else 0 END) AS Septiembre, \
                    Sum(Case When Mes=10 Then Proyeccion Else 0 END) AS Octubre, \
                    Sum(Case When Mes=11 Then Proyeccion Else 0 END) AS Noviembre, \
                    Sum(Case When Mes=12 Then Proyeccion Else 0 END) AS Diciembre, \
                    Sum(Total) as Total \
                From (Select mp.VendedorId, v.NombreCompleto, m.MarcaId, m.Descripcion, Year(mp.Desde) as Ano, Month(mp.Desde) as Mes, Proyeccion as Proyeccion, Sum(Proyeccion) as Total \
                    from FACXVenProMarca mp, INVXMarca m, FACXVendedor v \
                    Where m.EmpresaId=@EmpresaId And \
                            mp.EmpresaId=m.EmpresaId And mp.MarcaId=m.MarcaId And \
                            v.EmpresaId=mp.EmpresaId And v.VendedorId=mp.VendedorId \
                    Group By mp.VendedorId,v.NombreCompleto,m.MarcaId, m.Descripcion, Year(mp.Desde), Month(mp.Desde),Proyeccion \
                ) as D where Ano=2020\
                Group By  VendedorId, NombreCompleto,MarcaId, Descripcion, Ano \
                Union \
                Select 'Ventas' as Fuente, VendedorId, NombreCompleto,MarcaId, Descripcion, Ano, \
                    Sum(Case When Mes=1  Then Proyeccion Else 0 END) AS Enero, \
                    Sum(Case When Mes=2  Then Proyeccion Else 0 END) AS Febrero, \
                    Sum(Case When Mes=3  Then Proyeccion Else 0 END) AS Marzo, \
                    Sum(Case When Mes=4  Then Proyeccion Else 0 END) AS Abril, \
                    Sum(Case When Mes=5  Then Proyeccion Else 0 END) AS Mayo, \
                    Sum(Case When Mes=6  Then Proyeccion Else 0 END) AS Junio, \
                    Sum(Case When Mes=7  Then Proyeccion Else 0 END) AS Julio, \
                    Sum(Case When Mes=8  Then Proyeccion Else 0 END) AS Agosto, \
                    Sum(Case When Mes=9  Then Proyeccion Else 0 END) AS Septiembre, \
                    Sum(Case When Mes=10 Then Proyeccion Else 0 END) AS Octubre, \
                    Sum(Case When Mes=11 Then Proyeccion Else 0 END) AS Noviembre, \
                    Sum(Case When Mes=12 Then Proyeccion Else 0 END) AS Diciembre, \
                    Sum(Total) as Total \
                From (Select  mp.VendedorId,v.NombreCompleto,m.MarcaId, m.Descripcion, Year(mp.Desde) as Ano, Month(mp.Desde) as Mes, Ejecutado as Proyeccion, Sum(Ejecutado) as Total \
                    from FACXVenProMarca mp, INVXMarca m, FACXVendedor v \
                    Where m.EmpresaId=@EmpresaId And \
                            mp.EmpresaId=m.EmpresaId And mp.MarcaId=m.MarcaId And \
                            v.EmpresaId=mp.EmpresaId And v.VendedorId=mp.VendedorId \
                    Group By  mp.VendedorId,v.NombreCompleto,m.MarcaId, m.Descripcion, Year(mp.Desde), Month(mp.Desde),Ejecutado \
                ) as D where Ano=2020\
                Group By  VendedorId, NombreCompleto,MarcaId, Descripcion, Ano ";

    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
            console.log(err);
    });


});


/* ventas por producto y vendedor */
apiRoutes.get('/:serverid/sales/byproductandseller/:productId/', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    //var desde = decodeURIComponent(req.query['startDate']);
    //var hasta = decodeURIComponent(req.query['endDate']) + ' 23:59';
    let productoId = req.params.productId;
    let vendedorId = req.params.vendedorId;

    var desde=decodeURIComponent(req.query['startDate']);
    var hasta=decodeURIComponent(req.query['endDate']) + ' 23:59';

    
    
    var query2 = 'Select p.EmpresaId, v.VendedorId,v.Nombre As Vendedor, v.NombreCompleto as NombreCompleto, p.ProductoId, P.Descripcion, f.Fecha, Sum(d.Cantidad) as Cantidad \
    From INVProducto p, FACDocumento f, FACDocumentoDet d, FACXVendedor v \
    Where f.EmpresaId=@EmpresaId And p.ProductoId=@productoId  And \
        f.AplicadoInvent=1 And f.Anulado=0 and f.Fecha Between @Desde And @Hasta And \
        d.EmpresaId=f.EmpresaId and d.TurnoId=f.TurnoId And d.TipoDocId=f.TipoDocId And d.NumeroDoc=f.NumeroDoc And \
        v.EmpresaId=f.EmpresaId And v.VendedorId=f.VendedorId and \
        p.EmpresaId=d.EmpresaId And p.ProductoId=d.ProductoId   \
        And p.ProductoId=@productoId  \
    Group by p.EmpresaId, v.VendedorId,v.Nombre, p.ProductoId, P.Descripcion, f.Fecha, v.NombreCompleto order by v.VendedorId, f.Fecha';


    var query = 'Select x.EmpresaId, v.VendedorId, v.Nombre, v.NombreCompleto, x.ProductoId, x.Descripcion, x.Fecha, \
    Sum(x.CantidadUMVenta) as Cantidad from viewProductoUMVenta x, FACXVendedor v \
    Where v.EmpresaId=x.EmpresaId and v.UsuarioId=x.UsuarioPedido And \
            x.Fecha BETWEEN @Desde And @Hasta and x.ProductoId=@productoId \
    group by x.EmpresaId, v.VendedorId, v.Nombre, v.NombreCompleto, x.ProductoId, x.Descripcion, x.Fecha \
    order by v.VendedorId, x.ProductoId, x.Fecha'


    connectionPools[poolKey].request()
        .input('Hasta', sql.NVarChar, hasta)
        .input('Desde', sql.NVarChar, desde)
        .input('productoId', sql.NVarChar, productoId)
        .input('vendedorId', sql.NVarChar, vendedorId)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
            console.log(err);
    });

});


apiRoutes.get('/:serverid/sellers', function (req, res) {

    
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * from FACXVendedor  ' +
        'Where Activo=1 AND EmpresaId=@EmpresaId';


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {

        res.send(result);
    });
});


apiRoutes.get('/date', function (req, res) {

    let server_date = new Date();
    let response = {
        "server_date": server_date.getTime()
    }

    res.send(response);

})

apiRoutes.get('/:serverid/purchases', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select * from COMDashGlobal where EmpresaId=@EmpresaId order by MarcaId, ProductoId ';


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {

        res.send(result);
    });

})

apiRoutes.get('/:serverid/moneyflow', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'Select Sum(a.Saldo) as Saldo,Sum(A.Corriente) as Corriente, Sum(a.QuinceTreinta) as QuinceTreinta, Sum(a.TreintaSesenta) as TreintaSesenta, \
                    Sum(a.SesentaNoventa) as SesentaNoventa, Sum(a.NoventaCiento20) as NoventaCiento20, Sum(a.Ciento20Mas) as Ciento20Mas \
                From \
                (SELECT C.EmpresaId, C.TipoDocId, C.NumeroDoc, C.Fecha, CP.FechaProgra, C.Nombre, C.Observaciones, CP.Saldo, C.ClienteId, DATEDIFF(dd, CP.FechaProgra, GETDATE()) AS Dias, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) <= 15 THEN CP.Saldo ELSE 0 END AS Corriente, \
                        CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 15 AND DateDiff(dd, CP.FechaProgra, getdate()) <= 30 THEN CP.Saldo ELSE 0 END AS QuinceTreinta, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 30 AND DateDiff(dd, CP.FechaProgra, getdate()) \
                        <= 60 THEN CP.Saldo ELSE 0 END AS TreintaSesenta, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 60 AND DateDiff(dd, CP.FechaProgra, getdate()) <= 90 THEN CP.Saldo ELSE 0 END AS SesentaNoventa, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 90 AND \
                        DateDiff(dd, CP.FechaProgra, getdate()) <= 120 THEN CP.Saldo ELSE 0 END AS NoventaCiento20, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 120 THEN CP.Saldo ELSE 0 END AS Ciento20Mas \
                FROM   CXCCargoProgra AS CP INNER JOIN \
                        CXCCargo AS C ON CP.EmpresaId = C.EmpresaId AND CP.TipoDocId = C.TipoDocId AND CP.NumeroDoc = C.NumeroDoc AND CP.ClienteId = C.ClienteId \
                WHERE (C.Aplicado = 1) AND (C.Anulado = 0) AND (C.EmpresaId = @EmpresaId) AND (CP.Saldo > 0)) as A';


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {

        res.send(result);
    });

})



apiRoutes.get('/:serverid/moneyflow/:interval', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    let interval = req.params.interval;
    var current = 'Corriente';
    var interval1 = 'QuinceTreinta'
    var interval2 = 'TreintaSesenta'
    var interval3 = 'SesentaNoventa'
    var interval4 = 'NoventaCiento20'
    var interval5 = 'Ciento20Mas'
    let query_interval = current;

    switch(interval){
        case current: 
            query_interval = current;
            break;
        case interval1:
            query_interval = interval1;
            break;
        case interval2:
            query_interval = interval2;
            break;
        case interval3:
            query_interval = interval3;
            break;
        case interval4:
            query_interval = interval4;
            break;
        case interval5:
            query_interval = interval5;
            break;
    }

    var query = `Select a.clienteId,a.Nombre, Sum(a.Saldo) as Saldo,Sum(A.${query_interval}) as ${query_interval} \
                From \
                (SELECT C.EmpresaId, C.TipoDocId, C.NumeroDoc, C.Fecha, CP.FechaProgra, C.Nombre, C.Observaciones, CP.Saldo, C.ClienteId, DATEDIFF(dd, CP.FechaProgra, GETDATE()) AS Dias, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) <= 15 THEN CP.Saldo ELSE 0 END AS Corriente, \
                        CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 15 AND DateDiff(dd, CP.FechaProgra, getdate()) <= 30 THEN CP.Saldo ELSE 0 END AS QuinceTreinta, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 30 AND DateDiff(dd, CP.FechaProgra, getdate()) \
                        <= 60 THEN CP.Saldo ELSE 0 END AS TreintaSesenta, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 60 AND DateDiff(dd, CP.FechaProgra, getdate()) <= 90 THEN CP.Saldo ELSE 0 END AS SesentaNoventa, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 90 AND \
                        DateDiff(dd, CP.FechaProgra, getdate()) <= 120 THEN CP.Saldo ELSE 0 END AS NoventaCiento20, CASE WHEN DateDiff(dd, CP.FechaProgra, getdate()) > 120 THEN CP.Saldo ELSE 0 END AS Ciento20Mas \
                FROM   CXCCargoProgra AS CP INNER JOIN \
                        CXCCargo AS C ON CP.EmpresaId = C.EmpresaId AND CP.TipoDocId = C.TipoDocId AND CP.NumeroDoc = C.NumeroDoc AND CP.ClienteId = C.ClienteId \
                WHERE (C.Aplicado = 1) AND (C.Anulado = 0) AND (C.EmpresaId = @EmpresaId) AND (CP.Saldo > 0)) as A \
                WHERE ${query_interval}  > 0 \
                Group by a.clienteId,a.Nombre
                `;


    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .input('Interval',sql.NVarChar,interval)
        .query(query, (err, result) => {

        res.send(result);
    });

})

apiRoutes.get('/:serverid/documents', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    let clienteid = req.query.clienteid;
    let productoid = req.query.productoid;
    let areaid = req.query.areaid;
    let subareaid = req.query.subareaid;
    let vendedorid = req.query.vendedorid;
    let deptoid = req.query.deptoid;
    let muniid = req.query.muniid;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let marcaid = req.query.marcaid;

    var query1 = "SELECT distinct docu.NumeroDoc, docu.ClienteId,docu.Direccion,docu.NIT,docu.VendedorId, docu.Total, docu.Nombre, docu.Fecha, departamento.Nombre as dptoName,municipio.Nombre as numiName,vendedor.Nombre as vendedorName \
    FROM [PCINVJes].[dbo].FACDocumentoDet as detalle, \
      (Select * from PCINVJes.dbo.FACDocumento where fecha between @desde and @hasta) as docu, \
      PCINVJes.dbo.INVProducto as producto, \
      PCINVJes.dbo.CXCCliente as cliente, \
      PCINVJes.dbo.PLADepartamentos as departamento, \
      PCINVJes.dbo.PLAMunicipios as municipio, \
      PCINVJes.dbo.FACXVendedor as vendedor, \
      PCINVJes.dbo.INVXMarca as marca \
    where docu.NumeroDoc = detalle.NumeroDoc \
      and docu.ClienteId = cliente.ClienteId \
      and docu.VendedorId = vendedor.VendedorId \
      and cliente.DeptoId = departamento.DeptoId \
      and cliente.MunicipioId = municipio.MunicipoId \
      and detalle.ProductoId = producto.ProductoId \
      and producto.MarcaId = marca.MarcaId "

    if(clienteid){
        query1 = query1 + " and cliente.ClienteId = @clienteid "
    }
    if(productoid){
        query1 = query1 + " and detalle.ProductoId = @productoid "
    }
    if(areaid){
        query1 = query1 + " and producto.AreaID = @areaid "
    }
    if(subareaid){
        query1 = query1 + " and producto.SubAreaID = @subareaid "
    }
    if(vendedorid){
        query1 = query1 + " and docu.VendedorId = @vendedorid "
    }
    if(deptoid){
        query1 = query1 + " and cliente.DeptoId = @deptoid "
    }
    if(muniid){
        query1 = query1 + " and cliente.MunicipioId = @muniid "
    }
    if(marcaid){
        query1 = query1 + " and producto.MarcaId = @marcaid "
    }

    var queryEnd="order by docu.NumeroDoc";
    var query = query1 + queryEnd;

    
    console.log("\n" + query + "\n" );
    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .input('clienteid',sql.Int,clienteid)
        .input('productoid',sql.Int,productoid)
        .input('areaid',sql.Int,areaid)
        .input('subareaid',sql.Int,subareaid)
        .input('vendedorid',sql.Int,vendedorid)
        .input('deptoid',sql.Int,deptoid)
        .input('muniid',sql.Int,muniid)
        .input('desde',sql.NVarChar,startDate+" 00:00:00.000")
        .input('hasta',sql.NVarChar,endDate+" 23:59:59.000")
        .input('marcaid',sql.NVarChar,marcaid)
        .query(query, (err, result) => {
            
            if(err){
                
                res.send(err)
            }else{
                res.send(result);
            }
    });
})

apiRoutes.get('/:serverid/area/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'select AreaId,Descripcion from PCINVJes.dbo.INVXArea where EmpresaId = @EmpresaId and (Descripcion like @descParam or AreaId like @descParam) ';

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/subarea/description/:areaid', function (req, res) {

    var areaid = req.params.areaid;
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'select SubAreaId,Descripcion from PCINVJes.dbo.INVXAreaSubArea where EmpresaId = @EmpresaId and AreaId = @areaid ';

    connectionPools[poolKey].request()
        .input('areaid', sql.NVarChar, areaid)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/marca/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = 'select MarcaId,Descripcion from PCINVJes.dbo.INVXMarca where EmpresaId = @EmpresaId and (Descripcion like @descParam or MarcaId like @descParam) ';

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/cliente/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = "Select Nombre,Apellido,NombreComercial,ClienteId from PCINVJes.dbo.CXCCliente where EmpresaId = @EmpresaId \
    and (Nombre like @descParam or Apellido like @descParam or ClienteId like @descParam or NombreComercial like @descParam)";

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/depto/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = "Select DeptoId, Nombre from PCINVJes.dbo.PLADepartamentos where EmpresaId = @EmpresaId and Nombre like @descParam";

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/muni/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = "Select DeptoId,Nombre,MunicipoId from PCINVJes.dbo.PLAMunicipios where EmpresaId = 9 and Nombre like @descParam ";

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/vendedor/description/:desc', function (req, res) {

    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'
    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];

    var query = "select VendedorId, NombreCompleto from PCINVJes.dbo.FACXVendedor where EmpresaId = 9 and Nombre like @descParam ";

    connectionPools[poolKey].request()
        .input('descParam', sql.NVarChar, desc_queryParam)
        .input('EmpresaId',sql.Int,empresaId)
        .query(query, (err, result) => {
            res.send(result);
    });

});

apiRoutes.get('/:serverid/productsbymarca/:marcaid', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    let marcaid = req.params.marcaid;

    var query = 'select ProductoId, Descripcion, MarcaId from PCINVJes.dbo.INVProducto where MarcaId = @marcaid and StatusId = 01 and EmpresaId = @EmpresaId; ';

    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .input('marcaid',sql.NVarChar,marcaid)
        .query(query, (err, result) => {

        res.send(result);
    });
})


apiRoutes.get('/:serverid/sellinsellout/:marcaid', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    let marcaid = req.params.marcaid;
    let server_date = new Date();
    let year = server_date.getFullYear();

    var query = "Select Operacion,Ano,Marca, \
                    Sum(Enero) as Enero, \
                    Sum(Febrero) as Febrero, \
                    Sum(Marzo) as Marzo, \
                    Sum(Abril) as Abril, \
                    Sum(Mayo) as Mayo, \
                    Sum(Junio) as Junio, \
                    Sum(Julio) as Julio, \
                    Sum(Agosto) as Agosto, \
                    Sum(Septiembre) as Septiembre, \
                    Sum(Octubre) as Octubre, \
                    Sum(Noviembre) as Noviembre, \
                    Sum(Diciembre) as Diciembre, \
                    Sum(Total) as Total \
                    from INVRepWEBMarcaSELLINOUT Where MarcaId=@marcaid and Ano=@year \
                    Group By Ano,Operacion,Marca \
                    Order by Ano,Operacion,Marca"; 

    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .input('marcaid',sql.NVarChar,marcaid)
        .input('year',sql.Int,year)
        .query(query, (err, result) => {

        res.send(result);
    });
})

apiRoutes.get('/:serverid/sellinsellout/:marcaid/prod/:pid', function (req, res) {

    let poolKey = req.params.serverid;
    let empresaId = storeCodes[poolKey];
    let marcaid = req.params.marcaid;
    let pid = req.params.pid;

    let server_date = new Date();
    let year = server_date.getFullYear();

    var query = "Select * from INVRepWEBMarcaSELLINOUT Where MarcaId=@marcaid And ProductoId=@pid and Ano=@year \
    Order by ProductoId,Ano,Operacion";

    connectionPools[poolKey].request()
        .input('EmpresaId',sql.Int,empresaId)
        .input('marcaid',sql.NVarChar,marcaid)
        .input('pid',sql.NVarChar,pid)
        .input('year',sql.Int,year)
        .query(query, (err, result) => {

        res.send(result);
    });
})


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

/* server listening */
if (environment == "prod") {
    var server = https.createServer(https_options, app).listen(PORT, HOST);
    console.log('HTTPS Server listening on %s:%s', HOST, PORT);
} else {

    var server = app.listen(PORT, function () {
        console.log('Server is running.. port:' + PORT);
    });

}
var public_server = public_app.listen(PUBLIC_PORT, function () {
    console.log('Public server is running.. port:' + PUBLIC_PORT)
})
/*  */