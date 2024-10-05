import PropTypes from 'prop-types';

const CustomerPopup = ({ customers, searchTerm, setSearchTerm, handleCustomerSelect, closePopup }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customer..."
          className="border border-gray-300 p-2 rounded w-full"
        />
        <ul>
          {customers.map((customer) => (
            <li
              key={customer._id}
              onClick={() => handleCustomerSelect(customer)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {customer.name}
            </li>
          ))}
        </ul>
        <button onClick={closePopup} className="mt-2 bg-gray-300 p-2 rounded">Close</button>
      </div>
    </div>
  );
};

CustomerPopup.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleCustomerSelect: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default CustomerPopup;
