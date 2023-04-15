import mongoose from "mongoose";
import {productsModel} from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";

class ProductFileManager{
    async getProducts(){
        try{
            const products = productsModel.find();
            return products;
        } catch(err){
            throw err;
        }
    }
    async getProductId(id){
        try{
            const product = productsModel.find({_id: id});
            return product;
        } catch(err){
            throw err;
        }
    }
}

class CartFileManager{

}

export {ProductFileManager};
export const CartsFM = CartFileManager;