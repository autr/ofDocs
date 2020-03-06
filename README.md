# ofDocs

[View ofDocs](https://ofdocs.autr.tv)

ofDocs mirrors a list of files and folders into a website using Nuxt and Vue. Currently it is set up to serve documentation from ofSite, READMEs and code from the OpenFrameworks repository, and optionally user-installed addons. 

When running locally, an API middleware reads files and folders into structured JSON, which are server-side rendered by Nuxt.

### Running locally

```
yarn run dev
```

### Static website

ofDocs is currently dependent on a future release of Nuxt.js [[feat/target-2](https://github.com/nuxt/nuxt.js/tree/feat/target-2)], included at the `/nuxt.js` root. To generate a static-website to the `docs` folder (used by Github Pages):

```
yarn run generate
```

By default GH Pages resolves to a /ofDocs domain, which will break the Nuxt SSR implementation. This can be cicumvented by giving the GH Page a domain name, ie. ofdocs.autr.tv
