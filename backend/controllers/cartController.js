// const Cart = require('../models/cartModel');
// const Product = require('../models/productModel');
// const { v4: uuidv4 } = require('uuid');

// // Add items to cart
// // Add items to cart
// const addItemsToCart = async (req, res) => {
//   const { items, note, discount, additionalText, additionalPrice } = req.body;
//   const userId = req.user.id;

//   try {
//     // Cari cart berdasarkan user ID
//     let cart = await Cart.findOne({ user: userId });

//     // Jika cart tidak ada, buat cart baru untuk user tersebut
//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // Reset subTotal sebelum menghitung ulang
//     let subTotal = 0;

//     // Loop melalui cart items yang ada sebelumnya
//     cart.items.forEach(item => {
//       subTotal += item.product.totalPriceProduct;
//     });

//     // Loop untuk item baru yang ditambahkan
//     for (const item of items) {
//       const { productId, quantity } = item;

//       // Mencari produk berdasarkan ID
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: `Product with ID ${productId} not found` });
//       }

//       const price = product.wholesale_price;
//       const itemTotalPrice = price * quantity;

//       const newCartItem = {
//         product: {
//           price: price,
//           name: product.name,
//           quantity: quantity,
//           totalPriceProduct: itemTotalPrice
//         }
//       };

//       // Cek apakah produk sudah ada di cart
//       const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.name === product.name);

//       if (existingItemIndex > -1) {
//         // Update quantity dan total price jika produk sudah ada di cart
//         cart.items[existingItemIndex].product.quantity += quantity;
//         cart.items[existingItemIndex].product.totalPriceProduct += itemTotalPrice;
//       } else {
//         // Tambahkan item baru ke cart jika belum ada
//         cart.items.push(newCartItem);
//       }

//       // Tambahkan harga produk baru ke subTotal
//       subTotal += itemTotalPrice;
//     }

//     // Update total jumlah produk dan total quantity
//     const totalProduct = cart.items.length;
//     const totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

//     // Update nilai lainnya dalam cart, hanya jika ada di request
//     cart.note = note !== undefined ? note : cart.note;
//     cart.discount = discount !== undefined ? discount : cart.discount;
//     cart.additionalText = additionalText !== undefined ? additionalText : cart.additionalText;
//     cart.additionalPrice = additionalPrice !== undefined ? additionalPrice : cart.additionalPrice;
//     cart.subTotal = subTotal;
//     cart.totalPrice = subTotal - cart.discount + cart.additionalPrice;
//     cart.totalProduct = totalProduct;
//     cart.totalQuantity = totalQuantity;

//     // Simpan perubahan ke database
//     await cart.save();

//     // Kirim respons sukses
//     res.status(201).json({
//       message: 'Items added to cart successfully',
//       cart
//     });
//   } catch (error) {
//     console.error('Error adding items to cart:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };



// // Get all carts
// const getAllCarts = async (req, res) => {
//   try {
//     const carts = await Cart.find().populate({
//       path: 'items.product',
//       select: 'wholesale_price'
//     });

//     res.status(200).json(carts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Get cart by ID
// const getCartById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const cart = await Cart.findById(id).populate({
//       path: 'items.product',
//       select: 'wholesale_price'
//     });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Get cart by user ID
// const getCartByUser = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const cart = await Cart.findOne({ user: userId }).populate({
//       path: 'items.product',
//       select: 'price name quantity totalPriceProduct'
//     });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const formattedCartItems = cart.items.map(item => ({
//       ...item.toObject(),
//       product: {
//         name: item.product.name,
//         price: item.product.price,
//         quantity: item.product.quantity,
//         totalPriceProduct: item.product.totalPriceProduct
//       }
//     }));

