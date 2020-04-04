 
const fs = require('fs');
const parser = require('./apiUtils.js');
const sitemap = require('./sitemap.js');
     
module.exports = (req, res, next) => {
    if (req.url === '/') {
        next();
        return;
    }
 

    if (req.method === 'POST') {

        let body = "";
        req.on('data', (data) => {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end',  () => {

            parser( req.url, req.method ).then( (r) => {

                if (r.status === 500 && req.method === 'POST') {

                    const j = JSON.parse( r.data.toString() );

                    fs.writeFile( j.entry.absolute, body, (err) => {
                        if (err) { 

                            console.log(`❌ [api.js] POST could not write: ${req.url}`, err);
                            res.writeHead(404, {'content-type': 'application/json'});
                            res.end();
                            return;
                        } else {
                            console.log(`⚡️ [api.js] wrote file: ${j.entry.absolute}`);
                            parser( req.url + '?as=json', 'GET' ).then( (r) => {

                                if (r.status === 500 ) {
                                    res.setHeader('Content-Type', r.type);
                                    res.end( r.data );
                                    return;
                                } else {
                                    console.log(`❌ [api.js] POST parse error: ${req.url}`);
                                    res.writeHead(404, {'content-type': 'application/json'});
                                    res.end();
                                    return;
                                }


                            }).catch( err => {
                                console.log(`❌ [api.js] POST write error: ${req.url}`);
                                res.writeHead(404, {'content-type': 'application/json'});
                                res.end();
                                return;
                            });
                        }
                    });

                } else {

                    console.log(`❌ [api.js] POST could not parse: ${req.url}`);
                    res.writeHead(404, {'content-type': 'application/json'});
                    res.end();
                    return;
                }      

            }).catch(err => {

                console.log(`❌ [api.js] POST error: ${req.url}`, err);
                res.writeHead(404, {'content-type': 'application/json'});
                res.end();
                return; 
            });
        });


    } else {

        parser( req.url, req.method ).then( (r) => {

            if (r.status === 404) {
                console.log(`❌ [api.js] error: ${req.url}`);
                res.writeHead(404, {'content-type': 'application/json'});
                res.end();
                return;
            } else if (r.status === 500 ) {

                console.log(`⚡️ [api.js] send: ${r.type} / ${req.url}`);
                res.setHeader('Content-Type', r.type);
                res.end( r.data ) 
                return;
            } else if (r.status === 600) {
                console.log(`⚓️ [api.js] next: ${req.url}`);
                next();
                return;
            }
        }).catch( err => {
            console.log(`❌ [api.js] error: ${req.url}`, err);
            res.writeHead(404, {'content-type': 'application/json'});
            res.end();
            return;
        });
    }
 

}
