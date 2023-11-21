import { auth } from "auth";

export const middleware = auth;

export const config = { matcher: ["/","/kiosko/:path*","/producto/:path*","/inventario/:path*","/venta/:path*","/usuario/:path*"] };