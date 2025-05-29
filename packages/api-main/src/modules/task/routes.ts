import { Router } from 'express'

import { resolvers } from '.'

import { JwtAccessTokenGuard } from '../../middleware'

const router: Router = Router()

router.get('/', [JwtAccessTokenGuard], resolvers.ListTasks)

router.get('/:task_id', [JwtAccessTokenGuard], resolvers.FindTask)

router.post('/', [JwtAccessTokenGuard], resolvers.CreateTask)

router.patch('/:task_id', [JwtAccessTokenGuard], resolvers.UpdateTask)

router.delete('/:task_id', [JwtAccessTokenGuard], resolvers.DeleteTask)

export { router }
