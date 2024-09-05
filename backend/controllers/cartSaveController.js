const CartSave = require('../models/cartSaveModel');
const Cart = require('../models/cartModel');

// Save Cart
const saveCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' });
    }

    if (
      !cart.items.length || 
      cart.totalProduct === 0 || 
      cart.totalQuantity === 0 || 
      cart.subTotal === 0 || 
      cart.totalPrice === 0
    ) {
      return res.status(400).json({ message: 'Cart is empty, unable to save' });
    }

    // Hitung subTotal dan totalPrice secara manual
    const subTotal = cart.items.reduce((acc, item) => acc + item.product.totalPriceProduct, 0);
    const totalPrice = subTotal + (cart.additionalPrice || 0) - (cart.discount || 0);

    const cartSave = new CartSave({
      user: userId,
      items: cart.items,
      totalProduct: cart.totalProduct,
      totalQuantity: cart.totalQuantity,
      note: cart.note,
      discount: cart.discount,
      additionalText: cart.additionalText,
      additionalPrice: cart.additionalPrice,
      subTotal: subTotal,
      totalPrice: totalPrice,
      customer: cart.customer // Simpan customer ID dan name
    });

    await cartSave.save();

    await Cart.findOneAndUpdate(
      { user: userId },
      {
        items: [],
        totalProduct: 0,
        totalQuantity: 0,
        note: '',
        discount: 0,
        additionalText: '',
        additionalPrice: 0,
        subTotal: 0,
        totalPrice: 0,
        customer: { name: 'Pelanggan Setia', id: null } // Reset customer
      }
    );

    res.status(201).json({ message: 'Cart saved successfully', cartSave });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Load Cart
const loadCart = async (req, res) => {
  const { id } = req.params;  // ID dari saveCart yang ingin di-load
  const userId = req.user.id;  // ID dari user yang sedang login

  try {
    // Cari cart yang disimpan berdasarkan ID
    const cartSave = await CartSave.findById(id);

    if (!cartSave) {
      return res.status(404).json({ message: 'Saved cart not found' });
    }

    // Cari cart aktif berdasarkan user ID
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' });
    }

    // Update cart aktif dengan data dari saveCart
    cart.items = cartSave.items;
    cart.totalProduct = cartSave.totalProduct;
    cart.totalQuantity = cartSave.totalQuantity;
    cart.note = cartSave.note;
    cart.discount = cartSave.discount;
    cart.additionalText = cartSave.additionalText;
    cart.additionalPrice = cartSave.additionalPrice;
    cart.subTotal = cartSave.subTotal;
    cart.totalPrice = cartSave.totalPrice;
    cart.customer = cartSave.customer; // Update customer juga

    // Simpan perubahan ke cart aktif
    await cart.save();

    // Hapus cart yang disimpan setelah berhasil dimuat ke cart aktif
    await CartSave.findByIdAndDelete(id);

    res.status(200).json({ message: 'Cart loaded and updated successfully', cart });
  } catch (error) {
    console.error('Error loading cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete SaveCart
const deleteSaveCart = async (req, res) => {
  const { id } = req.params; // ID dari saveCart yang ingin dihapus

  try {
    // Cari dan hapus cart yang disimpan berdasarkan ID
    const cartSave = await CartSave.findByIdAndDelete(id);

    if (!cartSave) {
      return res.status(404).json({ message: 'Saved cart not found' });
    }

    res.status(200).json({ message: 'Saved cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All SaveCarts
const getAllSaveCarts = async (req, res) => {
  const userId = req.user.id; // ID dari user yang sedang login

  try {
    // Cari semua cart yang disimpan oleh user
    const saveCarts = await CartSave.find({ user: userId });

    // Hitung jumlah cart yang disimpan
    const saveCartCount = saveCarts.length;

    res.status(200).json({ 
      saveCartCount,
      saveCarts
    });
  } catch (error) {
    console.error('Error getting all saved carts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get SaveCart by ID
const getSaveCartById = async (req, res) => {
  const { id } = req.params; // ID dari saveCart yang ingin diambil

  try {
    // Cari cart yang disimpan berdasarkan ID
    const cartSave = await CartSave.findById(id);

    if (!cartSave) {
      return res.status(404).json({ message: 'Saved cart not found' });
    }

    res.status(200).json({ cartSave });
  } catch (error) {
    console.error('Error getting saved cart by ID:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export controller functions
module.exports = {
  saveCart,
  loadCart,
  deleteSaveCart,
  getAllSaveCarts,
  getSaveCartById
};
