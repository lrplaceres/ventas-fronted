import { auth } from "auth";

export const middleware = auth;

export const config = { matcher: ["/","/kiosko/:path*","/producto/:path*","/inventario/:path*","/distribucion/:path*","/venta/:path*","/usuario/:path*"] };