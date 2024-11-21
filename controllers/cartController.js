import User from "../models/userModel.js";




// Add to Cart
export const addToCart = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity, price } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const existingProduct = user.cart.find(item => item.productId === productId);
    if (existingProduct) {
      return res.status(200).json({ message: "Product is already in the cart", cart: user.cart });
    } else {
      user.cart.push({ productId, quantity, price });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    next(error);
  }
};


// Update Cart
export const updateCart = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the cart
    const productIndex = user.cart.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the product
    user.cart[productIndex].quantity = quantity;

    // Save the updated cart
    await user.save();
    res.status(200).json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    next(error);
  }
};



// Remove from Cart
export const removeFromCart = async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the product from the cart
    user.cart = user.cart.filter(item => item.productId !== productId);

    // Save the updated cart
    await user.save();
    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    next(error);
  }
};



// Get Cart
export const getCart = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
};
