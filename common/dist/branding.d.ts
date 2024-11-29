export interface MastheadBrand {
    src: string;
    alt: string;
    height: string;
}
export interface MastheadTitle {
    text: string;
    heading?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}
export interface BrandingStrings {
    application: {
        title: string;
        name?: string;
        description?: string;
    };
    about: {
        displayName: string;
        imageSrc?: string;
        documentationUrl?: string;
    };
    masthead: {
        leftBrand?: MastheadBrand;
        leftTitle?: MastheadTitle;
        rightBrand?: MastheadBrand;
    };
}
export declare const brandingStrings: BrandingStrings;
/**
 * Return the `node_modules/` resolved path for the branding assets.
 */
export declare const brandingAssetPath: () => string;
//# sourceMappingURL=branding.d.ts.map