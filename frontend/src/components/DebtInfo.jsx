import PropTypes from 'prop-types';

const DebtInfo = ({ debt, formatPrice }) => (
  <div className="mb-4 text-md bg-red-100 p-4 rounded-md text-center text-black font-semibold">
    {debt === 0 ? (
      <p className="text-green-600">Pelanggan tidak mempunyai hutang, yeay!</p>
    ) : (
      <div>
      <p className="text-red-600">Pelanggan mempunyai hutang</p>
      <p className="text-red-600">{formatPrice(debt)}</p>
      </div>
      
    )}
  </div>
);

DebtInfo.propTypes = {
  debt: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default DebtInfo;
