import { Router } from 'express';
import { ComponentsController } from '../controllers/components';
import { validateComponent } from '../middleware/validation';
import { container } from '../container';

const router = Router();
const controller = container.resolve(ComponentsController);

// List components
router.get('/', controller.list);

// Create component
router.post('/', validateComponent, controller.create);

// Get component details
router.get('/:name', controller.getDetails);

// Get specific version
router.get('/:name/versions/:version', controller.getVersion);

export { router as componentsRouter };
