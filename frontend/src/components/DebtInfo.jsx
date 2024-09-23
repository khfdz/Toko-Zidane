import PropTypes from 'prop-types';

const DebtInfo = ({ debt, formatPrice }) => (
  <div className="mb-4 text-md">
    {debt === 0 ? (
      <p className="text-green-600">Pelanggan tidak mempunyai hutang, yeay!</p>
    ) : (
      <p className="text-red-600">Pelanggan mempunyai hutang: {formatPrice(debt)}</p>
    )}
  </div>
);

DebtInfo.propTypes = {
  debt: PropTypes.number.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default DebtInfo;
