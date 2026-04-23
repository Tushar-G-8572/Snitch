import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";


export async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const ItemDetails = req.body; // contains imageId, quantity, attributes, price
        const varientId = ItemDetails.variantId

        let product;
        if (varientId) {
            product = await productModel.findOne({
                _id: productId,
                "varients._id": varientId,
            });
        }
        else {
            product = await productModel.findOne({ _id: productId });
        }

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Find the specific variant
        let selectedVarient;
        if (varientId) {
            selectedVarient = product.varients.find(
                (v) => v._id.toString() === varientId
            );

            if (!selectedVarient) {
                return res.status(404).json({ success: false, message: "Variant not found" });
            }
        }
        const cartItem = {
            userId,
            productId,
            varientId,
            title: product.title,
            image: selectedVarient?.images[0].url || product.images[0].url,
            quantity: ItemDetails.quantity,
            attributes: ItemDetails.attributes,  // { color: 'Black', Size: 'XXl' }
            price: ItemDetails.price,
        };

        const cart = (await cartModel.findOne({ user: userId })) || (await cartModel.create({
            user: userId,
        }))

        const isProductInCart = cart.items.some(
            item => item.product.toString() === cartItem.productId
                && item.varient?.toString() === cartItem.varientId  // was item.variant
        )

        if (isProductInCart) {
            const quantityInCart = cart.items.find(item => item.product.toString() === cartItem.productId && item.varient?.toString() === cartItem.varientId).quantity
            if (quantityInCart + cartItem.quantity > selectedVarient.stock) {
                return res.status(400).json({
                    message: `Only ${selectedVarient.stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                    success: false
                })
            }

            await cartModel.findOneAndUpdate(
                { user: userId, "items.product": cartItem.productId, "items.varient": cartItem?.varientId },
                { $inc: { "items.$.quantity": ItemDetails.quantity } },
                { new: true }
            )

            return res.status(200).json({
                message: "Cart updated successfully",
                success: true,
                cartItem
            })

        }

        if (cartItem.quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${selectedVarient.stock} items left in stock`,
                success: false
            })
        }

        cart.items.push({
            product: cartItem.productId,
            varient: cartItem?.varientId || cartItem.productId,
            quantity: cartItem.quantity,
            price: {
                amount: ItemDetails.price?.amount || ItemDetails.price
            }
        })

        await cart.save()

        return res.status(200).json({
            success: true,
            message: "Item added in cart",
            cartItem,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "Error while adding Items in Cart" });
    }
}

export async function getAddToCartProduct(req, res) {
    try {

        const userId = req.user.id;

        const cart = await cartModel
            .findOne({ user: userId })
            .populate({
                path: "items.product",
                select: "images",   // pick only what you need
            })
            .populate({
                path: "items.product.varients",
                select: "images",
            });

        if (!cart) {
            return res.status(200).json({ success: true, message: "Your cart is Empty" })
        }
        console.log(cart);
        return res.status(201).json({ success: true, message: "Cart Items, fetched", cart })


    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Error while getting cart Items" });
    }
}