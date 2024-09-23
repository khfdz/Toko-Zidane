import PropTypes from 'prop-types';

const ChangeDisplay = ({ change, formatPrice }) => (
  <div className="mb-2 bg-green-200 p-4 rounded-md text-">
    <p className="text-md text-center font-semibold">Kembalian:</p>
    <p className="text-xl font-bold text-center">{formatPrice(change)}</p>
  </div>
);

ChangeDisplay.propTypes = {
  change: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default ChangeDisplay;
