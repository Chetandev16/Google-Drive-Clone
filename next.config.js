/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{ hostname: 'xiprhyfoewutdniuhvwi.supabase.co' }]
    }
}

module.exports = nextConfig
