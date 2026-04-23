import React from 'react';
import FlashCard from './FlashCard';
import useAppStore from '../../store/useAppStore';

const FlashCardGrid = ({ cards, onStudied }) => {
  const { bookmarked, toggleBookmark, incrementCardsStudied } = useAppStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <FlashCard
          key={card.id || i}
          card={card}
          index={i}
          isBookmarked={bookmarked.includes(i)}
          onBookmark={() => toggleBookmark(i)}
          onStudied={() => { incrementCardsStudied(); onStudied?.(); }}
        />
      ))}
    </div>
  );
};

export default FlashCardGrid;
