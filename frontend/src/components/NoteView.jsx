import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addNoteThunk, fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';

const NoteView = ({ onClose, initialNote }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState(initialNote || '');

  useEffect(() => {
    setNote(initialNote || '');
  }, [initialNote]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSaveNote = async () => {
    try {
      await dispatch(addNoteThunk(note));
      alert('Catatan berhasil disimpan!');
      await dispatch(fetchCartForCurrentUserThunk());
      onClose();
    } catch (error) {
      console.error('Error saat menyimpan catatan:', error);
      alert('Gagal menyimpan catatan. Silakan coba lagi.');
    }
  };

  const handleClearNote = () => {
    setNote(''); // Mengosongkan nilai catatan
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Catatan</h2>
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Masukkan catatan..."
          className="border border-gray-300 p-2 rounded w-full mb-4"
          rows={4}
        />
        <div className="flex justify-between">
          <button onClick={handleSaveNote} className="bg-warna3 text-white p-2 rounded">
            Simpan
          </button>
          <button onClick={handleClearNote} className="bg-yellow-500 text-white p-2 rounded">
            Kosongkan
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

NoteView.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialNote: PropTypes.string,
};

export default NoteView;
