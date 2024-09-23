import PropTypes from 'prop-types';

const ConfirmationDialog = ({ show, onClose, onConfirm }) => (
  show && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-8">
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Pembayaran</h2>
        <p>Apakah Anda yakin ingin melanjutkan pembayaran ini?</p>
        <div className="mt-6 flex justify-center space-x-4">
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

ConfirmationDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

export default ConfirmationDialog;
