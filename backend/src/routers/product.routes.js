import { Router } from 'express'
import { handleCreateProduct, handleGetProducts, handleGetSellerProducts, handleGetRelatedProduct, handleEditProduct, handleEditVarient } from '../controller/product.controller.js';
import { authUserMiddleware } from '../middleware/auth.middleware.js';
import { productValidation } from '../validators/product.validator.js';
import multer from 'multer'

const productRouter = Router();

const upload = multer({
 storage: multer.memoryStorage(),
 limits: { fileSize: 7 * 1024 * 1024 }
});

productRouter.post('/list-product', authUserMiddleware, upload.array('product', 7), productValidation, handleCreateProduct)

productRouter.get('/', handleGetProducts);

productRouter.get('/seller', authUserMiddleware, handleGetSellerProducts);

productRouter.post('/seller/product/:productId', authUserMiddleware, upload.array('product', 4), handleEditProduct);

productRouter.put('/seller/product/:productId/variants',authUserMiddleware,upload.any(),handleEditVarient);

productRouter.get(`/product/:productId`, handleGetRelatedProduct);

export default productRouter;