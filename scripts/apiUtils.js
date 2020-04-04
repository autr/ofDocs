module.exports = ( rawUrl, method ) => {

        const codeBreak = "<!----------------------------------------------------------------------------->";

        let currentVersion = "0.11.0";

        const path = require('path');
        const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
        const queryString = require('query-string');
        const mime = require('mime-types');

        const version = require('../docs.config.js').version;


        const dirs = require('./../docs.config.js').directories,
            data = require('../docs.manifest.json').data,
            structure = require('../docs.manifest.json').structure;



        const highlight = (lang, sourceCode) => {
            const Prism = require('node-prismjs');
            const language = Prism.languages[lang] || Prism.languages.autoit;
            return Prism.highlight(sourceCode, language);
        }

        const resolveUrl = ( url ) => {

            const urlRoot = url.split('/')[1];
            const keys = Object.keys(dirs);
            for( let i = 0; i < keys.length; i++ ) {
                const dir = dirs[ keys[i] ];
                const dirRoot = path.basename( path.resolve( dir ) );

                if ( dirRoot === urlRoot ) {
                    const full = path.resolve(dir, './');
                    const absolute = path.resolve( full, '..' + url );
                    return absolute;
                }
            };
        }


        const parseNikolaConfig = ( str ) => {
            if (!str) return undefined;
            const config = str.match(/<!--[^>]+-->/g);
            if (config) {
                const vars = config[0].match(/_([a-z]).+_/g);
                let object = {};
                vars.forEach( (v, ii) => {
                    // console.log('A');
                    let k = v.match(/_([a-z]).+:\s/g)[0];
                    // console.log('B KEY', k);
                    k = k.substring( 1, k.length - 2);
                    // console.log('C VALUE', k);
                    let value = v.match(/(:\s).+_/g);
                    value = (value)? value[0].substring( 2, value[0].length - 1) : null;
                    // console.log('D VALUE', value);
                    object[k] = (k === 'parameters' && value) ? highlight('cpp', value) : value;
                });
                return object;
            }
            return {};
        };

        const parseHtmlAndHighlight = ( str ) => {
            str = str.replace("${currentVersion}", currentVersion);


            let md = require('markdown-it')({
                html: true,
                highlight: ( code, lang) => {
                    return highlight('cpp', code);
                }
            } );

            // md.renderer.rules.code_block = md.renderer.rules.fence;
            // console.log(md());
            return md.render( str );
        };


        const parseNikolaMethods = (str) => {
            if (!str) return undefined;
            let methods = [];       
            const splitted = str.split(codeBreak);
            if (splitted <= 1) return undefined;
            splitted.forEach( ( methodStr, i ) => {
                methods[i] = parseNikolaConfig(  methodStr );
                let short =  methodStr.match( new RegExp(/(_inlined_description: _)[^>]+(_description: _)/g) );
                let desc =  methodStr.match( new RegExp(/[^a-z](_description: _)[^>]+/g) );
                if (short) {
                    short = short[0].substring(24, short[0].length - 15);
                    methods[i].short = parseHtmlAndHighlight(  short );
                }
                if (desc) {
                    desc = desc[0].substring(16, desc[0].length );
                    methods[i].desc = parseHtmlAndHighlight(  desc );
                }
            });
            return methods;
        }


        const extractMainSection = ( raw ) => {

            const idx = raw.indexOf('#Methods');
            if (idx === -1) return undefined;
            return raw.substring( 0, idx);
        };
        const extractMainDescriptions = ( str ) => {

            /*-- parse config, description, short --*/

            if (!str) return {
                short: undefined,
                full: undefined
            };

            let short = str.match( new RegExp(/(##InlineDescription)[^>]+(##Description)/g) );
            let desc = str.match( new RegExp(/(##Description)[^>]+/g) );
            if (short) {
                short = short[0].substring(19, short[0].length - 13);
                short = parseHtmlAndHighlight(  short );
            }
            if (desc) {
                desc = desc[0].replace('##Methods', '').substring(13, desc[0].length );
                desc = parseHtmlAndHighlight(  desc );
            }

            return {
                short: short,
                full: desc
            };
        };

        const extractMethodsSection = ( raw ) => {

            let idx = raw.indexOf('#Methods');
            if (idx === -1) idx = raw.indexOf(codeBreak);
            if (idx === -1) return undefined;
            return raw.substring( idx, raw.length - 1);
        };


        const indexOf = (url, ext) => {
            return ( url.toLowerCase().indexOf( ext.toLowerCase() ) !== -1);
        }


        // render "page" into json...

        const renderDocument = ( entry, raw ) => {

            /*-- retrieve entry --*/

            const p = entry.path;

            /*-- process raw data --*/

            const mainStr = extractMainSection( raw );
            const methodsStr = extractMethodsSection( raw );

            const json = {
                entry: entry,
                description: extractMainDescriptions( mainStr ),
                config: parseNikolaConfig( mainStr ),
                methods: parseNikolaMethods( methodsStr ),
                document: parseHtmlAndHighlight( raw ),
                raw: raw.toString('utf8'),
                type: entry.type
            };

            return json;
        };

        const findFolderEntryChild = ( entry ) => {
            for (let i = 0; i < entry.children.length; i++ ) {
                const id = entry.children[i];
                const c = data[id];
                const match = ['index.markdown', 'introduction.markdown', 'readme.markdown', 'index.md', 'introduction.md', 'readme.md'];
                for ( let ii = 0; ii < match.length; ii++) {
                    if ( c.filename.toLowerCase().indexOf( match[ii] ) !== -1 ) return c;
                }
            }
            return null;
        }

        const findEntryFromKey = ( key, value ) => {
            let entry = undefined;
            for (let i = 0; i < data.length; i++ ) {
                const d = data[i];
                if ( d[key].toLowerCase() === value.toLowerCase() ) {
                    if (!entry) {
                        entry = d;
                        entry.siblings = [];
                    } else {
                        entry.siblings.push( d );
                    }
                }
            }
            return entry;
        }

        const addTranslations = (entry) => {
            entry.translations = {};
            ['ja', 'ko'].forEach( lang => {
                const e = findEntryFromKey('name', entry.name + '-' + lang);
                if (e) {
                    entry.translations[lang] = e;
                }
            });

        }

        const mapChildren = (e) => {
            e = JSON.parse( JSON.stringify(e) );
            return e.children.map( (e) =>  {
                let obj = JSON.parse( JSON.stringify( data[e] ) );
                if (obj.children) obj.children = obj.children.map( ee => { return JSON.parse( JSON.stringify( data[ee] ) )});
                return  obj ;
            });
        }








        let url = rawUrl.split("?")[0].split("#")[0];
        const params = queryString.parse(rawUrl.split("?")[1]);

        return new Promise( (resolve, reject) => {


            // console.log('✨ [apiUtils.js] processing:', url);

            if (url.substring(0, 2) === '/_' || url === '/sw.js' || url ==='/favicon.ico') {
                console.log(`💺 [api.js] system: ${url}`);
                resolve( { status: 600  }); 
                return;
            }

            // if (url === '/') url = '/pages/';

            if (url === '/version') {
                version().then( v => {

                    currentVersion = version.major+version.minor+version.patch;
                    resolve({
                        status: 500,
                        type: mime.lookup( 'json.json' ),
                        data: JSON.stringify(v)
                    });
                });
                return;
            }



            let entry = findEntryFromKey('path', url);
            if (!entry) entry = findEntryFromKey('path', url.substring(0,url.length-1));
            if (!entry) entry = findEntryFromKey('path', url+'/');
            let og = null;
            if (!entry) { 
                console.error('🚨 [apiUtils.js] cannot find entry', url);
                resolve( {status: 404}); 
                return ;
            }

            if (method === 'POST' && entry.type === 'page') {
                resolve( {
                    status: 500,
                    type: mime.lookup( "json.json" ),
                    data: JSON.stringify({
                        entry: entry,
                        type: entry.type
                    })
                }); 
                return;
            }





            const isFolder =  entry.type === 'folder';
            const isAsset =  entry.type === 'asset';
            const isSource =  entry.type === 'source';
            const isPage =  entry.type === 'page';

            const intro = (entry.children) ? findFolderEntryChild( entry ) : null;

            if (intro) addTranslations(intro);
            if (entry) addTranslations(entry);



            // list page...

            if (!intro && isFolder && params.as === 'json') { 
                resolve( {
                    status: 500,
                    type: mime.lookup( "json.json" ),
                    data: JSON.stringify({
                        entry: entry,
                        intro: {},
                        type: entry.type
                    })
                }); 
                return;
            } else if (isFolder) {
                og = entry;
                entry = intro;
            }


            // raw page ...

            const fs = require('fs');
            if (params.as === 'raw' || isAsset ) {

                fs.readFile( entry.absolute, (err,raw) => {
                    resolve({
                        status: 500,
                        type: mime.lookup( entry.absolute ),
                        data: raw
                    })
                });
                return;
            } else if (params.as === 'json') {


                // main json page ...

                fs.readFile( entry.absolute, (err,raw) => {

                    let payload = {};
                    if (isFolder) {
                        payload = {
                            entry: og,
                            intro: intro,
                            document: parseHtmlAndHighlight( raw.toString('utf8') ),
                            raw: raw.toString('utf8'),
                            type: og.type
                        };
                    } else if (isSource) {
                        payload = {
                            entry: entry,
                            document: highlight('cpp', raw.toString('utf8')),
                            type: entry.type
                        };
                    } else if (isPage) {
                        payload = renderDocument( entry, raw.toString('utf8') );
                    }
                    resolve({
                        status: 500,
                        type: mime.lookup( "json.json" ),
                        data: JSON.stringify( payload )
                    })
                });
                return;
            } else if (params.as === 'html') {

                fs.readFile( entry.absolute, (err,raw) => {
                    resolve({
                        status: 500,
                        type: mime.lookup( "html.html" ),
                        data: parseHtmlAndHighlight( raw.toString('utf8') )
                    })
                });
                return;
            } else {
                resolve( { status: 600 });
                return;
            }


        });


}

