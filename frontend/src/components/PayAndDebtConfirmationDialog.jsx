import PropTypes from 'prop-types';

const PayAndDebtConfirmationDialog = ({
  show,
  onClose,
  onConfirm,
  manualDebtPayment,
  onManualDebtPaymentChange,
  formatPrice, // Add this prop
  change // Add this prop
}) => (
  show && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Pembayaran dan Pembayaran Hutang</h2>
        <p>Apakah Anda ingin menggunakan kembalian ({formatPrice(change)}) untuk membayar hutang?</p>
        <p>Atau masukkan jumlah manual:</p>
        <input
          type="text"
          placeholder="Masukkan jumlah pembayaran hutang"
          value={manualDebtPayment}
          onChange={onManualDebtPaymentChange}
          className="w-full p-2 border rounded-md mt-4"
        />
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  )
);

PayAndDebtConfirmationDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  manualDebtPayment: PropTypes.string.isRequired,
  onManualDebtPaymentChange: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired, // Add this prop type
  change: PropTypes.number.isRequired // Add this prop type
};

export default PayAndDebtConfirmationDialog;
