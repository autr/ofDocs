const parser = require('./apiUtils.js');
const sitemap = require('./sitemap.js');

export default function (req, res, next) {
    if (req.url === '/') {
        next();
        return;
    }

    parser( req.url ).then( (r) => {

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
