const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const addItemsToCart = async (req, res) => {
  const { 
    items = [],
    additionalItems,
    note,
    discount,
    discountText,
    customer 
  } = req.body; 
  const userId = req.user.id;

  try {
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    let customerData;

    if (customer && customer.id) {
      customerData = await User.findById(customer.id);
      if (!customerData) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    } else {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      customerData = {
        name: user.name || 'Unknown Customer',
        id: user._id
      };
    }

    let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, customer: customerData, items: [] });

    cart.customer = customerData;

    let subTotal = 0;

    for (const item of items) {
      const { productId, quantity } = item.product;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      const itemTotalPrice = product.wholesale_price * quantity;

      const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.name === product.name);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].product.quantity += quantity;
        cart.items[existingItemIndex].product.totalPriceProduct += itemTotalPrice;
      } else {
        cart.items.push({
          product: {
            price: product.wholesale_price,
            name: product.name,
            quantity: quantity,
            totalPriceProduct: itemTotalPrice
          }
        });
      }
      subTotal += itemTotalPrice;
    }

    if (additionalItems && Array.isArray(additionalItems)) {
      for (const additionalItem of additionalItems) {
        const { price, name, quantity } = additionalItem.product;

        if (price == null || name == null || quantity == null) {
          return res.status(400).json({ message: 'All additional item fields are required' });
        }

        const additionalTotalPrice = price * quantity;
        subTotal += additionalTotalPrice;

        cart.additionalItems.push({
          product: {
            price: price,
            name: name,
            quantity: quantity,
            totalPriceProduct: additionalTotalPrice
          }
        });
      }
    }

    // Update total cart
    cart.subTotal = subTotal;
    cart.totalPrice = subTotal - (discount !== undefined ? discount : 0);
    cart.totalProduct = cart.items.length + (additionalItems ? additionalItems.length : 0);
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

    // Cek dan update catatan
    const invalidNotes = ["", "0", ".", ",", "aa", "bb"];
    if (invalidNotes.includes(note)) {
      cart.note = ""; // Kosongkan note jika invalid
    } else {
      cart.note = note; // Simpan note jika valid
    }
    
    cart.discount = discount !== undefined ? discount : cart.discount;
    cart.discountText = discountText || cart.discountText;

    // Simpan keranjang
    await cart.save();

    res.status(201).json({
      message: 'Items added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error adding items to cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate({
      path: 'items.product',
      select: 'price name'
    });

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findById(id).populate({
      path: 'items.product',
      select: 'price name'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCartByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'price name quantity totalPriceProduct'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const editCartById = async (req, res) => {
  const { id } = req.params;
  const { items, note, discount, discountText, additionalItems, customerName } = req.body;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update customerName if provided
    if (customerName) {
      const customer = await User.findOne({ name: customerName });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      cart.customer.name = customer.name;
      cart.customer.id = customer._id;
    }

    // Update items if provided
    if (items) {
      cart.items = []; // Clear existing items
      let subTotal = 0;

      for (const item of items) {
        if (!item.product) {
          return res.status(400).json({ message: 'Product information is missing' });
        }

        const { productId, quantity, name } = item.product; // Ambil nama produk dari request

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }

        const itemTotalPrice = product.wholesale_price * quantity;

        // Update nama produk jika disediakan
        cart.items.push({
          product: {
            price: product.wholesale_price,
            name: name || product.name, // Gunakan nama dari request jika ada, jika tidak gunakan nama yang ada di database
            quantity: quantity,
            totalPriceProduct: itemTotalPrice
          }
        });
        subTotal += itemTotalPrice;
      }

      cart.subTotal = subTotal;
      cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);
      cart.totalProduct = cart.items.length;
    }

    // Update other fields if provided
    if (note !== undefined) cart.note = note;
    if (discount !== undefined) {
      if (discount < 0) {
        return res.status(400).json({ message: 'Discount cannot be negative' });
      }
      cart.discount = discount;
    }
    if (discountText !== undefined) cart.discountText = discountText;

    // Update additionalItems if provided
    if (additionalItems && Array.isArray(additionalItems)) {
      cart.additionalItems = []; // Clear existing additionalItems
      for (const additionalItem of additionalItems) {
        const { price, name, quantity } = additionalItem.product;

        if (price == null || name == null || quantity == null) {
          return res.status(400).json({ message: 'All additional item fields are required' });
        }

        const additionalTotalPrice = price * quantity;

        cart.additionalItems.push({
          product: {
            price: price,
            name: name,
            quantity: quantity,
            totalPriceProduct: additionalTotalPrice
          }
        });
      }
    }

    // Update totalPrice based on subTotal and discount
    cart.totalPrice = cart.subTotal - (cart.discount || 0);

    // Save changes
    await cart.save();

    res.status(200).json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

const editCartItemById = async (req, res) => {
  const { cartId, itemId } = req.params;
  const { productId, name, quantity, price } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Temukan item dalam cart berdasarkan ID item
    let item = cart.items.id(itemId) || cart.additionalItems.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update item
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      item.product.name = name || product.name;
      item.product.price = price || product.wholesale_price;
    } else {
      if (name) item.product.name = name;
      if (price !== undefined) {
        if (price < 0) {
          return res.status(400).json({ message: 'Price cannot be negative.' });
        }
        item.product.price = price;
      }
    }

    if (quantity !== undefined) {
      if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1.' });
      }
      item.product.quantity = quantity;
    }

    item.product.totalPriceProduct = item.product.price * item.product.quantity;

    // Update total cart
    cart.subTotal = cart.items.reduce((acc, item) => acc + (item.product.totalPriceProduct || 0), 0) +
                    cart.additionalItems.reduce((acc, item) => acc + (item.product.totalPriceProduct || 0), 0);

    cart.discount = cart.discount || 0;
    cart.totalPrice = cart.subTotal - cart.discount;

    // Hitung totalQuantity
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + (item.product.quantity || 0), 0) + 
                         cart.additionalItems.reduce((acc, item) => acc + (item.product.quantity || 0), 0);

    await cart.save();

    return res.status(200).json({ message: 'Item updated successfully', cart });
  } catch (error) {
    console.error('Error updating item in cart:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};



const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Kosongkan items, additionalItems, dan reset lainnya
    cart.items = [];
    cart.additionalItems = []; // Mengosongkan additionalItems juga
    cart.subTotal = 0;
    cart.totalPrice = 0;
    cart.totalProduct = 0;
    cart.totalQuantity = 0;
    cart.discount = 0; // Reset diskon
    cart.discountText = ''; // Reset teks diskon
    cart.note = ''; // Reset catatan

    // Simpan perubahan pada keranjang
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message || error });
  }
};

