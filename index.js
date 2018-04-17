var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql");
var path = require('path');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var compression = require('compression');

//var public_app = express();

/* var fs = require('fs');
var https = require('https');
var key = fs.readFileSync('/etc/letsencrypt/live/jogral.info/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/jogral.info/cert.pem');
var https_options = {
    key: key,
    cert: cert
};
var PORT = 443;
var HOST = '0.0.0.0'; */

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

/* public_app.use(express.static(path.join(__dirname,'ng2-admin/dist/.well-known/'),{dotfiles:'allow'}));
public_app.get('/',function(req,res){
    res.redirect('https://' + req.header('Host') + req.url);
}); */


// get an instance of the router for api routes
var apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {

    // find the user

    let UsuarioId = req.body.username;
    let query = "Select Nombre,Password,UsuarioId,Corre1 from ERPUsuarios where UsuarioId=@usuarioid";

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('usuarioid', sql.VarChar, UsuarioId).query(query, (err, result) => {


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

apiRoutes.get('/set', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});



//get product sales info last 3 years
apiRoutes.get('/producto/:pid/yearsales/', function (req, res) {

    let ProductoId = req.params.pid;

    let query = "Select  fd.EmpresaId, fd.ProductoId, Ano=Datepart(yyyy,f.Fecha), \
    Mes=Datepart(MM,f.Fecha),  Cantidad=Sum(fd.Cantidad*um.Factor), Monto=Round(Sum(fd.PrecioTotal),2) \
    From FACDocumento f, FACDocumentoDet fd, INVProducto p, INVProductoUMedida um \
    Where f.EmpresaId=9 and f.AplicadoInvent=1 And f.Anulado=0 and \
            Datepart(yyyy,f.Fecha)>= Datepart(yyyy,getdate())-2  And \
            fd.EmpresaId=f.EmpresaId And fd.TurnoId=f.TurnoId And fd.TipoDocId=f.TipoDocId and f.NumeroDoc=fd.NumeroDoc and \
            p.EmpresaId=fd.EmpresaId and p.ProductoId=fd.ProductoId and p.ProductoId=@ProductoId And \
            um.EmpresaId=fd.EmpresaId And um.ProductoId=fd.ProductoId and um.UMedidaId=fd.UMedidaId And um.Descripcion=fd.DescUMedida \
    Group by fd.EmpresaId, fd.ProductoId,  Datepart(yyyy,f.Fecha), Datepart(MM,f.Fecha) \
    Order By  Datepart(yyyy,f.Fecha), Datepart(MM,f.Fecha)";


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }

        pool.request()
            .input('ProductoId', sql.Int, ProductoId)
            .query(query, (err, result) => {
                res.send(result);
                console.log(err);
            });

    })


});

//get product sales info date interval
apiRoutes.get('/producto/:id/ventas', function (req, res) {

    var ProductoId = req.params.id;
    var startDate = decodeURIComponent(req.query['startDate']);
    var endDate = decodeURIComponent(req.query['endDate']) + ' 23:59';



    var query = "Select  fd.EmpresaId, fd.ProductoId, f.Fecha,  Cantidad=Sum(fd.Cantidad*um.Factor), Monto=Sum(fd.PrecioTotal)\
    From FACDocumento f, FACDocumentoDet fd, INVProducto p, INVProductoUMedida um\
    Where f.EmpresaId=9 and f.AplicadoInvent=1 And f.Anulado=0 and \
            f.Fecha between @Desde And @Hasta And\
            fd.EmpresaId=f.EmpresaId And fd.TurnoId=f.TurnoId And fd.TipoDocId=f.TipoDocId and f.NumeroDoc=fd.NumeroDoc and\
            p.EmpresaId=fd.EmpresaId and p.ProductoId=fd.ProductoId and p.ProductoId=@ProductoId And\
            um.EmpresaId=fd.EmpresaId And um.ProductoId=fd.ProductoId and um.UMedidaId=fd.UMedidaId And um.Descripcion=fd.DescUMedida\
    Group by fd.EmpresaId, fd.ProductoId, f.Fecha\
    Order By f.Fecha"

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }

        pool.request()
            .input('ProductoId', sql.Int, ProductoId)
            .input('Desde', sql.NVarChar, startDate)
            .input('Hasta', sql.NVarChar, endDate).query(query, (err, result) => {
                res.send(result);
                console.log(err);
            });

    })




})


