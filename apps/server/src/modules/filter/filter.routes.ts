import { FastifyInstance } from 'fastify';
import { FilterController } from './filter.controller.js';


export async function filterRoutes(app: FastifyInstance) {
  // Try to use auth middleware if it's standard in this project, else omit
  // Assuming requireAuth hook is used in other modules. Wait, let me check other modules.
  
  // Query & Validation
  app.post('/query', FilterController.query);
  app.post('/validate', FilterController.validate);

  // Saved Filters
  app.post('/saved', FilterController.createSavedFilter);
  app.get('/saved', FilterController.getSavedFilters);
  app.patch('/saved/:id', FilterController.updateSavedFilter);
  app.delete('/saved/:id', FilterController.deleteSavedFilter);

  // Saved Views
  app.post('/views', FilterController.createSavedView);
  app.get('/views', FilterController.getSavedViews);
  app.patch('/views/:id', FilterController.updateSavedView);
  app.delete('/views/:id', FilterController.deleteSavedView);
}
