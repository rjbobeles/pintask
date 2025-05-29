import { Router } from 'express'

import { resolvers } from '.'

import { JwtAccessTokenGuard } from '../../middleware'

const router: Router = Router()

router.get('/profile', [JwtAccessTokenGuard], resolvers.FindProfile)

export { router }
