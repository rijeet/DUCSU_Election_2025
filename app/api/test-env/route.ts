export async function GET() {
  return Response.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    MONGODB_DB: process.env.MONGODB_DB ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    ADMIN_API_KEY: process.env.ADMIN_API_KEY ? 'Set' : 'Not set',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ? 'Set' : 'Not set'
  });
}
