import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // console.log(request, "req");
  const currentUser = request.cookies.get("currentUser")?.value;
  // console.log(currentUser, "current user");

  if (!currentUser && !request.nextUrl.pathname.startsWith("/login")) {
    console.log("test 1");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (currentUser && request.nextUrl.pathname.startsWith("/login")) {
    console.log("test 2");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"], // Adjust this based on your routes
};
