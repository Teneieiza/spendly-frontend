import { NextRequest, NextResponse } from 'next/server'

export type Middleware = (
  req: NextRequest,
) => NextResponse | void | Promise<NextResponse | void>

export function composeMiddlewares(middlewares: Middleware[]) {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(req)
      if (result) {
        return result
      }
    }

    return NextResponse.next()
  }
}
