import { Router } from 'express'

import { DeviceIdGuard } from './middleware'
import * as modules from './modules'

const router: Router = Router()

router.use('/auth', [DeviceIdGuard], modules.UserAuthentication.router)

router.use('/session', [DeviceIdGuard], modules.UserSession.router)

router.use('/user', [DeviceIdGuard], modules.User.router)

export { router }
