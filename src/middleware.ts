import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware"

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://music-recommender-app.vercel.app"]
  : ["http://localhost:3000", "https://music-recommender-app.vercel.app"]
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
  const res = NextResponse.next()

  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', allowedOrigins[0])
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}
// export const config = {
//   matcher: ["/", "/preferences", "/api"]
// }