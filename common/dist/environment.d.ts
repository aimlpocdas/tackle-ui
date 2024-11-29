/** Define process.env to contain `KonveyorEnvType` */
declare global {
    namespace NodeJS {
        interface ProcessEnv extends Partial<Readonly<KonveyorEnvType>> {
        }
    }
}
/**
 * The set of environment variables used by `@konveyor-ui` packages.
 */
export type KonveyorEnvType = {
    NODE_ENV: "development" | "production" | "test";
    VERSION: string;
    /** Controls how mock data is injected on the client */
    MOCK: string;
    /** Enable RBAC authentication/authorization */
    AUTH_REQUIRED: "true" | "false";
    /** SSO / Keycloak realm */
    KEYCLOAK_REALM: string;
    /** SSO / Keycloak client id */
    KEYCLOAK_CLIENT_ID: string;
    /** UI upload file size limit in megabytes (MB), suffixed with "m" */
    UI_INGRESS_PROXY_BODY_SIZE: string;
    /** Allow clearing local maven artifact repository? Requires availability of RWX volumes for hub. */
    RWX_SUPPORTED: "true" | "false";
    /** The listen port for the UI's server */
    PORT?: string;
    /** Target URL for the UI server's `/auth` proxy */
    KEYCLOAK_SERVER_URL?: string;
    /** Target URL for the UI server's `/hub` proxy */
    TACKLE_HUB_URL?: string;
    /** Location of branding files (relative paths computed from the project source root) */
    BRANDING?: string;
};
/**
 * Keys in `KonveyorEnvType` that are only used on the server and therefore do not
 * need to be sent to the client.
 */
export declare const SERVER_ENV_KEYS: string[];
/**
 * Create a `KonveyorEnv` from a partial `KonveyorEnv` with a set of default values.
 */
export declare const buildKonveyorEnv: ({ NODE_ENV, PORT, VERSION, MOCK, KEYCLOAK_SERVER_URL, AUTH_REQUIRED, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID, UI_INGRESS_PROXY_BODY_SIZE, RWX_SUPPORTED, TACKLE_HUB_URL, BRANDING, }?: Partial<KonveyorEnvType>) => KonveyorEnvType;
/**
 * Default values for `KonveyorEnvType`.
 */
export declare const KONVEYOR_ENV_DEFAULTS: KonveyorEnvType;
/**
 * Current `@konveyor-ui` environment configurations from `process.env`.
 */
export declare const KONVEYOR_ENV: KonveyorEnvType;
//# sourceMappingURL=environment.d.ts.map