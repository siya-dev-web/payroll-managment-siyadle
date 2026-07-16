/**
 * Next.js rewrites so that requests to `/api/*` are proxied to the backend
 * during development. This makes cookies same-origin and avoids CORS issues.
 */

module.exports = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};
