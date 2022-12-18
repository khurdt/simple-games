export default function TypeOfCard(c) {
  if (typeof c === 'number') {
    let deck = {
      name: 'deck',
      condition: (typeof c === 'number'),
      color: '#4dd500'
    }
    return deck;
  } else {
    let special = 'yellow';
    let names = [
      {
        name: 'double',
        condition: c.includes('D'),
        color: special,
        action: ''
      },
      {
        name: 'plusAndMinusT',
        condition: c.includes('+-1T'),
        color: special,
        action: '',
        switch: ''
      },
      {
        name: 'twoAndFour',
        condition: c.includes('2 & 4'),
        color: special,
        action: ''
      },
      {
        name: 'threeAndSix',
        condition: c.includes('3 & 6'),
        color: special,
        action: ''
      },
      {
        name: 'plusAndminus',
        condition: (c.includes('+-') && !(c.includes('T'))),
        color: 'blue',
        action: ''
      },
      {
        name: 'plus',
        condition: (c.includes('+') && !(c.includes('-'))),
        color: 'blue',
        action: ''
      },
      {
        name: 'minus',
        condition: (c.includes('-') && !(c.includes('+'))),
        color: 'red',
        action: ''
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