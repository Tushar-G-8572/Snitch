import productModel from "../models/product.model.js";
import { storeImage } from "../services/ImagekitService/storage.service.js";

export async function handleCreateProduct(req, res) {
  try {

    const { id, role } = req.user;
    if (role !== "Seller") {
      return res.status(403).json({ success: false, message: "Unauthorised" })
    }
    const { title, description, priceAmount, priceCurrency } = req.body
    console.log(title, description, priceAmount, priceCurrency)
    const images = await Promise.all(req.files.map(async (file) => {
      return await storeImage(file)
    }))

    const productData = await productModel.create({
      title,
      description,
      price: {
        amount: Number(priceAmount),
        currency: priceCurrency
      },
      images,
      seller: id
    })

    return res.status(201).json({ success: true, message: "Product lists successfully", products: productData })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error while listing Product" })
  }

}

export async function handleGetProducts(req, res) {

  try {
    const products = await productModel.find().lean()
    if (!products) return res.status(200).json({ success: true, message: "Products not listed" })
    return res.status(200).json({ success: true, message: "Products fetched", products: products })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while getting Products" });
  }

}

export async function handleGetSellerProducts(req, res) {
  try {

    const { id, role } = req.user;
    if (role !== 'Seller') {
      return res.status(403).json({ success: false, message: "Unauthorised" });
    }

    const products = await productModel.find({ seller: id }).lean();
    if (!products) return res.status(400).json({ success: false, message: "No Products Found" });

    return res.status(200).json({ success: true, message: "Product fetched", products: products })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while getting seller Products" });
  }
}

export async function handleGetRelatedProduct(req, res) {
  try {

    const { productId } = req.params;
    if (!productId) {
      return res.status(404).json({ success: false, message: "No Products found" });
    }
    const productDetail = await productModel.findById(productId);
    return res.status(200).json({ success: true, message: "Product fetched", products: productDetail })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Error while getting Product" })
  }
}

export async function handleEditProduct(req, res) {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;

    // console.log("req.body:", req.body);
    // console.log("req.files:", req.files);
    // console.log("productId:", productId);


    const product = await productModel.findOne({ _id: productId, seller: sellerId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let images = [];
    if (req.body.existingImages) {
      const existing = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      images = existing.map(url => ({ url }));
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(file => storeImage(file))
      );
      // storeImage returns a url string — wrap it to match your schema {url: string}
      images = [...images, ...uploadedImages.map(img => ({ url: img.url }))];
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: {
        amount: Number(req.body.priceAmount),
        currency: req.body.priceCurrency,
      },
      images,
    };


    product.title = req.body.title;
    product.description = req.body.description;
    product.price.amount = Number(req.body.priceAmount);
    product.price.currency = req.body.priceCurrency;
    product.images = images;

    await product.save();

    return res.status(201).json({ success: true, message: "Product updated", product });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while editing product" });
  }
}

export async function handleEditVarient(req, res) {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;

    // ── Find and save ──
    const product = await productModel.findOne({ _id: productId, seller: sellerId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ── Parse variants from FormData ──
    if (!req.body.variants) {
      return res.status(400).json({ success: false, message: "No variants data provided" });
    }

    const parsedVariants = JSON.parse(req.body.variants);

    // ── Build variants with uploaded images ──
    const varients = await Promise.all(
      parsedVariants.map(async (v, vi) => {

        // Preserve existing images
        let variantImages = (
          Array.isArray(v.existingImages) ? v.existingImages :
            v.existingImages ? [v.existingImages] : []
        ).map(url => ({ url }));

        // Upload new images for this variant
        const variantFiles = req.files?.filter(f => f.fieldname === `variantImages_${vi}`) || [];
        if (variantFiles.length > 0) {
          const uploaded = await Promise.all(variantFiles.map(f => storeImage(f)));
          variantImages = [...variantImages, ...uploaded.map(img => ({ url: img.url }))];
        }

        return {
          stock: Number(v.stock) || 0,
          price: {
            amount: v.priceAmount ? Number(v.priceAmount) : undefined,
            currency: v.priceCurrency || 'INR',
          },
          attributes: v.attributes, // plain object { Size: 'XL', Color: 'Red' }
          images: variantImages,
        };
      })
    );



    product.varients = varients;
    await product.save();

    return res.status(201).json({ success: true, message: "Variants updated", product });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while editing variants" });
  }
}

