import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

function Navbar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="mx-auto flex h-24 max-w-[1240px] items-center justify-between px-4">
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">Climatetrics</h1>
      <ul className="hidden uppercase md:flex">
        <li className="p-4">Home</li>
        <li className="p-4">General Visualization</li>
        <li className="p-4">Across Regions</li>
        <li className="p-4">Ranking Datasets</li>
        <li className="p-4">Search by Datasets</li>
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      <div
        className={
          !nav
            ? 'fixed left-0 top-0 h-full w-[60%] border-r border-r-gray-900 bg-[#000300] text-white duration-500 ease-in-out'
            : 'fixed left-[-100%]'
        }
      >
        <h1 className="m-4 w-full text-3xl font-bold text-[#00df9a]">
          Climatetrics
        </h1>
        <ul className="p-4 uppercase">
          <li className="border-b border-gray-600 p-4">Home</li>
          <li className="border-b border-gray-600 p-4">
            General Visualization
          </li>
          <li className="border-b border-gray-600 p-4">Across Regions</li>
          <li className="border-b border-gray-600 p-4">Ranking Datasets</li>
          <li className="p-4">Search by Datasets</li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