//     res.status(200).json({
//       ...cart.toObject(),
//       items: formattedCartItems
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Delete cart by ID
// const deleteCartById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const cart = await Cart.findByIdAndDelete(id);
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     res.status(200).json({ message: 'Cart deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Edit cart by ID
// const editCartById = async (req, res) => {
//   const { id } = req.params;
//   const { items, note = '', discount = 0, additionalText = '', additionalPrice = 0 } = req.body;

//   try {
//     const cart = await Cart.findById(id);
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     let subTotal = 0;

//     // Kosongkan item yang ada sebelumnya
//     cart.items = [];

//     for (const item of items) {
//       const { productId, quantity } = item;

//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: `Product with ID ${productId} not found` });
//       }

//       const price = product.wholesale_price;
//       const itemTotalPrice = price * quantity;

//       const newCartItem = {
//         product: {
//           price: price,
//           name: product.name,
//           quantity: quantity,
//           totalPriceProduct: itemTotalPrice // Sesuaikan dengan schema
//         }
//       };

//       cart.items.push(newCartItem);
//       subTotal += itemTotalPrice;
//     }

//     // Update total jumlah produk dan total quantity
//     const totalProduct = cart.items.length;
//     const totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

//     // Update nilai lainnya dalam cart
//     cart.note = note;
//     cart.discount = discount;
//     cart.additionalText = additionalText;
//     cart.additionalPrice = additionalPrice;
//     cart.subTotal = subTotal;
//     cart.totalPrice = subTotal - discount + additionalPrice;
//     cart.totalProduct = totalProduct;
//     cart.totalQuantity = totalQuantity;

//     // Simpan perubahan
//     await cart.save();

//     res.status(200).json({
//       message: 'Cart updated successfully',
//       cart
//     });
//   } catch (error) {
//     console.error('Error updating cart:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };


// // Clear cart items by user ID
// // Clear cart items by user ID
// const clearCart = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // Cari cart aktif berdasarkan user ID
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // Cek apakah cart kosong (tidak ada items atau totalnya 0)
//     if (
//       !cart.items.length || 
//       cart.totalProduct === 0 || 
//       cart.totalQuantity === 0 || 
//       cart.subTotal === 0 || 
//       cart.totalPrice === 0
//     ) {
//       return res.status(400).json({ message: 'Cart is already empty' });
//     }

//     // Kosongkan items dalam cart
//     cart.items = [];
//     cart.subTotal = 0;
//     cart.totalPrice = 0;
//     cart.totalProduct = 0;
//     cart.totalQuantity = 0;
//     cart.note = '';
//     cart.discount = 0;
//     cart.additionalText = '';
//     cart.additionalPrice = 0;

//     // Simpan perubahan ke database
//     await cart.save();

//     res.status(200).json({ message: 'Cart cleared successfully', cart });
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };






// // Export controller functions
// module.exports = {
//   addItemsToCart,
//   getCartByUser,
//   getAllCarts,
//   getCartById,
//   deleteCartById,
//   editCartById,
//   clearCart
// };


const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { v4: uuidv4 } = require('uuid');

// Add items to cart
const addItemsToCart = async (req, res) => {
  const { items, note, discount, additionalText, additionalPrice, customerName } = req.body;
  const userId = req.user.id;

  try {
    // Cari cart berdasarkan user ID
    let cart = await Cart.findOne({ user: userId });

    // Jika cart tidak ada, buat cart baru untuk user tersebut
    if (!cart) {
      cart = new Cart({ user: userId, items: [], customerName: customerName || 'Pelanggan Setia' });
    } else {
      // Jika customerName tidak diisi, gunakan nama yang ada di cart
      cart.customerName = customerName || cart.customerName;
    }

    // Reset subTotal sebelum menghitung ulang
    let subTotal = 0;

    // Loop melalui cart items yang ada sebelumnya
    cart.items.forEach(item => {
      subTotal += item.product.totalPriceProduct;
    });

    // Loop untuk item baru yang ditambahkan
    for (const item of items) {
      const { productId, quantity } = item;

      // Mencari produk berdasarkan ID
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
        // Tambahkan item baru ke cart jika belum ada
        cart.items.push(newCartItem);
      }

      // Tambahkan harga produk baru ke subTotal
      subTotal += itemTotalPrice;
    }

    // Update total jumlah produk dan total quantity
    const totalProduct = cart.items.length;
    const totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

    // Update nilai lainnya dalam cart, hanya jika ada di request
    cart.note = note !== undefined ? note : cart.note;
    cart.discount = discount !== undefined ? discount : cart.discount;
    cart.additionalText = additionalText !== undefined ? additionalText : cart.additionalText;
    cart.additionalPrice = additionalPrice !== undefined ? additionalPrice : cart.additionalPrice;
    cart.subTotal = subTotal;
    cart.totalPrice = subTotal - cart.discount + cart.additionalPrice;
    cart.totalProduct = totalProduct;
    cart.totalQuantity = totalQuantity;

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

// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate({
      path: 'items.product',
      select: 'wholesale_price'
    });

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get cart by ID
const getCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findById(id).populate({
      path: 'items.product',
      select: 'wholesale_price'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get cart by user ID
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

// Delete cart by ID
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

// Edit cart by ID
const editCartById = async (req, res) => {
  const { id } = req.params;
  const { items, note = '', discount = 0, additionalText = '', additionalPrice = 0, customerName } = req.body;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

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
          totalPriceProduct: itemTotalPrice // Sesuaikan dengan schema
        }
      };

      cart.items.push(newCartItem);
      subTotal += itemTotalPrice;
    }

    // Update total jumlah produk dan total quantity
    const totalProduct = cart.items.length;
    const totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

    // Update nilai lainnya dalam cart
    cart.note = note;
    cart.discount = discount;
    cart.additionalText = additionalText;
    cart.additionalPrice = additionalPrice;
    cart.subTotal = subTotal;
    cart.totalPrice = subTotal - discount + additionalPrice;
    cart.totalProduct = totalProduct;
    cart.totalQuantity = totalQuantity;

    // Update customerName jika diberikan
    cart.customerName = customerName || cart.customerName;

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

// Clear cart items by user ID
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

    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
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
