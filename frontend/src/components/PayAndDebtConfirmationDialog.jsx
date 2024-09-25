import PropTypes from 'prop-types';

const PayAndDebtConfirmationDialog = ({
  show,
  onClose,
  onConfirm,
  formatPrice,
  change
}) => {

  return (
    show && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-8">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Konfirmasi Pembayaran dan Pembayaran Hutang</h2>
          <p>Uang kembalian yang akan dibayarkan</p>
          <p className='mb-2 mt-2 bg-warna2 p-2 rounded-md text-center text-md font-semibold text-black'>
            {formatPrice(change)}
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              className="bg-warna1 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="bg-warna3 text-white px-4 py-2 rounded-md"
              onClick={onConfirm}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    )
  );
};

PayAndDebtConfirmationDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  change: PropTypes.number.isRequired
};

export default PayAndDebtConfirmationDialog;
