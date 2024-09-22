import PropTypes from 'prop-types';

const ChangeDisplay = ({ change, formatPrice }) => (
  <div className="mb-4">
    <p className="text-lg font-semibold">Kembalian:</p>
    <p className="text-xl font-bold text-green-600">{formatPrice(change)}</p>
  </div>
);

ChangeDisplay.propTypes = {
  change: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default ChangeDisplay;