// Get product by id
apiRoutes.get('/producto/:id', function (req, res) {


    var id_parameter = req.params.id;

    var query = 'Select p.EmpresaId as empresaId,p.ProductoId as productoId,p.Descripcion as descripcion, a.Descripcion as area, s.Descripcion as subArea, m.Descripcion as marca, p.Costo as costo, p.AfectoIVA as afectoIva ' +
        'from INVProducto p, INVXArea a, INVXAreaSubArea s, INVXMarca m ' +
        'Where p.EmpresaId=9 And ProductoId=@id_parameter ' +
        'And a.EmpresaId=p.EmpresaId and a.AreaId=p.AreaID ' +
        'And s.EmpresaId=p.EmpresaId and s.AreaID=p.AreaID and s.SubAreaId=p.SubAreaID ' +
        'And m.EmpresaId=p.EmpresaId and m.MarcaId=p.MarcaId;';


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_parameter', sql.Int, id_parameter).query(query, (err, result) => {
            res.send(result);
        });

    })

});

// Get product by description
apiRoutes.get('/producto/description/:desc', function (req, res) {


    var desc_parameter = req.params.desc;
    var desc_queryParam = '%' + desc_parameter + '%'

    var query = 'Select p.EmpresaId as empresaId,p.ProductoId as productoId,p.Descripcion as descripcion, a.Descripcion as area, s.Descripcion as subArea, m.Descripcion as marca, p.Costo as costo, p.AfectoIVA as afectoIva ' +
        'from INVProducto p, INVXArea a, INVXAreaSubArea s, INVXMarca m ' +
        'Where p.EmpresaId=9 And p.Descripcion LIKE @descParam ' +
        'And a.EmpresaId=p.EmpresaId and a.AreaId=p.AreaID ' +
        'And s.EmpresaId=p.EmpresaId and s.AreaID=p.AreaID and s.SubAreaId=p.SubAreaID ' +
        'And m.EmpresaId=p.EmpresaId and m.MarcaId=p.MarcaId;';


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('descParam', sql.NVarChar, desc_queryParam).query(query, (err, result) => {
            res.send(result);
        });

    })



});

// get measurements by product id
apiRoutes.get('/producto/:id/umedida', function (req, res) {
    var id_parameter = req.params.id;

    var query = 'Select EmpresaId,ProductoId,UMedidaId,Descripcion,Base,Factor  ' +
        'From INVProductoUMedida ' +
        'Where EmpresaId=9 And ProductoId=@id_parameter ';


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_parameter', sql.Int, id_parameter).query(query, (err, result) => {
            res.send(result);
        });

    })

});




//get prices by product id and measurement
apiRoutes.get('/precios/producto/:id/umedida/:umid/:umdesc', function (req, res) {
    var id_parameter = req.params.id;
    var id_umedida = req.params.umid;
    var desc_umedida = req.params.umdesc;



    var query = 'Select pr.EmpresaId,pr.ProductoId,pr.UMedidaId,pr.DescUMedida, pr.TipoPrecioId ,tp.Descripcion as TipoPrecio, pr.PrecioVenta, Round(pr.MargenSobreCosto,4) as MargenSobreCosto ' +
        'From INVProductoPrecio pr, INVXTipoPrecio tp ' +
        'Where pr.EmpresaId=9 And pr.ProductoId=@id_parameter ' +
        'And pr.UMedidaId=@id_umedida ' +
        'And pr.DescUMedida=@desc_umedida ' +
        'And tp.EmpresaId=pr.EmpresaId And tp.TipoPrecioId=pr.TipoPrecioId;'

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_umedida', sql.NVarChar, id_umedida).input('desc_umedida', sql.NVarChar, desc_umedida).input('id_parameter', sql.Int, id_parameter).query(query, (err, result) => {
            res.send(result);
        });

    })


});




