import PropTypes from 'prop-types';

const CustomerInfo = ({ customerName}) => (
  <div>
      <div className="mb-4 ">
      <p className="bg-warna3 p-2 rounded-t-md text-center text-md font-semibold text-white">Nama Pembeli</p>
    <p className="w-full p-2 border-2 border-warna2 rounded-b-mb text-md font-semibold focus:outline-none text-center">{customerName}</p>
    </div>
  </div>
);

CustomerInfo.propTypes = {
  customerName: PropTypes.string.isRequired,
};

export default CustomerInfo;
