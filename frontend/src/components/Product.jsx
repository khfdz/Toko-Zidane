import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productSlice';

const Product = () => {
  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector((state) => state.product); // Update state to state.product

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="mx-auto max-w-4xl -mt-[80px] mb-[90px]">
      <div className="mb-4 fixed top-0 left-0 w-full overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-2 mt-[130px] ml-4">
          <button className="bg-warna2 shadow-md text-black p-2 rounded-md">Rokok</button>
          <button className="bg-warna2 shadow-md text-black p-2 rounded-md">Kategori Lain</button>
        </div>
      </div>

      <div className="pt-[80px]">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {status === 'succeeded' && (
          <table className="min-w-full shadow-lg rounded-lg overflow-hidden text-md">
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border-b pl-4 pt-4 pb-4 border-gray-200">
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
