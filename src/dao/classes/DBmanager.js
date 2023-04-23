import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";

class ProductFileManager {
  async getProducts() {
    try {
      const products = productsModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductId(id) {
    try {
      const product = productsModel.find({ _id: id });
      return product;
    } catch (err) {
      throw err;
    }
  }
  async addProduct(newProduct) {
    try {
      const product = productsModel.create(newProduct);
      return product;
    } catch (err) {
      throw err;
    }
  }
    async updateProduct(id, body) {
    try {
      const product= await productsModel.findOneAndUpdate({ _id: id }, body,{new:true,upsert:true});
      return product;   
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      await productsModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

class CartFileManager {
  async getCarts() {
    try {
      const carts = cartsModel.find();
      return carts;
    } catch (err) {
      throw err;
    }
  }
  async getCartId(id) {
    try {
      const cart = cartsModel.find({ _id: id });
      return cart;
    } catch (err) {
      throw err;
    }
  }
  async addCart(newProduct) {
    try {
      const cart = cartsModel.create(newProduct);
      return cart;
    } catch (err) {
      throw err;
    }
  }
  async updateCart(id, body) {
    try {
      const cart= await cartsModel.updateOne({ _id: id }, body);
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async deleteCart(id) {
    try {
      await cartsModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

export const ProductFM = new ProductFileManager();
export const CartFM = new CartFileManager();
