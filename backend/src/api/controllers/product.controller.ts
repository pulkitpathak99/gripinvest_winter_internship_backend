// backend/src/api/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedProduct = await productService.updateProduct(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
  async generateDescription(req: Request, res: Response) {
    try {
      const { description } = await productService.generateAIDescription(req.body);
      res.json({ description });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate description' });
    }
  }
}
