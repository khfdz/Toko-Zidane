import PropTypes from 'prop-types';

const LessDisplay = ({ less, formatPrice }) => {
  return (
    <div className="mb-2 bg-red-100 p-4 rounded-md">
      <p className='text-md text-center font-semibold'>Kurang:</p>
      <p className="text-xl font-bold text-center">{formatPrice(less)}</p>
    </div>
  );
};

LessDisplay.propTypes = {
  less: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default LessDisplay;
