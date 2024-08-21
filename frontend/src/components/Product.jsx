const products = [
    {
        id: 1,
        image: 'http://localhost:5151/uploads/super.png', // URL image atau path statis
        name: 'Djarum Super',
        price: '25,500'
    },
    // Tambahkan produk lainnya di sini
];

const Product = () => {
    return (
        <div className="p-8 mx-auto max-w-4xl">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200">Image</th>
                        <th className="py-2 px-4 border-b border-gray-200">Name</th>
                        <th className="py-2 px-4 border-b border-gray-200">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">{product.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{product.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Product;
