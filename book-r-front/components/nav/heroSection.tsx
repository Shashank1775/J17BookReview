'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [activeButton, setActiveButton] = useState('');

  const handleButtonClick = (button: any) => {
    setActiveButton(button);
  };

  const getButtonStyles = (button: any) => {
    const isActive = activeButton === button;
    return isActive ? 'bg-blue-500 text-white' : 'bg-white text-black';
  };

  const getImage = () => {
    switch (activeButton) {
      case 'Find':
        return 'https://bookreviewimagestorage.blob.core.windows.net/bookreviewimages/Create.JPG?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2024-07-31T04:22:39Z&st=2024-07-05T20:22:39Z&spr=https&sig=%2FLfdJJ7UZxCGGeW9kIpWwqsBb8Sv%2BeffWp1TMlC9W8g%3D'; // replace with actual image path
      case 'Create':
        return 'https://bookreviewimagestorage.blob.core.windows.net/bookreviewimages/Find.JPG?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2024-07-31T04:22:39Z&st=2024-07-05T20:22:39Z&spr=https&sig=%2FLfdJJ7UZxCGGeW9kIpWwqsBb8Sv%2BeffWp1TMlC9W8g%3D'; // replace with actual image path
      case 'Review':
        return 'https://bookreviewimagestorage.blob.core.windows.net/bookreviewimages/Review.JPG?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2024-07-31T04:22:39Z&st=2024-07-05T20:22:39Z&spr=https&sig=%2FLfdJJ7UZxCGGeW9kIpWwqsBb8Sv%2BeffWp1TMlC9W8g%3D'; // replace with actual image path
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (activeButton) {
      case 'Find':
        return 'Find books that you need to know from our extensive library.';
      case 'Create':
        return 'Create your lists and flashcards to organize your studies.';
      case 'Review':
        return 'Review books and dominate competitions.';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center">
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold text-white">Welcome to QbBookReview</h1>
        <h2 className="text-2xl font-semibold text-white mt-3">The Easy Way to Review</h2>
      </div>
      <div className="absolute" style={{ left: '65%', bottom: '25%', transform: 'translateX(-50%)' }}>
        {activeButton && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-white mb-4">{getDescription()}</p>
            <div className="mb-4 p-4 rounded-lg w-full flex justify-center items-center">
              <Image src={getImage()} alt={`${activeButton} image`} className="w-full h-auto object-contain border-2 border-black" />
            </div>
          </div>
        )}
        <div className="space-y-8">
          <button
            className={`${getButtonStyles('Find')} rounded-md w-40 h-20 outline-black outline-2 hover:bg-gray-200 transition-all duration-200 mr-20`}
            onClick={() => handleButtonClick('Find')}
          >
            1. Find
          </button>
          <button
            className={`${getButtonStyles('Create')} rounded-md w-40 h-20 outline-black outline-2 hover:bg-gray-200 transition-all duration-200`}
            onClick={() => handleButtonClick('Create')}
          >
            2. Create
          </button>
          <button
            className={`${getButtonStyles('Review')} rounded-md w-40 h-20 outline-black outline-2 hover:bg-gray-200 transition-all duration-200 ml-20`}
            onClick={() => handleButtonClick('Review')}
          >
            3. Review
          </button>
        </div>
      </div>
    </div>
  );
}
