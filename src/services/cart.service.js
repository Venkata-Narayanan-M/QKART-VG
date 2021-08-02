const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { use } = require("passport");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  let userEmail = user.email;
  const cartData = await Cart.findOne({ email: userEmail });

  if (!cartData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't have a cart");
  }
  return cartData;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  let cartUpdated = false;
  //Check if product exist in DB, and if not throw error
  let productDetails = await Product.findById(productId).exec();
  if (!productDetails)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );

  //Forming a product item to be added to cart
  let newItem = {
    product: productDetails,
    quantity: quantity,
  };

  //Form a cart object using given data
  let objCart = {
    email: user.email,
    cartItems: newItem,
  };

  //Check if user already has a cart
  const userCart = await Cart.findOne({ email: user.email });

  if (!userCart) {
    try {
      let newCart = await Cart.create(objCart);
      return newCart;
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error creating cart"
      );
    }
  } else {
    userCart.cartItems.forEach((item) => {
      if (item.product._id == productId) {
        cartUpdated = true;
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Product already in cart. Use the cart sidebar to update or remove product from cart"
        );
      }
    });

    if (cartUpdated === false) {
      userCart.cartItems.push(newItem);
    }

    await userCart.save();
    return userCart;
  }
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  let cartUpdated = false;
  let productDetails = await Product.findById(productId).exec();
  if (!productDetails)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );

  const userCart = await getCartByUser(user);

  if (!userCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a cart. Use POST to create cart and add a product"
    );
  } else {
    userCart.cartItems.forEach((item) => {
      if (item.product._id == productId) {
        item.quantity = quantity;
        cartUpdated = true;
      }
    });
    if (cartUpdated === false) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
    }
    await userCart.save();
  }
  return userCart;
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  let idxToDelete = -1;
  const userCart = await Cart.findOne({ email: user.email });

  if (!userCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a cart. Use POST to create cart and add a product"
    );
  } else {
    userCart.cartItems.forEach((item, index) => {
      if (item.product._id == productId) {
        idxToDelete = index;
      }
    });
    if (idxToDelete === -1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
    } else {
      userCart.cartItems.splice(idxToDelete, 1);
    }
    await userCart.save();
  }
};

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  const userCart = await Cart.findOne({ email: user.email });
  let totalCost = 0;

  if (!userCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't have a cart");
  }
  if (userCart.cartItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No products in user cart. Add products before checkout"
    );
  }

  userCart.cartItems.forEach((item) => {
    totalCost += item.product.cost * item.quantity;
  });

  if (totalCost > user.walletMoney) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
  }

  if (await user.hasSetNonDefaultAddress()) {
    user.walletMoney = user.walletMoney - totalCost;
    userCart.cartItems = [];
    await user.save();
    await userCart.save();
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Set a valid address to checkout"
    );
  }
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