// get price range
apiRoutes.get('/precios/rangos/producto/:id/umedida/:umid/:umdesc/pricetype/:ptypeid', function (req, res) {
    var id_parameter = req.params.id;
    var id_umedida = req.params.umid;
    var desc_umedida = req.params.umdesc;
    var id_ptype = req.params.ptypeid;




    var query = 'Select pr.EmpresaId, pr.ProductoId, pr.UMedidaId, pr.DescUMedidaId, pr.TipoPrecioId, pr.Desde, pr.Hasta, pr.PrecioVenta, Round(pr.MargenSobreCosto,4) as MargenSobreCosto  ' +
        'From INVProductoPRRango pr ' +
        'Where pr.EmpresaId=9 And pr.ProductoId=@id_parameter ' +
        'And pr.UMedidaId=@id_umedida ' +
        'And pr.DescUMedidaId=@desc_umedida ' +
        'And TipoPrecioId=@id_ptype;'


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_ptype', sql.Int, id_ptype).input('id_umedida', sql.NVarChar, id_umedida).input('desc_umedida', sql.Int, desc_umedida).input('id_parameter', sql.Int, id_parameter).query(query, (err, result) => {
            res.send(result);
        });

    })

});

/* get stock */
apiRoutes.get('/producto/:id/existencias/umedida/factor/:factor', function (req, res) {

    var id_parameter = req.params.id;
    var factor_umedida = req.params.factor;



    var query = 'Select pb.EmpresaId,pb.ProductoId,b.Descripcion as Bodega, pb.UMedidaId, pb.DescUMedidaId, (pb.SaldoActual / @Factor) as SaldoActual  ' +
        'From INVProductoBodega pb, INVXBodega b ' +
        'where pb.EmpresaId=9 And pb.ProductoId=@id_parameter ' +
        'And b.EmpresaId=pb.EmpresaId and b.BodegaId=pb.BodegaId; ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('id_parameter', sql.Int, id_parameter).input('Factor', sql.Int, factor_umedida).query(query, (err, result) => {
            res.send(result);
        });

    })



});



// Graficas

/* ventas totales por mes y year */
apiRoutes.get('/sales/year/:year', function (req, res) {

    var year = req.params.year;


    var query = 'Select Datepart(yyyy,f.fecha) as Year, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=1 And x.AplicadoInvent=1 And x.Anulado=0 ) as Enero, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=2 And x.AplicadoInvent=1 And x.Anulado=0 ) as Febrero, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=3 And x.AplicadoInvent=1 And x.Anulado=0 ) as Marzo, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=4 And x.AplicadoInvent=1 And x.Anulado=0 ) as Abril, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=5 And x.AplicadoInvent=1 And x.Anulado=0 ) as Mayo, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=6 And x.AplicadoInvent=1 And x.Anulado=0 ) as Junio, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=7 And x.AplicadoInvent=1 And x.Anulado=0 ) as Julio, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=8 And x.AplicadoInvent=1 And x.Anulado=0 ) as Agosto, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=9 And x.AplicadoInvent=1 And x.Anulado=0 ) as Septiembre, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=10 And x.AplicadoInvent=1 And x.Anulado=0 ) as Octubre, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=11 And x.AplicadoInvent=1 And x.Anulado=0 ) as Noviembre, ' +
        '(Select Sum(x.Total) From FACDocumento x Where x.EmpresaId=f.EmpresaId And Year(x.Fecha)=Year(f.fecha) And Month(x.Fecha)=12 And x.AplicadoInvent=1 And x.Anulado=0 ) as Diciembre ' +
        'From FACDocumento as f ' +
        'Where EmpresaId=9 And Datepart(yyyy,f.fecha) >= @Year ' +
        'Group by Datepart(yyyy,f.fecha),f.EmpresaId ' +
        'Order by Datepart(yyyy,f.fecha) ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('Year', sql.Int, year).query(query, (err, result) => {
            res.send(result);
        });

    })



});

