const struct = require('../docs.manifest.json').structure;
const data = require('../docs.manifest.json').data;
const parser = require('./apiUtils.js');
const api = require('./api.js');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = {
  resolveToStatic: (url, root) => {
      return path.resolve( path.join(root, url ) );
  },
  writeFile: ( writePath, data, root ) => {

      let p = module.exports.resolveToStatic( writePath, root );

      if (!fs.existsSync( p )) {
        console.log('📁   [copyAssets.js] making folder:', path.dirname(p));
        mkdirp( path.dirname( p ) , (err) => {
          if (err) console.error(err);
          const json =  data ;
          fs.writeFileSync( p, json );
        });
      }
  },
  resolveToStatic: (url, baseRoot) => {
      return path.resolve( path.join(baseRoot, url ) );
  },
  copyFile: (source, dest, baseRoot) => {

      dest = module.exports.resolveToStatic( dest, baseRoot );
      if (!fs.existsSync( dest )) {
        const p = path.dirname( dest );
        console.log('📁   [copyAssets.js] making folder:', p);
        mkdirp( p ).then( made => {
          fs.copyFile(source, dest, (err2) => {
            if (err2) throw err2;
          });
        }).catch( (err) => {
          console.log('couldnt make...')
          throw err;
        });
      } else {
        return "skipped";
      }
  }, 
  list: (  ) => {


        let promises = [];
        let routes = [];
        let urls = [];

        data.forEach( d => {

            const r = d.path;
            if (d.type !== 'asset') routes.push(r);
        });
        return routes;

  },
  copyAssets: ( baseRoot ) => {

        if (!baseRoot) {
          console.error('no baseRoot supplied');
          return;
        }
        console.log('✈️   [copyAssets.js] copying assets...')
        let copied = "";
        let skipped = "";
        data.forEach( d => {
            if (d.type === 'asset') {
              if ( module.exports.copyFile( d.absolute, d.route, baseRoot ) == "skipped") {
                skipped += path.basename(d.route) + " ";
              } else {
                copied += path.basename(d.route) + " ";
              }
            }
        });
        if (copied.length > 0) console.log(`🛫   [copyAssets.js] copied: ${copied.length} assets`);
        if (skipped.length > 0) console.log(`🛬   [copyAssets.js] skipped: ${skipped.length} (already exist)`);
  },
  payloads: ( root ) => {

      if (!root) {

        console.error('no root supplied');
        return;
      }
    
      let promises = [];
      let routes = [];


      module.exports.list().forEach( r => {
          let w = "";
          if (r.substring(r.length-1,r.length) === '/') {
            w = r.substring(0,r.length-1) + '.json';
          } else {
            w =  r + '.json'
          }
          promises.push( parser( r + '?as=json' ).then( d => {

            if (d.status === 500) {
              let payload_ = JSON.parse( d.data );
              payload_.static = true;
              routes.push({
                route: r,
                payload: payload_
              });
              try {
                console.log('🚤  [sitemap.js]', 'parsed:', payload_.entry.name );
              } catch (e) {
                console.log('🚤  [sitemap.js]', 'error:', payload_.entry);
                // module.exports.writeFile( w  , JSON.stringify( JSON.parse(d.data) ), root );
              }
            }
          }).catch( err => {
            console.error( 'errrrr', r, err)
          }));
      });

      return Promise.all( promises ).then( res => {
        console.log('✅  [sitemap.js]', 'created:', routes.length, 'json payloads...');
        return routes;
      });

  }
}
