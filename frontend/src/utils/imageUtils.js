/**
 * Resolves the image URL for a course.
 * @param {Object} course - The course object.
 * @returns {string} - The resolved image URL.
 */
export const resolveImageUrl = (path, fallback = "") => {
    if (!path || typeof path !== "string") return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("data:image/")) return path;

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const serverRoot = apiBase.replace(/\/api\/?$/, "");

    // Fix: Treat /images as frontend static assets, not backend
    if (path.startsWith("/images/")) return path;

    if (path.startsWith("/")) return `${serverRoot}${path}`;
    return `${serverRoot}/${path}`;
};

export const getCourseImageUrl = (course) => {
    if (!course) return 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=MentriQ';

    // 1. If thumbnailUrl exists and is a full URL (e.g. from Cloudinary or external), usage it.
    // Also covers the case where the backend server URL is already prepended.
    if (course.thumbnailUrl && course.thumbnailUrl.startsWith("http")) {
        return course.thumbnailUrl;
    }

    // 2. If it's a relative path starting with /uploads (standard local upload)
    // We assume the variable VITE_API_BASE_URL is something like 'http://localhost:5000/api'
    // We need to strip '/api' to get the base server root 'http://localhost:5000'
    if (course.thumbnailUrl && course.thumbnailUrl.startsWith("/")) {
        return resolveImageUrl(course.thumbnailUrl, 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=MentriQ');
    }


    // 3. Fallback to local assets if we have a slug and it matches a local file convention
    // Note: Dynamic imports like this in Vite need specific handling or glob imports.
    // For safety/simplicity in this specific project context where they used:
    // new URL(`/src/assets/courses/${course.slug}.jpg`, import.meta.url).href
    // We will try to preserve that behavior, but wrapped safely.
    try {
        if (course.slug) {
            return new URL(`/src/assets/courses/${course.slug}.jpg`, import.meta.url).href;
        }
    } catch {
        // console.warn("Failed to resolve local asset", e);
    }

    // 4. Ultimate fallback
    return 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=MentriQ';
};
