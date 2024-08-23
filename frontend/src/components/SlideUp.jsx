import { useState } from 'react';

const SlideUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Dummy product data
  const products = [
    { name: 'Product 1', price: 100, stock: 10 },
    { name: 'Product 2', price: 150, stock: 20 },
    { name: 'Product 3', price: 200, stock: 5 },
  ];

  // Calculate total items and total price
  const totalItems = products.reduce((acc, product) => acc + product.stock, 0);
  const totalPrice = products.reduce((acc, product) => acc + (product.price * product.stock), 0);

  // Toggle the visibility of the slide-up component
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className=''>
     <div className="flex items-center justify-center">
  <button
    className="bg-black text-white p-2 h-2 items-center flex justify-center"
    onClick={toggleVisibility}
  >
    Slide Up
  </button>
</div>


      {/* Slide-up drawer */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-gray-300 p-4 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '400px' }} // Increased height to fit buttons and table
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Slide Up Table</h2>
          <button 
            className="text-red-500" 
            onClick={toggleVisibility}
          >
            Close
          </button>
        </div>

        {/* Total Items and Price */}
        <div className="mb-4 flex justify-between items-center bg-white p-2 rounded-md shadow">
          <div className="text-lg">
            Total Items: <strong>{totalItems}</strong>
          </div>
          <div className="text-lg">
            Total Price: <strong>${totalPrice}</strong>
          </div>
        </div>

        {/* Table of Products */}
        <div className="overflow-y-auto" style={{ maxHeight: '180px' }}>
          <table className="table-auto w-full text-left mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">${product.price}</td>
                  <td className="border px-4 py-2">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Bayar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideUp;
