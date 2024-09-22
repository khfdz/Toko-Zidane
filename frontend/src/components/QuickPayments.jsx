import PropTypes from 'prop-types';

const QuickPayments = ({ suggestedPayments, onQuickPayment, totalPrice, formatPrice }) => (
  <div className="mb-4 grid grid-cols-2 gap-4">
    {suggestedPayments.map((amount, index) => (
      <button
        key={index}
        className="bg-warna2 font-semibold p-2 rounded-md text-center"
        onClick={() => onQuickPayment(amount)}
      >
        {amount === totalPrice ? 'UANG PAS' : formatPrice(amount)}
      </button>
    ))}
  </div>
);

QuickPayments.propTypes = {
  suggestedPayments: PropTypes.arrayOf(PropTypes.number).isRequired,
  onQuickPayment: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired, // Add this prop type
  formatPrice: PropTypes.func.isRequired // Add this prop type
};

export default QuickPayments;
