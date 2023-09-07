import { addOrMinus, double, removeCard, threeAndSix, twoAndFour } from './cardActions';
import { Plus, Minus } from 'react-feather';

export default function TypeOfCard(c) {
  if (typeof c === 'number') {
    let deck = {
      name: 'deck',
      condition: (typeof c === 'number'),
      color: '#4dd500',
      sign: '',
      action: addOrMinus
    }
    return deck;
  } else {
    let special = 'yellow';
    let names = [
      {
        name: 'double',
        condition: c.includes('D'),
        color: special,
        sign: '',
        action: double,
        remove: removeCard
      },
      {
        name: 'plusAndMinusT',
        condition: c.includes('+-1T'),
        color: special,
        action: '',
        sign: '',
        action: addOrMinus,
        remove: removeCard
      },
      {
        name: 'twoAndFour',
        condition: c.includes('2 & 4'),
        color: special,
        sign: '',
        action: twoAndFour,
        remove: twoAndFour
      },
      {
        name: 'threeAndSix',
        condition: c.includes('3 & 6'),
        color: special,
        sign: '',
        action: threeAndSix,
        remove: threeAndSix
      },
      {
        name: 'plusAndminus',
        condition: (c.includes('+-') && !(c.includes('T'))),
        color: 'blue',
        sign: <Plus width={13} height={13} color={'white'} />,
        action: addOrMinus,
        remove: removeCard
      },
      {
        name: 'plus',
        condition: (c.includes('+') && !(c.includes('-'))),
        color: 'blue',
        sign: <Plus width={13} height={13} color={'white'} />,
        action: addOrMinus,
        remove: removeCard
      },
      {
        name: 'minus',
        condition: (c.includes('-') && !(c.includes('+'))),
        color: 'red',
        sign: <Minus width={13} height={13} color={'white'} />,
        action: addOrMinus,
        remove: removeCard
      }
    ];

    const getCard = () => {
      let card;
      for (let i = 0; i < names.length; i++) {
        if (names[i].condition === true) {
          card = names[i];
          break;
        }
      }
      return card;
    }

    return getCard();
  }
}