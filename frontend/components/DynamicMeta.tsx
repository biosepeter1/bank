'use client';

import { DynamicTitle } from './DynamicTitle';
import { DynamicFavicon } from './DynamicFavicon';

/**
 * Client-side wrapper component that handles dynamic page metadata
 * (title and favicon) based on site settings.
 * Used in the root layout to provide dynamic meta for all pages.
 */
export function DynamicMeta() {
    return (
        <>
            <DynamicTitle />
            <DynamicFavicon />
        </>
    );
}
