/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{ hostname: 'xiprhyfoewutdniuhvwi.supabase.co' }, { hostname: "img.clerk.com" }]
    }
}

module.exports = nextConfig
