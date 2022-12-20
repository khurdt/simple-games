import { addOrMinus, double, threeAndSix, twoAndFour } from './cardActions';
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
        action: double
      },
      {
        name: 'plusAndMinusT',
        condition: c.includes('+-1T'),
        color: special,
        action: '',
        sign: '',
        switch: addOrMinus
      },
      {
        name: 'twoAndFour',
        condition: c.includes('2 & 4'),
        color: special,
        sign: '',
        action: twoAndFour
      },
      {
        name: 'threeAndSix',
        condition: c.includes('3 & 6'),
        color: special,
        sign: '',
        action: threeAndSix
      },
      {
        name: 'plusAndminus',
        condition: (c.includes('+-') && !(c.includes('T'))),
        color: 'blue',
        sign: <Plus width={13} height={13} color={'white'} />,
        action: addOrMinus
      },
      {
        name: 'plus',
        condition: (c.includes('+') && !(c.includes('-'))),
        color: 'blue',
        sign: <Plus width={13} height={13} color={'white'} />,
        action: addOrMinus
      },
      {
        name: 'minus',
        condition: (c.includes('-') && !(c.includes('+'))),
        color: 'red',
        sign: <Minus width={13} height={13} color={'white'} />,
        action: addOrMinus
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