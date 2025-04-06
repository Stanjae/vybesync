//middleware.ts

//import { NextRequest } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"
 
// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware() {
  // Your custom middleware logic goes here
  //console.error(req)
})