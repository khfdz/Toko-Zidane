import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productSlice';
import { addItemsToCartThunk, fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import Tag from './Tag';

const Product = () => {
  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector((state) => state.product);
  
  const [selectedRow, setSelectedRow] = useState(null);
  const buttonRefs = useRef({}); // Reference for buttons

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, status]);

  const handleAddToCart = (product, quantity) => {
    dispatch(addItemsToCartThunk([{ productId: product._id, quantity }]))
      .then(() => {
        dispatch(fetchCartForCurrentUserThunk());
      });
  };

  const handleButtonClick = (product, quantity, buttonId, event) => {
    event.stopPropagation(); // Prevent the click from propagating to the row

    const button = buttonRefs.current[buttonId];
    if (button) {
      // Apply zoom-in animation to the button
      button.classList.add('animate-zoom-in');
      setTimeout(() => {
        button.classList.remove('animate-zoom-in');
      }, 300); // Durasi zoom-in

      // Trigger row hover effect
      setSelectedRow(product._id);
      setTimeout(() => {
        setSelectedRow(null);
      }, 300); // Durasi hover
    }

    handleAddToCart(product, quantity);
  };

  return (
    <div className="">
      <div className="">
        <div className="">
          <Tag />
        </div>
      </div>

      <div className="-mt-[18px]">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {status === 'succeeded' && (
          <table className="min-w-full shadow-lg rounded-lg overflow-hidden text-md mb-40">
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={`${
                    selectedRow === product._id ? 'bg-warna3op5' : 'hover:bg-warna3op3'
                  }`}
                >
                  <td className="border-b pl-4 pt-4 pb-4 border-gray-200">
                    <img
                      src={`http://localhost:5151${product.image}`}
                      alt={product.name}
                      className="w-14 object-cover rounded-md -ml-1 -mr-4 cursor-pointer"
                      onClick={(e) => e.stopPropagation()} // Prevent click on image from affecting the row
                    />
                  </td>

                  <td className="py-2 px-4 border-b border-gray-200">
                    <div>
                      <div>{product.name}</div>
                      <div className="text-gray-500">{product.wholesale_price}</div>
                    </div>
                  </td>
                  
                  <td className="border-b border-gray-200">
                    <div className="flex space-x-2 justify-center">
                      <button
                        ref={(el) => (buttonRefs.current[`${product._id}-1`] = el)} // unique ref for +1
                        onClick={(e) => handleButtonClick(product, 1, `${product._id}-1`, e)}
                        className="bg-warna3 shadow-md text-black p-2 rounded-md transition-transform duration-300 transform active:scale-150"
                      >
                        +1
                      </button>
                      <button
                        ref={(el) => (buttonRefs.current[`${product._id}-5`] = el)} // unique ref for +5
                        onClick={(e) => handleButtonClick(product, 5, `${product._id}-5`, e)}
                        className="bg-warna3 shadow-md text-black p-2 rounded-md transition-transform duration-300 transform active:scale-150"
                      >
                        +5
                      </button>
                      <button
                        ref={(el) => (buttonRefs.current[`${product._id}-10`] = el)} // unique ref for +10
                        onClick={(e) => handleButtonClick(product, 10, `${product._id}-10`, e)}
                        className="bg-warna3 shadow-md text-black p-2 rounded-md transition-transform duration-300 transform active:scale-150"
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

export default Product;
