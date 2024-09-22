import PropTypes from 'prop-types';

const CustomerInfo = ({ customerName}) => (
  <div className="mb-4">
    <p className="text-lg font-semibold">Nama Pembeli: {customerName}</p>
  </div>
);

CustomerInfo.propTypes = {
  customerName: PropTypes.string.isRequired,
};

export default CustomerInfo;
