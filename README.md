# ofDocs

[ofDocs](https://github.com/Autr/ofDocs) is an alternative documentation, examples and code browser for [openFrameworks](https://openframeworks.cc/), which mirrors a list of files and folders into a website using Nuxt and Vue. Currently it is set up to serve documentation from ofSite, READMEs and code from the [openFrameworks repository](https://github.com/openframeworks/openFrameworks), and optionally [user-installed addons](https://ofxaddons.com). 

When running ofDocs locally, changes to markdown files can be made from within the app and viewed instantly. A static version can be also generated using Nuxt. The structure of files and folders will are parsed into HTML and JSON that can be hosted on a standard LAMP server, or on Github Pages:

### [View ofDocs (static)](https://ofdocs.autr.tv)
### [View Github](https://github.com/autr/ofdocs)

---

### Installation

```
cd openFrameworks
git clone https://github.com/openframeworks/ofSite # documentation
git clone https://github.com/autr/ofDocs
```

Install [Node](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/en/docs/install), then run:

```
yarn install
```

### Running development server

```
yarn run dev
```

### Generate static website

ofDocs is currently dependent on a [future release of Nuxt](https://github.com/nuxt/nuxt.js/tree/feat/target-2), which is included at the `/nuxt.js` root. To install the dependencies:

```
cd nuxt.js
yarn install
yarn run build
cd ../
```

And to generate a static version of the website into the `docs` folder (used by Github Pages):

```
yarn run generate
```

### Github pages

By default Github Pages resolves to a `/ofDocs` domain path, which will break the Nuxt routing. This can be cicumvented by giving the Github Page a domain name, ie. [ofdocs.autr.tv](https://ofdocs.autr.tv)

### Configuration

All files and directories used by ofDocs can be set from within `docs.config.js`. By default only openFrameworks core addons will be listed, but can be changed to include all addons by swapping the `ofCoreAddons` variable for `allAddons`.