/* Ventas por Marca del Mes Actual  este es de PIE */
apiRoutes.get('/sales/brand', function (req, res) {

    var year = req.params.year;


    var query = 'Select top 5 m.Descripcion as Marca, Round(Sum(d.PrecioTotal),2) as Total ' +
        'from FACDocumento f, FACDocumentoDet d, INVXMarca m, INVProducto p ' +
        'Where f.EmpresaId=9 And Month(f.Fecha)=Month(getdate()) And YEAR(f.Fecha)=YEAR(getdate()) And f.AplicadoInvent=1 And f.Anulado=0 And ' +
        'd.EmpresaId=f.EmpresaId And d.TipoDocId=f.TipoDocId And d.NumeroDoc=f.NumeroDoc And d.TurnoId=f.TurnoId And ' +
        'p.EmpresaId=d.EmpresaId And p.ProductoId=d.ProductoId And ' +
        'm.EmpresaId=p.EmpresaId And m.MarcaId=p.MarcaId ' +
        'Group by m.Descripcion ' +
        'Order by Sum(d.PrecioTotal) DESC ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().query(query, (err, result) => {
            res.send(result);
        });

    })
});

/* Ventas por Vendedor del Mes Actual   */
apiRoutes.get('/sales/salesman', function (req, res) {

    var query = 'Select v.NombreCompleto as Vendedor, Round(Sum(f.Total),2) as Total  ' +
        'from FACDocumento f,  FACXVendedor v ' +
        'Where f.EmpresaId=9 And Month(f.Fecha)=Month(getdate()) And YEAR(f.Fecha)=YEAR(getdate()) And f.AplicadoInvent=1 And f.Anulado=0 And ' +
        'v.EmpresaId=f.EmpresaId and v.UsuarioId=f.UsuarioPedido ' +
        'Group by v.NombreCompleto ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().query(query, (err, result) => {
            res.send(result);
        });

    })
});


/* no enmpresa parameter */
/* ventas por vendedor y proyecciones */
apiRoutes.get('/sales/salesman/proyections', function (req, res) {



    var query = 'Select * From INVRepWEBVentasVendedor order by VendedorId ';


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().query(query, (err, result) => {

            res.send(result);
        });

    })
});


/* no enmpresa parameter */
/* ventas por vendedor y proyecciones por año */
apiRoutes.get('/sales/salesman/proyections/:year', function (req, res) {

    var year = req.params.year;

    var query = 'Select * From INVRepWEBVentasVendedor where Ano=@year order by VendedorId ';


    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('year', sql.Int, year).query(query, (err, result) => {

            res.send(result);
        });

    })
});

apiRoutes.get('/sales/brand/product/:marcaId/:year', function (req, res) {

    var marcaId = req.params.marcaId;
    var year = req.params.year;

    var query = 'Select * From INVRepWEBMarcaProducto where MarcaId=@marcaId and Ano>=@year order by Ano DESC';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('marcaId', sql.Int, marcaId).input('year', sql.Int, year).query(query, (err, result) => {

            res.send(result);
        });

    })
});

/* no enmpresa parameter */
/* Ventas por Laboratorio ultimos 3 años */
apiRoutes.get('/sales/brand/:marcaId/:year', function (req, res) {

    var marcaId = req.params.marcaId;
    var year = req.params.year;


    var query = 'Select * From INVRepWEBMarca where MarcaId=@marcaId and Ano>=@year  ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('marcaId', sql.Int, marcaId).input('year', sql.Int, year).query(query, (err, result) => {
            res.send(result);
        });

    })
});


/**  top 10 clientes por vendedor */
apiRoutes.get('/sales/salesman/:salesmanId/topclients/:year/:month', function (req, res) {

    var salesmanId = req.params.salesmanId;
    var year = req.params.year;
    var month = req.params.month;



    var query = 'SELECT  TOP 5 f.EmpresaId, f.ClienteId, f.Nombre, VendedorId = v.VendedorId, Nombre = v.NombreCompleto, Total = Sum(f.Total)\
                    FROM    dbo.FACDocumento f, dbo.FACXVendedor v\
                    WHERE   f.EmpresaId = 9 AND f.AplicadoInvent = 1 AND f.Anulado = 0 AND datepart(yyyy, f.Fecha) = @year And datepart(MM, f.Fecha) = @month AND f.UsuarioPedido <> \'NPineda9\' AND \
                            v.EmpresaId = f.EmpresaId AND v.VendedorId = f.VendedorId And v.VendedorId=@salesmanId\
                    GROUP BY f.EmpresaId, f.ClienteId, f.Nombre, v.VendedorId, v.NombreCompleto\
                    ORDER BY Sum(f.Total) DESC\
                    ';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('salesmanId', sql.Int, salesmanId).input('year', sql.Int, year).input('month', sql.Int, month).query(query, (err, result) => {
            res.send(result);
        });

    })
});



