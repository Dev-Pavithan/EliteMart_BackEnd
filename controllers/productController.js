import Product from "../models/productModel.js";
import cloudinary from "cloudinary";
import multer from 'multer';


// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

// Seller - Create a new product
export const createProduct = async (req, res) => {
  // Use Multer middleware to handle the file upload
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    try {
      // Extract form data from the request body
      const { sellerId, category, description, price, quantity } = req.body;

      // Convert `quantity` and `price` to numbers for proper validation
      const numericQuantity = parseInt(quantity, 10);
      const numericPrice = parseFloat(price);

      // Validate required fields
      if (
        !sellerId ||
        !category ||
        !description ||
        isNaN(numericPrice) ||
        isNaN(numericQuantity) ||
        !req.file
      ) {
        return res.status(400).json({ message: "All fields are required, including quantity and image" });
      }

      // Create a new product instance
      const newProduct = new Product({
        sellerId,
        category,
        description,
        price: numericPrice,
        quantity: numericQuantity,
        image: req.file.path, // Store the file path in the database
      });

      // Save the product to the database
      const savedProduct = await newProduct.save();

      // Respond with success
      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).json({ message: "Server error while creating product" });
    }
  });
};




// Seller - Get all products by sellerId
export const getProductsBySellerId = async (req, res, next) => {
  const { sellerId } = req.params;

  try {
    // Find products with the matching sellerId
    const products = await Product.find({ sellerId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this seller" });
    }

    res.status(200).json(products);
  } catch (error) {
    next(error); 
  }
};


// Seller - Update product
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { category, description, price, state, quantity } = req.body;

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Allow updates only for specific fields
    if (state) product.state = state;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity != null) {
      if (quantity < 0) {
        return res.status(400).json({ message: "Quantity cannot be negative" });
      }
      product.quantity = quantity;
    }

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (error) {
    next(error);
  }
};





// Seller - Delete product
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOneAndDelete({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

// Admin - Approve or Reject a product
// Admin - Approve or Reject a Product (Simplified)
export const approveRejectProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { action } = req.query; // action can be 'approve' or 'reject'

  // Validate action from query
  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Use ?action=approve or ?action=reject" });
  }

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product state based on the action
    product.state = action === "approve" ? "Approved" : "Rejected";
    const updatedProduct = await product.save();

    res.status(200).json({ 
      message: `Product ${action}d successfully`,
      product: updatedProduct 
    });
  } catch (error) {
    console.error("Error approving/rejecting product:", error.message);
    next(error);
  }
};

// Admin - Get all products (to approve/reject)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// User - Get all approved products
export const getAllApprovedProducts = async (req, res, next) => {
  try {
    // Find all products where the state is 'Approved'
    const products = await Product.find({ state: 'Approved' });

    // Return the approved products
    res.status(200).json(products);
  } catch (error) {
    next(error); 
  }
};

export const getPackagesByCategory = async (req, res, next) => {
  const { category } = req.params;
  const { role, sellerId } = req.user; 

  try {
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    let query = { category }; // Base query: filter by category

    if (role === "admin") {
      // Admin sees all products in the category, regardless of state
      console.log(`Admin fetching products for category: ${category}`);
    } else if (role === "seller") {
      // Sellers see only their own products in the category
      query.sellerId = sellerId;
      console.log(`Seller ${sellerId} fetching products for category: ${category}`);
    } else if (role === "user") {
      // Users see only approved products in the category
      query.state = "Approved";
      console.log(`User fetching approved products for category: ${category}`);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // Fetch products based on the query
    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    next(error);
  }
};




// Get product details by productId
export const getProductById = async (req, res, next) => {
  const { productId } = req.params; 

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" }); 
    }

    res.status(200).json(product); 
  } catch (error) {
    next(error); 
  }
};
