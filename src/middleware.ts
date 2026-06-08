import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const role = req.nextauth.token?.role;
        const pathname = req.nextUrl.pathname;

        if(pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
            return NextResponse.next();
        }

        if(pathname.startsWith("/vendor") && role !== "vendor") {
            return NextResponse.redirect(new URL("/host", req.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ req, token}) => {
                const pathname = req.nextUrl.pathname;
                if(pathname.startsWith("/vendor") || pathname.startsWith("/bookings")) {
                    return !!token;
                }
                return true;
            }
        }
    }
);

export const config = {
    mathcer: [
        "/vendor/:path*",
        "/bookings/:path*"
    ]
}