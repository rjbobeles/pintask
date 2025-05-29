import { Router } from 'express'

import { resolvers } from '.'

import { JwtAccessTokenGuard, JwtRefreshTokenGuard } from '../../middleware'

const router: Router = Router()

router.get('/', [JwtAccessTokenGuard], resolvers.ListSessions)

router.post('/logout', [JwtAccessTokenGuard], resolvers.LogoutSession)

router.post('/refresh', [JwtRefreshTokenGuard], resolvers.RefreshSession)

router.post('/revoke/:session_id', [JwtAccessTokenGuard], resolvers.RevokeSession)

export { router }
