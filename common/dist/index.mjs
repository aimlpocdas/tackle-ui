/**
 * Keys in `KonveyorEnvType` that are only used on the server and therefore do not
 * need to be sent to the client.
 */
const SERVER_ENV_KEYS = [
    "PORT",
    "KEYCLOAK_SERVER_URL",
    "TACKLE_HUB_URL",
    "BRANDING",
];
/**
 * Create a `KonveyorEnv` from a partial `KonveyorEnv` with a set of default values.
 */
const buildKonveyorEnv = ({ NODE_ENV = "production", PORT, VERSION = "99.0.0", MOCK = "off", KEYCLOAK_SERVER_URL, AUTH_REQUIRED = "false", KEYCLOAK_REALM = "tackle", KEYCLOAK_CLIENT_ID = "tackle-ui", UI_INGRESS_PROXY_BODY_SIZE = "500m", RWX_SUPPORTED = "true", TACKLE_HUB_URL, BRANDING, } = {}) => ({
    NODE_ENV,
    PORT,
    VERSION,
    MOCK,
    KEYCLOAK_SERVER_URL,
    AUTH_REQUIRED,
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID,
    UI_INGRESS_PROXY_BODY_SIZE,
    RWX_SUPPORTED,
    TACKLE_HUB_URL,
    BRANDING,
});
/**
 * Default values for `KonveyorEnvType`.
 */
const KONVEYOR_ENV_DEFAULTS = buildKonveyorEnv();
/**
 * Current `@konveyor-ui` environment configurations from `process.env`.
 */
const KONVEYOR_ENV = buildKonveyorEnv(process.env);

const proxyMap = {
    "/auth": {
        target: KONVEYOR_ENV.KEYCLOAK_SERVER_URL || "http://localhost:9001",
        logLevel: process.env.DEBUG ? "debug" : "info",
        changeOrigin: true,
        onProxyReq: (proxyReq, req, _res) => {
            // Keycloak needs these header set so we can function in Kubernetes (non-OpenShift)
            // https://www.keycloak.org/server/reverseproxy
            //
            // Note, on OpenShift, this works as the haproxy implementation
            // for the OpenShift route is setting these for us automatically
            //
            // We saw problems with including the below broke the OpenShift route
            //  {"X-Forwarded-Proto", req.protocol} broke the OpenShift
            //  {"X-Forwarded-Port", req.socket.localPort}
            //  {"Forwarded", `for=${req.socket.remoteAddress};proto=${req.protocol};host=${req.headers.host}`}
            // so we are not including even though they are customary
            //
            req.socket.remoteAddress &&
                proxyReq.setHeader("X-Forwarded-For", req.socket.remoteAddress);
            req.socket.remoteAddress &&
                proxyReq.setHeader("X-Real-IP", req.socket.remoteAddress);
            req.headers.host &&
                proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
        },
    },
    "/hub": {
        target: KONVEYOR_ENV.TACKLE_HUB_URL || "http://localhost:9002",
        logLevel: process.env.DEBUG ? "debug" : "info",
        changeOrigin: true,
        pathRewrite: {
            "^/hub": "",
        },
        onProxyReq: (proxyReq, req, _res) => {
            // Add the Bearer token to the request if it is not already present, AND if
            // the token is part of the request as a cookie
            if (req.cookies?.keycloak_cookie && !req.headers["authorization"]) {
                proxyReq.setHeader("Authorization", `Bearer ${req.cookies.keycloak_cookie}`);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            const includesJsonHeaders = req.headers.accept?.includes("application/json");
            if ((!includesJsonHeaders && proxyRes.statusCode === 401) ||
                (!includesJsonHeaders && proxyRes.statusMessage === "Unauthorized")) {
                res.redirect("/");
            }
        },
    },
    "/kai": {
        target: KONVEYOR_ENV.TACKLE_HUB_URL || "http://localhost:9002",
        logLevel: process.env.DEBUG ? "debug" : "info",
        changeOrigin: true,
        pathRewrite: {
            "^/kai": "/services/kai",
        },
        onProxyReq: (proxyReq, req, _res) => {
            // Add the Bearer token to the request if it is not already present, AND if
            // the token is part of the request as a cookie
            if (req.cookies?.keycloak_cookie && !req.headers["authorization"]) {
                proxyReq.setHeader("Authorization", `Bearer ${req.cookies.keycloak_cookie}`);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            const includesJsonHeaders = req.headers.accept?.includes("application/json");
            if ((!includesJsonHeaders && proxyRes.statusCode === 401) ||
                (!includesJsonHeaders && proxyRes.statusMessage === "Unauthorized")) {
                res.redirect("/");
            }
        },
    },
};

const strings = {
  application: {
    title: 'App Decomposer',
    name: 'App Decomposer',
    description: 'App Decomposer'
  },
  about: {
    displayName: 'App Decomposer',
    imageSrc: 'branding/images/header.png',
    documentationUrl: 'https://konveyor.github.io/konveyor/'
  },
  masthead: {
    leftBrand: {
      src: 'branding/images/jioma-logo.png',
      alt: 'brand',
      height: '60px'
    },
    leftTitle: null,
    rightBrand: null
  }
};

// Note: Typescript will look at the `paths` definition to resolve this import
//       to a stub JSON file.  In the next rollup build step, that import will
//       be replaced by the rollup virtual plugin with a dynamically generated
//       JSON import with the actual branding information.
const brandingStrings = strings;
/**
 * Return the `node_modules/` resolved path for the branding assets.
 */
const brandingAssetPath = () => require
    .resolve("@konveyor-ui/common/package.json")
    .replace(/(.)\/package.json$/, "$1") + "/dist/branding";

/**
 * Return a base64 encoded JSON string containing the given `env` object.
 */
const encodeEnv = (env, exclude) => {
    const filtered = exclude
        ? Object.fromEntries(Object.entries(env).filter(([key]) => !exclude.includes(key)))
        : env;
    return btoa(JSON.stringify(filtered));
};
/**
 * Return an objects from a base64 encoded JSON string.
 */
const decodeEnv = (env) => !env ? undefined : JSON.parse(atob(env));
// TODO: Include `index.html.ejs` to `index.html` template file processing...

export { KONVEYOR_ENV, KONVEYOR_ENV_DEFAULTS, SERVER_ENV_KEYS, brandingAssetPath, brandingStrings, buildKonveyorEnv, decodeEnv, encodeEnv, proxyMap };
//# sourceMappingURL=index.mjs.map
