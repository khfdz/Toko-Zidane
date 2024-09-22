import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../redux/slices/categorySlice'; // Import action fetchAllCategories
import { fetchAllProducts } from '../redux/slices/productSlice'; // Import action fetchAllProducts

const Tag = () => {
  const dispatch = useDispatch();
  
  // Mengambil data kategori dari Redux state
  const { categories = [], status, error } = useSelector((state) => state.category || {});
  
  // State lokal untuk menyimpan kategori yang dipilih
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    console.log('Dispatching fetchAllCategories...');
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    // Dispatch fetchAllProducts dengan selectedCategories sebagai tagQuery
    dispatch(fetchAllProducts({ tagQuery: selectedCategories }));
  }, [selectedCategories, dispatch]);

  // Debugging logs
  useEffect(() => {
    console.log('Category status:', status);
    console.log('Category data:', categories);
    console.log('Category error:', error);
  }, [status, categories, error]);

  // Handler untuk menambahkan atau menghapus kategori dari daftar yang dipilih
  const handleCategoryClick = (ct_id) => {
    setSelectedCategories(prevSelected => {
      const newSelected = prevSelected.includes(ct_id) 
        ? prevSelected.filter(id => id !== ct_id) // Jika sudah ada, hapus
        : [...prevSelected, ct_id]; // Jika belum ada, tambahkan

      console.log('Selected categories:', newSelected);
      return newSelected;
    });
  };

  return (
    <div className="fixed inset-0 mt-[130px] left-0 bg-white h-[50px]">
      <div className="flex space-x-2 overflow-x-auto whitespace-nowrap px-4 py-2 font-normald text-gray-800">
        {status === 'loading' && <p>Loading categories...</p>}
        {status === 'failed' && <p>Error loading categories: {error}</p>}
        {status === 'succeeded' &&
          categories.map((category) => (
            <button
              key={category._id}
              className={`p-2 rounded-md transition-colors duration-300 ${
                selectedCategories.includes(category.ct_id)
                  ? 'bg-warna3 text-white font-semibold' // Jika dipilih, background warna nyala
                  : 'bg-warna2 text-black' // Jika tidak dipilih, background default
              }`}
              onClick={() => handleCategoryClick(category.ct_id)} // Log ct_id on click
            >
              {category.name} {/* Menampilkan hanya nama kategori */}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tag;
