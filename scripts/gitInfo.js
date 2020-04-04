
module.exports = {
    getLastModified = ( absolute ) => {
        try {
            const d = path.resolve( path.dirname( absolute ) );
            const b = path.basename( absolute );
            const p = `echo "$( cd "${d}" && git log -1 --format="%at" -- "${b}")"`;
            exec(p, (error, stdout, stderr) => {
                console.log('>>>>>>>>>>', d, stdout, error);
                if (error) {
                    console.log(`error: ${error.message}`);
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
                if (stdout) {
                    console.log('WOOOOOO', stdout);
                }
            });
        } catch(err) {
            full.date = null;
        }
    }

}


