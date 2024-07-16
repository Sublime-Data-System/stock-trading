import useCreateAlert from "@/services/useCreateAlert";
import React, { useState } from "react";

const StockAlert = ({
  onClose,
  user,
  symbol,
}: {
  onClose: () => void;
  user: any;
  symbol: any;
}) => {
  const [price, setPrice] = useState("");
  const [direction, setDirection] = useState("");

  const handlePriceChange = (e: any) => {
    const value = e.target.value;
    if (value >= 0) {
      setPrice(value);
    } else {
      // Optionally show an error message or handle the invalid input case
      alert("Price cannot be negative");
    }
  };

  const handleDirectionChange = (e: any) => {
    setDirection(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!price || !direction) {
      alert("Please fill out all fields");
      return;
    }

    const data = {
      symbol: symbol,
      price: price,
      direction: direction,
    };

    createAlert(data);
    onClose();
  };

  const { mutate: createAlert } = useCreateAlert(user);

  return (
    <>
      {
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Alert
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      onChange={handlePriceChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="direction"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Range
                    </label>
                    <select
                      onChange={handleDirectionChange}
                      id="direction"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="" selected disabled>
                        Select range
                      </option>
                      <option value="greater">Greater than </option>
                      <option value="lesser">Lesser than </option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Alert
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default StockAlert;