const deleteItemFromCart = async (req, res) => {
  const { cartId, itemId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Temukan indeks item yang ingin dihapus dari items
    const itemIndexInItems = cart.items.findIndex(item => item._id.toString() === itemId);
    
    // Temukan indeks item yang ingin dihapus dari additionalItems
    const itemIndexInAdditionalItems = cart.additionalItems.findIndex(item => item._id.toString() === itemId);

    if (itemIndexInItems > -1) {
      cart.items.splice(itemIndexInItems, 1);
    } else if (itemIndexInAdditionalItems > -1) {
      cart.additionalItems.splice(itemIndexInAdditionalItems, 1);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update total quantity dan total price
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0) + cart.additionalItems.reduce((acc, item) => acc + item.product.quantity, 0);
    cart.totalProduct = cart.items.length + cart.additionalItems.length;

    // Hitung subtotal dan total harga setelah penghapusan item
    cart.subTotal = cart.items.reduce((acc, item) => acc + item.product.totalPriceProduct, 0) + cart.additionalItems.reduce((acc, item) => acc + (item.product.price * item.product.quantity), 0);
    cart.totalPrice = cart.subTotal - (cart.discount || 0);

    // Simpan perubahan pada keranjang
    await cart.save();

    res.status(200).json({
      message: 'Item deleted from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




module.exports = {
  addItemsToCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  deleteCartById,
  editCartById,
  clearCart,
  deleteItemFromCart,
  editCartItemById
};
