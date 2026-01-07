import { composeMiddlewares } from '@/middlewares/compose.middleware'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { redirectMiddleware } from '@/middlewares/redirect.middleware'

export default composeMiddlewares([authMiddleware, redirectMiddleware])

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
