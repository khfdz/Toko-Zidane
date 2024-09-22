import PropTypes from 'prop-types';

const TotalPrice = ({ totalPrice, formatPrice }) => {
  return (
    <div className="mb-2 bg-warna2 p-6 rounded-md">
      <p className='text-md text-center font-semibold'>Total Yang Harus dibayar</p>
      <p className="text-xl font-bold text-center">{formatPrice(totalPrice)}</p>
    </div>
  );
};

TotalPrice.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired
};

export default TotalPrice;
