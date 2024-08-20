const Kalkulator = () => {
    return (
        <div>
            <div className="bg-gray-300 w-full text-center text-4xl absolute -mt-[200px]">
                500000
            </div>
        <div className="bg-gray-300 p-8 mx-auto max-w-md shadow-lg mt-[300px]">
            <div className="grid grid-cols-4 gap-4">
                {/* Tombol-tombol 1-9 */}
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">1</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">2</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">3</button>
                <button className="bg-green-500 text-white text-2xl p-4 rounded-lg row-span-2 flex justify-center items-center">BTN1</button>

                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">4</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">5</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">6</button>

                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">7</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">8</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">9</button>

                <button className="bg-green-500 text-white text-2xl p-4 rounded-lg row-span-2 flex justify-center items-center">BTN2</button>

                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">0</button>
                <button className="bg-blue-500 text-white text-2xl p-4 rounded-lg">000</button>
                <button className="bg-red-500 text-white text-2xl p-4 rounded-lg">C</button>
            </div>
        </div>
        </div>
    );
};

export default Kalkulator;
