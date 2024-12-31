import React, { useEffect, useState } from 'react';
import './App.scss';

const App = () => {
  const people = [
    'Лук', 'Бодя', 'Лена', 'Саня', 'Яна', 'Усы', 'Дзюбик', 'Илья'
  ];

  const pairs = [
    ['Бодя', 'Лена'],
    ['Саня', 'Яна']
  ];

  const generateGiftExchange = () => {
    const gifts = people.map((person, index) => ({ person, gift: index + 1 }));
    const result = [];

    const isValidGiftAssignment = (person, giftPerson) => {
      if (person === giftPerson) return false;

      const pair = pairs.find(pair => pair.includes(person));
      if (pair && pair.includes(giftPerson)) return false;

      return true;
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      const remainingGifts = [...gifts];
      shuffleArray(remainingGifts);
      let valid = true;
      const tempResult = [];

      for (const person of people) {
        const giftIndex = remainingGifts.findIndex(gift => isValidGiftAssignment(person, gift.person));
        if (giftIndex === -1) {
          valid = false;
          break;
        }
        tempResult.push({ person, receives: remainingGifts[giftIndex].person });
        remainingGifts.splice(giftIndex, 1);
      }

      if (valid) {
        shuffleArray(tempResult); // Shuffle the final assignment order
        result.push(...tempResult);
        break;
      }
    }

    if (result.length === 0) {
      alert('Не удалось распределить подарки. Попробуйте еще раз.');
    }

    return result;
  };

  const [assignments, setAssignments] = useState([]);

  const handleGenerate = () => {
	// const newAssignments = generateGiftExchange();
	// setAssignments(newAssignments);
	let count = 0;
	const intervalId = setInterval(() => {
		const newAssignments = generateGiftExchange();
		setAssignments(newAssignments);
		count++;
		if (count > 40) {
			clearInterval(intervalId);
		}
	}, 100);

	return () => clearInterval(intervalId);
  };

  return (
    <div className="App">
      <h1 className="title">Новогодний рандом</h1>
      <button className="generate-button" onClick={handleGenerate}>Распределить подарки</button>
      {assignments.length > 0 && (
        <ul className="assignments-list">
          {assignments.map((assignment, index) => (
            <li key={index} className="assignment-item">
              <span>{assignment.person}</span> <img src={require('./img/arrow.svg').default} alt="arrow" /> <span>{assignment.receives}</span>
            </li>
          ))}
        </ul>
      )}
	  <span className="bottom-text">Получатель слева, а от кого подарок справа</span>
    </div>
  );
};

export default App;
