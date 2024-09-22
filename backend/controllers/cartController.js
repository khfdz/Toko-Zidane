const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel'); // Import model user

const addItemsToCart = async (req, res) => {
  const { items, note, discount, additionalText, additionalPrice, customer } = req.body;
  const userId = req.user.id;

  try {
    // Jika customer disertakan dalam request body, gunakan data tersebut
    let customerData = customer;
    if (customerData) {
      // Validasi customer ID jika diberikan
      if (customerData.id) {
        const existingCustomer = await User.findById(customerData.id);
        if (!existingCustomer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
      }
    } else {
      // Jika customer tidak disertakan, cari customer berdasarkan user ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      customerData = {
        name: user.name || 'Pelanggan Setia',
        id: user._id
      };
    }

    // Cari cart berdasarkan user ID
    let cart = await Cart.findOne({ user: userId });

    // Jika cart tidak ada, buat cart baru
    if (!cart) {
      cart = new Cart({
        user: userId,
        customer: customerData,
        items: []
      });
    } else {
      // Update customer di cart
      cart.customer = customerData;
    }

    // Proses menambahkan items ke cart dan menghitung subtotal
    let subTotal = 0;
    for (const item of items) {
      const { productId, quantity } = item;

      // Cari produk berdasarkan ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      const price = product.wholesale_price;
      const itemTotalPrice = price * quantity;

      const newCartItem = {
        product: {
          price: price,
          name: product.name,
          quantity: quantity,
          totalPriceProduct: itemTotalPrice
        }
      };

      // Cek apakah produk sudah ada di cart
      const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.name === product.name);

      if (existingItemIndex > -1) {
        // Update quantity dan total price jika produk sudah ada di cart
        cart.items[existingItemIndex].product.quantity += quantity;
        cart.items[existingItemIndex].product.totalPriceProduct += itemTotalPrice;
      } else {
        // Tambahkan item baru ke cart
        cart.items.push(newCartItem);
      }

      // Tambahkan harga produk ke subtotal
      subTotal += itemTotalPrice;
    }

    // Update total harga dan jumlah item
    cart.subTotal = subTotal;
    cart.totalPrice = subTotal - (discount || 0) + (additionalPrice || 0);
    cart.totalProduct = cart.items.length;
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);
    cart.note = note || cart.note;
    cart.discount = discount || cart.discount;
    cart.additionalText = additionalText || cart.additionalText;
    cart.additionalPrice = additionalPrice || cart.additionalPrice;

    // Simpan perubahan ke database
    await cart.save();

    // Kirim respons sukses
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

    const formattedCartItems = cart.items.map(item => ({
      ...item.toObject(),
      product: {
        name: item.product.name,
        price: item.product.price,
        quantity: item.product.quantity,
        totalPriceProduct: item.product.totalPriceProduct
      }
    }));

    res.status(200).json({
      ...cart.toObject(),
      items: formattedCartItems
    });
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
  const { items, note, discount, additionalText, additionalPrice, customerName } = req.body;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update customerName jika diberikan
    if (customerName !== undefined) {
      const customer = await User.findOne({ name: customerName });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      cart.customer.name = customer.name;
      cart.customer.id = customer._id;
    }

    // Jika items ada dalam request, update items dan subtotal
    if (items !== undefined) {
      let subTotal = 0;

      // Kosongkan item yang ada sebelumnya
      cart.items = [];

      for (const item of items) {
        const { productId, quantity } = item;

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }

        const price = product.wholesale_price;
        const itemTotalPrice = price * quantity;

        const newCartItem = {
          product: {
            price: price,
            name: product.name,
            quantity: quantity,
            totalPriceProduct: itemTotalPrice
          }
        };

        cart.items.push(newCartItem);
        subTotal += itemTotalPrice;
      }

      // Update total jumlah produk dan total quantity
      const totalProduct = cart.items.length;
      const totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

      // Update nilai lainnya dalam cart
      cart.note = note || cart.note;
      cart.discount = discount || cart.discount;
      cart.additionalText = additionalText || cart.additionalText;
      cart.additionalPrice = additionalPrice || cart.additionalPrice;
      cart.subTotal = subTotal;
      cart.totalPrice = subTotal - (discount || 0) + (additionalPrice || 0);
      cart.totalProduct = totalProduct;
      cart.totalQuantity = totalQuantity;
    }

    // Simpan perubahan
    await cart.save();

    res.status(200).json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Cari cart aktif berdasarkan user ID
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Cek apakah cart kosong (tidak ada items atau totalnya 0)
    if (
      !cart.items.length ||
      (cart.subTotal === 0 && cart.totalQuantity === 0 && cart.totalProduct === 0)
    ) {
      return res.status(400).json({ message: 'Cart is already empty' });
    }

    // Kosongkan cart items
    cart.items = [];
    cart.subTotal = 0;
    cart.totalPrice = 0;
    cart.totalProduct = 0;
    cart.totalQuantity = 0;

    // Simpan perubahan
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
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
  clearCart
};
