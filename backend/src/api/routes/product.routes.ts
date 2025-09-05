// backend/src/api/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validation/product.validation';

const router = Router();
const productController = new ProductController();

// GET /api/products - All logged-in users
router.get('/', authMiddleware, productController.getAllProducts.bind(productController));

// GET /api/products/:id - Single product
router.get('/:id', authMiddleware, productController.getProductById.bind(productController));

// POST /api/products - Admin only
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createProductSchema),
  productController.createProduct.bind(productController)
);

// PUT /api/products/:id - Admin only
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateProductSchema),
  productController.updateProduct.bind(productController)
);

// DELETE /api/products/:id - Admin only
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct.bind(productController)
);

export default router;
