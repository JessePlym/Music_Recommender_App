import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware"

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://music-recommender-app.vercel.app"]
  : ["http://localhost:3000"]
export function Middleware(request: NextRequest) {

  const origin = request.headers.get("origin")

  if (origin && !allowedOrigins.includes(origin) || !origin) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "text/plain"
      }
    })
  }
}
// export const config = {
//   matcher: ["/", "/preferences", "/api"]
// }