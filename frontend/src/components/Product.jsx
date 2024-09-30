import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productSlice';
import PropTypes from 'prop-types';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import { addItemsToCart } from '../redux/api/cartApiService'; // Pastikan ini sesuai dengan path yang benar
import Tag from './Tag';

const Product = ({ formatPrice }) => {
  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector((state) => state.product);
  
  const [animatedButton, setAnimatedButton] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, status]);


  const handleAddToCart = async (product, quantity) => {
    console.log("Adding to cart:", { productId: product._id, quantity }); // Debug log
    try {
      const response = await addItemsToCart([{ product: { productId: product._id, quantity } }]);
      console.log('Response dari API:', response); // Log response dari API
      dispatch(fetchCartForCurrentUserThunk());
    } catch (error) {
      console.error("Failed to add items to cart:", error);
    }
  };
  






  const handleButtonClick = (product, quantity, buttonId, event) => {
    event.stopPropagation(); // Prevent the click from propagating to the row

    setAnimatedButton(buttonId); // Trigger animation
    setTimeout(() => {
      setAnimatedButton(null); // Reset animation class after duration
    }, 300); // Duration of animation

    handleAddToCart(product, quantity);
  };

  return (
    <div className="">
      <div className="">
        <div className="" >
          <Tag />
        </div>
      </div>

      <div className="-mt-[18px] mb-40">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {status === 'succeeded' && (
          <table className="min-w-full shadow-lg rounded-lg overflow-hidden text-md">
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={`${
                    animatedButton === `${product._id}-1` ||
                    animatedButton === `${product._id}-5` ||
                    animatedButton === `${product._id}-10`
                      ? 'bg-warna3op5'
                      : 'hover:bg-warna2'
                  } transition-colors duration-300`}
                >
                  <td className="border-b pl-4 pt-4 pb-4 border-gray-200">
                    {/* Gambar produk atau placeholder */}
                    {product.image ? (
                      <img
                        src={`http://localhost:5151${product.image}`}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-600 font-bold rounded-md border border-gray-300">
                        {/* Dua huruf pertama dari nama produk */}
                        {product.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-2 px-4 border-b border-gray-200 font-semibold text-">
                    <div>
                      <div>{product.name}</div>
                      <div className="text-gray-500">{formatPrice(product.wholesale_price)}</div>
                    </div>
                  </td>
                  
                  <td className="border-b border-gray-200">
                    <div className="flex space-x-2 justify-center text-white font-semibold">
                      <button
                        onClick={(e) => handleButtonClick(product, 1, `${product._id}-1`, e)}
                        className={`bg-warna3 shadow-md  p-2 rounded-md transition-all duration-300 ${
                          animatedButton === `${product._id}-1` ? 'animate-enlarge' : ''
                        }`}
                      >
                        +1
                      </button>
                      
                      <button
                        onClick={(e) => handleButtonClick(product, 5, `${product._id}-5`, e)}
                        className={`bg-warna3 shadow-md p-2 rounded-md transition-all duration-300 ${
                          animatedButton === `${product._id}-5` ? 'animate-enlarge' : ''
                        }`}
                      >
                        +5
                      </button>
                      <button
                        onClick={(e) => handleButtonClick(product, 10, `${product._id}-10`, e)}
                        className={`bg-warna3 shadow-md  p-2 rounded-md transition-all duration-300 ${
                          animatedButton === `${product._id}-10` ? 'animate-enlarge' : ''
                        }`}
                      >
                        +10
                      </button>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

Product.propTypes = {
  formatPrice: PropTypes.func.isRequired,
};

export default Product;
