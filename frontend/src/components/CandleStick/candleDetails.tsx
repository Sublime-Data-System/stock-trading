interface Props {
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

const CandleDetails = ({ open, high, close, low, volume }: Props) => {
  return (
    <div className="w-full bg-gray-100 mt-[28px] ">
      <div className="border-t border-gray-200 ">
        <div className="p-4 bg-gray-100 rounded-lg md:p-8 ">
          <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-3 :p-8">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">${open}</dt>
              <dd className="text-gray-500 ">Open</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">${high}</dt>
              <dd className="text-gray-500 ">High</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">{volume}</dt>
              <dd className="text-gray-500 ">Volume</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">${close}</dt>
              <dd className="text-gray-500 ">Close</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">${low}</dt>
              <dd className="text-gray-500 ">Low</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CandleDetails;
