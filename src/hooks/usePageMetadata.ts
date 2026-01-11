import { useEffect, useRef } from "react";
import { DEFAULT_METADATA } from "@/constants/metadata";

interface PageMetadata {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
}

export const usePageMetadata = ({
    title,
    description,
    image,
    url,
    type,
    keywords,
}: PageMetadata) => {
    const metadata = useRef({
        title: title || DEFAULT_METADATA.title,
        description: description || DEFAULT_METADATA.description,
        image: image || DEFAULT_METADATA.image,
        url: url || window.location.href,
        type: type || DEFAULT_METADATA.type,
        keywords: keywords || "",
    });

    // Update ref if props change
    useEffect(() => {
        metadata.current = {
            title: title || DEFAULT_METADATA.title,
            description: description || DEFAULT_METADATA.description,
            image: image || DEFAULT_METADATA.image,
            url: url || window.location.href,
            type: type || DEFAULT_METADATA.type,
            keywords: keywords || "",
        };
    }, [title, description, image, url, type, keywords]);

    useEffect(() => {
        const { title, description, image, url, type, keywords } = metadata.current;

        // Update Title
        document.title = title;

        // Helper to update meta tags
        const updateMeta = (selector: string, attribute: string, value: string) => {
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement("meta");
                // Parse selector to attribute
                if (selector.startsWith('meta[name="')) {
                    element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
                } else if (selector.startsWith('meta[property="')) {
                    element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
                }
                document.head.appendChild(element);
            }
            element.setAttribute(attribute, value);
        };

        // Update Meta Tags
        updateMeta('meta[name="description"]', "content", description);
        if (keywords) {
            updateMeta('meta[name="keywords"]', "content", keywords);
        } else {
            const el = document.querySelector('meta[name="keywords"]');
            if (el) el.setAttribute("content", "");
        }

        // Open Graph
        updateMeta('meta[property="og:title"]', "content", title);
        updateMeta('meta[property="og:description"]', "content", description);
        updateMeta('meta[property="og:image"]', "content", image);
        updateMeta('meta[property="og:url"]', "content", url);
        updateMeta('meta[property="og:type"]', "content", type);

        // Twitter metadata updates if specific tags were used in index.html
        // The DEFAULT_METADATA does not have twitterCard here, but we can add it or use a default
        updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");
        updateMeta('meta[name="twitter:title"]', "content", title);
        updateMeta('meta[name="twitter:description"]', "content", description);
        updateMeta('meta[name="twitter:image"]', "content", image);

        return () => {
            // Restore defaults on cleanup
            document.title = DEFAULT_METADATA.title;
            updateMeta('meta[name="description"]', "content", DEFAULT_METADATA.description);
            const el = document.querySelector('meta[name="keywords"]');
            if (el) el.setAttribute("content", "");

            updateMeta('meta[property="og:title"]', "content", DEFAULT_METADATA.title);
            updateMeta('meta[property="og:description"]', "content", DEFAULT_METADATA.description);
            updateMeta('meta[property="og:image"]', "content", DEFAULT_METADATA.image);
            updateMeta('meta[property="og:type"]', "content", DEFAULT_METADATA.type);

            updateMeta('meta[name="twitter:title"]', "content", DEFAULT_METADATA.title);
            updateMeta('meta[name="twitter:description"]', "content", DEFAULT_METADATA.description);
            updateMeta('meta[name="twitter:image"]', "content", DEFAULT_METADATA.image);
        };
    }, [title, description, image, url, type, keywords]);
};
