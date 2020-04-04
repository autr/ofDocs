const fs = require('fs'),
    path = require('path'),
    {exec} = require('child_process'),
    directories = require('../docs.config.js').directories,
    root = require('../docs.config.js').root,
    meta = require('../docs.config.js').meta,
    filters = require('../docs.config.js').filters,
    exts = require('../docs.config.js').exts,
    icons = require('../docs.config.js').icons,
    navigation = require('../docs.config.js').navigation,
    Glob = require("glob").Glob,
    mimeType = require("mime-types");

/*-- GLOBAL__ --*/

let promises__ = [];
let index__ = 0;
let data__ = [];
let tree__ = {};
let routes__ = [];
let totals__ = {};



const findEntryFromKey = ( _key, _value ) => {
    for (let i = 0; i < data__.length; i++ ) {
        const d = data__[i];
        if ( d[_key] === _value ) {
            return d;
        }
    }
    return undefined;
}

const getEntryExtType = ( _ext ) => {
    for (let i = 0; i < Object.keys(exts).length; i++) {
        const k = Object.keys(exts)[i];
        const e = exts[k];
        if ( e.indexOf( _ext ) !== -1) return k;
    }
    return null;
}


const createProtoEntry = ( _url, _strDirKey, _baseUrl ) => {
    const dir = path.dirname( _url );
    const filename = path.basename( _url );
    const absolute = path.resolve( _url );
    const bare = absolute.replace( _baseUrl, '');
    let route_ = '/'+_strDirKey.toLowerCase() + bare;
    let path_ = route_;


    /*-- clean dots --*/

    path_ = path_.replace(/([!@#$%^&*()]|(?:[.](?![a-z0-9]+$)))/g, '-');

    /*-- remove extension --*/

    let ext_ = "";
    path_ = path_.replace(/\.[^.]*$/g, (e) => {
        ext_ = e.substring(1).toLowerCase();
        return "";
    });

    let name_ = path.basename( path_ );
    let type_ = getEntryExtType( ext_ );

    if (fs.lstatSync( absolute ).isDirectory()) {
        route_ += "/";
        path_ += "/";
        type_ = "folder";
    }

    if ( !type_ ) return null;

    if (type_ === 'source') {
        path_ += '_' + ext_;
        name_ += '.' + ext_;
    }
    if (type_ === 'asset') {
        path_ += '.' + ext_;
        name_ += '.' + ext_;
    }

    name_ = name_.replace("_functions", " (functions)");
    name_ = name_.replace("_", "");

    return {
        filename: filename,
        absolute: absolute,
        path: path_,
        route: route_,
        dir: dir,
        name: name_,
        ext: ext_,
        type: type_
    }
};

const getParentEntry = ( obj, _strDirKey, _baseUrl ) => {

    const folder = createProtoEntry( obj.dir, _strDirKey, _baseUrl );
    let entry = findEntryFromKey( 'absolute', folder.absolute );


    if (!entry) {


        entry = {
            name: folder.name,
            filename: folder.filename,
            absolute: folder.absolute,
            path: folder.path,
            dir: folder.dir,
            route: folder.route,
            ext: folder.ext,
            type: folder.type,
            id: index__++,
            children: []
        }

        data__.push(entry);
        // obj.parent = entry.id;
    }


    if ( _baseUrl !== entry.absolute  ) {
        const parent = getParentEntry( entry, _strDirKey, _baseUrl );
        if (parent.children.indexOf(entry.id) === -1) {
            parent.children.push( entry.id );
        }
    }


    return entry;

}




const createBasic = (entry ) => {
    return {
        name: entry.name,
        path: entry.path,
        id: entry.id,
        route: entry.route,
        type: entry.type,
        filename: entry.filename,
        icon: entry.icon
    };
}


const createTree = ( entry, t ) => {
    const full = findEntryFromKey('id', entry.id );
    if (!totals__[full.type]) totals__[full.type] = 0;
    totals__[full.type] += 1;
    if ( full.children ) entry.children = full.children.map(c => {
        data__[c].parent = full.id;
        return createTree( createBasic( findEntryFromKey('id', c) ) )
    });
    return entry;
}


const parseDirectory = (strDirKey ) => {


    return new Promise( (resolve, reject) => {

        const dir = directories[ strDirKey ].dir;
        const baseUrl = path.resolve( dir );
        const pattern = directories[ strDirKey ].pattern;



        console.log(`🗂  [createManifest.js] "${dir}"`);

        let g = new Glob( dir + pattern , {
            nobrace: false
        }, (er, matches) => {

            if (er) {
                throw er;
                reject(er);
            }



            /* -- create data__ store --*/



            for (let i = 0; i < matches.length; i++) {



                const match = matches[i]
                const current = createProtoEntry( match, strDirKey, baseUrl );





                if (current) {

                    let parent = getParentEntry( current, strDirKey, baseUrl );
                    const entry = {
                        name: current.name,
                        filename: current.filename,
                        absolute: current.absolute,
                        path: current.path,
                        route: current.route,
                        dir: current.dir,
                        ext: current.ext,
                        type: current.type,
                        id: index__++,
                        parent: parent.id
                    };

                    parent.children.push( entry.id );
                    data__.push( entry )
                }

            }

            /* -- add icons -- */

            for ( let i = 0; i < data__.length; i++) {
                const d = data__[i];
                const n = data__[i].name;
                if ( Object.keys(icons).indexOf( n ) !== -1) {
                    data__[i].icon = icons[n];
                }
            }

            /* -- create structure store --*/

            totals__ = {};
            const baseEntry_ = findEntryFromKey('absolute', baseUrl );

            if (!baseEntry_ || matches.length === 0) {
                console.error("❌", baseEntry_, "does not return any files...");
            }

            tree__[strDirKey] = createTree( createBasic( baseEntry_ ) );

            /*-- add breadcrumbs to data__ store --*/

            for (let i = 0; i < data__.length; i++) {
                const e = data__[i];
                e.breadcrumbs = [];
                let p = data__[e.parent];
                while(p) {
                    e.breadcrumbs.push(p.id);
                    p = data__[p.parent];
                }
                const t = data__[i].type;
                if (t !== 'asset') {
                    routes__.push( {
                        path: data__[i].path,
                        component: 'components/Page.vue',
                        name: data__[i].name
                    });
                }

            }

            // print totals__

            Object.keys(totals__).forEach( k => {
                console.log(`💁  [createManifest.js] ${strDirKey}: ${totals__[k]} ${k}(s)`);
            })

            resolve();



        }) // glob
    }); // promise
}

const getVersion = () => {

    return new Promise(( resolve, reject) => {


        if (directories.openFrameworks) {

            const d = directories.openFrameworks.dir;
            const c = path.resolve(d + 'utils/ofConstants.h');
            fs.readFile( c, (err,raw) => {
                if (!err) {
                    const s = raw.toString('utf8');
                    const v = {
                        major: s.match(new RegExp(/(?<=OF_VERSION_MAJOR).*/g))[0].replace(' ',''),
                        minor: s.match(new RegExp(/(?<=OF_VERSION_MINOR).*/g))[0].replace(' ',''),
                        patch: s.match(new RegExp(/(?<=OF_VERSION_PATCH).*/g))[0].replace(' ','')
                    };
                    resolve(v);
                } else {
                    reject();
                }
            });
        } else {
            resolve();
        }
    });
}


Object.keys( directories ).forEach( strDirKey => {


    promises__.push( parseDirectory(strDirKey) );
});


Promise.all(promises__).then( (res) => {


    data__.forEach( d => {
        if (d.name === root) {
            let r = JSON.parse(JSON.stringify(d));
            r.path = "/";
            r.parent = null;
            r.id = data__.length;
            data__.push(r);
        }
    });

    const output = {
        structure: tree__,
        data: data__,
        meta: meta,
        filters: filters,
        navigation: navigation
    };


    getVersion().then( (v) => {
        output.version = v;
        if (v) console.log(`🏷  [createManifest.js] using OF v${v.major}.${v.minor}.${v.patch}`);
        let str = JSON.stringify(output, null, 4);

        const manifestPath = path.join('./', "/docs.manifest.json");
        fs.writeFile( manifestPath , str, (err) => {
            if (err) {
                reject( err );
                console.error(err);
            }
            console.log(`✅  [createManifest.js] wrote: ${manifestPath}`);

            const routesPath = path.join('./', "/docs.routes.json");
            fs.writeFile( routesPath, JSON.stringify( routes__ , null, 4), err => {

                if (err) {
                    reject( err );
                    console.error(err);
                }
                console.log(`✅  [createManifest.js] wrote: ${routesPath}`);
                process.exit();
            } );
        });
    }).catch( err => {
        throw err;
    });


}).catch( err => {

    console.log('❌ [createManifest.js] error')
    console.error(err);
});
