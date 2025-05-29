import { Router } from 'express'

import { resolvers } from '.'

const router: Router = Router()

router.post('/sign_in', resolvers.SignIn)

router.post('/sign_up', resolvers.SignUp)

export { router }
