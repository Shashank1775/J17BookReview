// StarRating.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
}


const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
    const starColor = rating === 3 ? 'text-red-500' : rating === 2 ? 'text-yellow-400' : 'text-green-500';
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        if (i <= rating) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className={starColor + ' mr-5'} />);
        } else {
            stars.push(<FontAwesomeIcon key={i} icon={faStarEmpty} className='text-gray-500 mr-5'/>);
        }
    }
    return <div>{stars}</div>;
};

export default StarRating;
