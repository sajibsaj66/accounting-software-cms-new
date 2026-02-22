import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    const publicRoutes = ["/"];
    const protectedRoutes = ["/dashboard", "/users", "/reports", "/customers", "/settings", "/sales-visits"];

    const isPublic = publicRoutes.includes(pathname);
    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // ❌ Not logged in → trying to access protected route
    if (!token && isProtected) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    // ❌ Logged in → trying to access root or login
    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}