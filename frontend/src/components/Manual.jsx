import { useState } from 'react';
import AdditionalView from "../components/AdditionalView";

const Manual = ({ formatPrice }) => {
    const [isAdditionalVisible, setIsAdditionalVisible] = useState(false);
    const [inputValue, setInputValue] = useState(''); // Menyimpan input angka

    const handleManualToggle = () => {
        setIsAdditionalVisible(!isAdditionalVisible);
        if (isAdditionalVisible) {
            setInputValue(''); // Reset nilai input ketika AdditionalView ditutup
        }
    };

    const handleNumberInput = (value) => {
        setInputValue(prev => prev + value); // Menambahkan angka ke input
    };

    const handleClear = () => {
        setInputValue(''); // Meng-clear semua input
    };

    const handleBackspace = () => {
        setInputValue(prev => prev.slice(0, -1)); // Menghapus satu digit terakhir
    };

    return (
        <div>
            <div className="bg-warna2 h-[200px] w-full flex justify-center items-center text-center text-4xl absolute -mt-[230px]">
                <p>{formatPrice(inputValue ? parseInt(inputValue, 10) : 0)}</p> {/* Menampilkan nilai input */}
            </div>

            <div className="p-6 mx-auto max-w-md shadow-lg mt-[200px]">
                <div className="grid grid-cols-4 gap-4">
                    {/* Tombol-tombol 1-9 untuk input angka */}
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('1')}>1</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('2')}>2</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('3')}>3</button>
                    <button className="bg-warna3 text-white text-2xl p-4 rounded-lg row-span-1 flex justify-center items-center" onClick={handleBackspace}>BTN1</button> {/* Backspace */}

                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('4')}>4</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('5')}>5</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('6')}>6</button>

                    <button 
                        className="bg-warna3 text-white text-2xl p-4 rounded-lg row-span-1 flex justify-center items-center"
                        onClick={handleManualToggle}
                    >
                        BTN2 {/* Tombol ini untuk membuka AdditionalView */}
                    </button>

                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('7')}>7</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('8')}>8</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('9')}>9</button>

                    <button className="bg-warna3 text-white text-2xl p-4 rounded-lg row-span-2 flex justify-center items-center"
                        onClick={handleManualToggle}
                    >
                        BTN2
                    </button>

                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('0')}>0</button>
                    <button className="border-2 border-warna3 text-2xl p-4 rounded-lg" onClick={() => handleNumberInput('000')}>000</button> {/* Tambah 000 */}
                    <button className="bg-warna3 text-white text-2xl p-4 rounded-lg" onClick={handleClear}>C</button> {/* Clear semua input */}
                </div>
            </div>

            {/* Menampilkan AdditionalView jika isAdditionalVisible true, dan meneruskan nilai input */}
            {isAdditionalVisible && <AdditionalView 
                onClose={handleManualToggle}
                inputValue={inputValue}  // Mengirim nilai input ke AdditionalView
            />}
        </div>
    );
};

export default Manual;