/* búsqueda por marca/laboratorio */
apiRoutes.get('/brand/:brandName', function (req, res) {

    var brandName = req.params.brandName;
    var brand_queryParam = '%' + brandName + '%'

    var query = 'Select * from INVXMarca  ' +
        'Where Descripcion like @brandName AND EmpresaId=9';

    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }
        pool.request().input('brandName', sql.NVarChar, brand_queryParam).query(query, (err, result) => {

            res.send(result);
        });

    })
});


/* Ventas por Cliente por Año*/
apiRoutes.get('/clients/salesperyear/:year/:cuser', function (req, res) {

    var empresaid = 9;
    var clientUser = req.params.cuser;
    var year = req.params.year;

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
        'Where f.EmpresaId=@empresaid And f.AplicadoInvent=1 And f.Anulado=0 And datepart(yyyy,f.Fecha)>=@year And f.UsuarioPedido <> \'NPineda9\' and v.EmpresaId=f.EmpresaId And v.VendedorId=f.VendedorId ' +
        'GROUP BY f.EmpresaId, DATEPART(YYYY,f.Fecha),DATEPART(MM,f.Fecha), f.ClienteId, f.Nombre,v.NombreCompleto ' +
        ') d WHERE d.Cliente = @clientUser GROUP BY d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor ' +
        'Order By Ano ASC ';



    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }

        pool.request().input('year', sql.Int, year).input('clientUser', sql.Int, clientUser).input('empresaid', sql.Int, empresaid).query(query, (err, result) => {
            res.send(result);
            console.log(err);
        });

    })
});



/******** */
/* Ventas por Cliente por Año Top 10*/
apiRoutes.get('/clients/top/salesperyear/:year', function (req, res) {

    var empresaid = 9;
    var clientUser = req.params.cuser;
    var year = req.params.year;

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
        'Where f.EmpresaId=@empresaid And f.AplicadoInvent=1 And f.Anulado=0 And datepart(yyyy,f.Fecha)=@year And f.UsuarioPedido <> \'NPineda9\' and v.EmpresaId=f.EmpresaId And v.UsuarioId=f.UsuarioPedido ' +
        'GROUP BY f.EmpresaId, DATEPART(YYYY,f.Fecha),DATEPART(MM,f.Fecha), f.ClienteId, f.Nombre,v.NombreCompleto ' +
        ') d GROUP BY d.EmpresaId,d.Ano,d.Cliente,d.NombreCliente,d.Vendedor ' +
        'Order By Total DESC ';



    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }

        pool.request().input('year', sql.Int, year).input('clientUser', sql.Int, clientUser).input('empresaid', sql.Int, empresaid).query(query, (err, result) => {
            res.send(result);
            console.log(err);
        });

    })
});


/* clientes */
apiRoutes.get('/clients/:name', function (req, res) {

    var empresaid = 9;
    var name = req.params.name;
    name = "%" + name + "%";

    var query = 'select C.ClienteId, C.NIT, C.Nombre, C.Apellido, C.NombreComercial from CXCCliente  as C ' +
        'where C.EmpresaId = @empresaid and C.NombreComercial like @name ' +
        'Order By C.NombreComercial DESC ';



    var pool = new sql.Connection(config, function (err) {
        if (err) {
            res.send(err);
        }

        pool.request().input('name', sql.NVarChar, name).input('empresaid', sql.Int, empresaid).query(query, (err, result) => {
            res.send(result);
            console.log(err);
        });

    })
});

apiRoutes.get('/date', function (req, res) {
    let server_date = new Date();
    let response = {
        "server_date": server_date.getTime()
    }

    res.send(response);

})


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);








/* server listening */
var server = app.listen(3000, function () {
    console.log('Server is running.. port:3000');
});

/* var public_server = public_app.listen(4000,function(){
    console.log('Public server is running.. port:4000')
}) */

/* var server = https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT); */