const CartSummary = ({ cart, handleClearCart, handleSaveCart, handlePayment }) => {
    const formatPrice = (price) => `Rp. ${price.toLocaleString('id-ID')}`;
  
    return (
      <>
        <div className="flex space-x-12 text-center mb-3 text-black drop-shadow-md">
          <div className="bg-white w-full rounded-md font-semibold p-1">Jenis: {cart.totalProduct || 0} item</div>
          <div className="bg-white w-full rounded-md font-semibold p-1">Total: {cart.totalQuantity || 0} item</div>
        </div>
  
        {(cart.note || cart.discount > 0) && (
          <div className="mt-2 bg-white p-2 rounded-xl mb-2">
            <div className="flex justify-between items-center">
              <p>Total Sementara:</p>
              <span>{formatPrice(cart.subTotal || 0)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className='w-[230px] break-words'>
                  Diskon: {cart.discountText}
                </span>
                <span>- {formatPrice(cart.discount)}</span>
              </div>
            )}
          </div>
        )}
  
        <div className="bg-white drop-shadow-md font-semibold p-2 rounded-xl mb-2 text-center">
          <span>Total: {formatPrice(cart.totalPrice || 0)}</span>
        </div>
  
        {cart.note && (
          <div className="bg-white p-2 rounded-xl mb-2 text-left">
            <span>Catatan: {cart.note}</span>
          </div>
        )}
  
        <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center font-semibold">
          <button onClick={handleClearCart} className="bg-warna2 text-gray-800 w-[70px] p-2 rounded-md">Hapus</button>
          <button onClick={handleSaveCart} className="bg-warna3 w-[120px] text-white p-2 rounded-md">Simpan</button>
          <button onClick={handlePayment} className="bg-warna1 w-[180px] text-white p-2 rounded-md">Bayar</button>
        </div>
      </>
    );
  };
  
  export default CartSummary;
  