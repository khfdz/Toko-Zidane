import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productSlice';
import Tag from './Tag';

const Product = () => {
  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector((state) => state.product); // Update state to state.product

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="">
      <div className="">
        <div className="" >
        <Tag />
        </div>
      </div>

      <div className="-mt-[14px] ">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {status === 'succeeded' && (
          <table className="min-w-full shadow-lg rounded-lg overflow-hidden text-md">
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border-b pl-4 pt-4 pb-4 border-gray-200 ">
                    <img src={`http://localhost:5151${product.image}`} alt={product.name} className="w-14 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div>
                      <div>{product.name}</div>
                      <div className="text-gray-500">{product.wholesale_price}</div>
                    </div>
                  </td>
                  <td className="border-b border-gray-200">
                    <div className="flex space-x-2 justify-center">
                      <button className="bg-warna2 shadow-md text-black p-2 rounded-md">+5</button>
                      <button className="bg-warna2 shadow-md text-black p-2 rounded-md">+10</button>
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
