export default function conditionsArray(player, player1, player2) {
  const { totalCount, board } = player;
  let allSlotsFilled = board.indexOf('a') === -1;
  const conditions = [
    {
      name: 'filledSlots',
      condition: (totalCount < 20 && allSlotsFilled)
    },
    {
      name: 'under',
      condition: (totalCount < 20 && !allSlotsFilled)
    },
    {
      name: '20',
      condition: (totalCount === 20)
    },
    {
      name: 'broke',
      condition: (totalCount > 20)
    },
    {
      name: 'tied',
      condition: (totalCount === 20 && player1.totalCount === player2.totalCount)
    },
    {
      name: 'tied',
      condition: (player1.stand && player2.stand && player1.totalCount === player2.totalCount)
    },
    {
      name: 'player1',
      condition: (player1.stand && player2.stand && player1.totalCount > player2.totalCount)
    },
    {
      name: 'player2',
      condition: (player1.stand && player2.stand && player1.totalCount < player2.totalCount)
    },
  ];
  return conditions;
}