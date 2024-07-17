import React, { useState } from 'react';

type FlashCardProps = {
    author: string;
    title: string;
    year: number;
    description: string;
    link: string;
};

const FlashCard: React.FC<FlashCardProps> = ({
    author,
    title,
    year,
    description,
    link,
}) => {
    const [isFlipped, setIsFlipped] = useState(true); // Start flipped initially

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flashcard-container w-full h-96 flex items-center justify-center">
            <div className={`flashcard w-3/4 h-3/4 perspective-1000 cursor-pointer relative ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="flashcard-inner w-full h-full transition-transform duration-500 ease-in-out transform">
                    {isFlipped ? (<div className="flashcard-front absolute w-full h-full bg-white rounded p-4 backface-hidden flex items-center justify-center shadow-lg border border-gray-200">
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="text-gray-100 absolute bottom-2 right-2 opacity-0 transition-opacity duration-300">{isFlipped ? 'Click to reveal details' : ''}</p>
                    </div>):(<div>
                        <div className="flashcard-back absolute w-full h-full bg-white rounded p-4 backface-hidden transform rotateY-180 flex flex-col shadow-lg border border-gray-200">
                        <span className="flex justify-center items-center">
                            <h1 className="font-bold text-3xl"><strong>Author:</strong> {author}</h1>
                        </span>
                        <span className="flex pt-3">
                            <p><strong>Year:</strong> {year}</p>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 ml-auto">Wikipedia Page</a>
                        </span>
                        <span className="pt-3">
                            <p><strong>Description:</strong> {description}</p>
                        </span>
                    </div>
                    </div>)}          
                </div>
            </div>
        </div>
    );
};

export default FlashCard;
