import PropTypes from 'prop-types';

const LessDisplay = ({ less, formatPrice }) => (
  <div className="mb-4">
    <p className="text-lg font-semibold">Kekurangan:</p>
    <p className="text-xl font-bold text-red-600">{formatPrice(less)}</p>
  </div>
);

LessDisplay.propTypes = {
  less: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default LessDisplay;
