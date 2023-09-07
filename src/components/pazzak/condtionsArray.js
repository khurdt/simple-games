export default function conditionsArray(currentPlayer, otherPlayer) {
  const { totalCount, board, stand, garauntee } = currentPlayer;
  let allSlotsFilled = board.indexOf('a') === -1;

  const conditions = [
    {
      name: 'filledSlots',
      condition: (totalCount < 20 && allSlotsFilled)
    },
    {
      name: `player${currentPlayer.player}`,
      condition: (totalCount <= 20 && stand && otherPlayer.stand && totalCount > otherPlayer.totalCount)
    },
    {
      name: `player${otherPlayer.player}`,
      condition: (totalCount <= 20 && stand && otherPlayer.stand && totalCount < otherPlayer.totalCount)
    },
    {
      name: 'broke',
      condition: (totalCount > 20)
    },
    {
      name: `player${currentPlayer.player}`,
      condition: (garauntee && stand && otherPlayer.stand && totalCount === otherPlayer.totalCount)
    },
    {
      name: `player${otherPlayer.player}`,
      condition: (otherPlayer.garauntee && stand && otherPlayer.stand && totalCount === otherPlayer.totalCount)
    },
    {
      name: 'tied',
      condition: (stand && otherPlayer.stand && totalCount === otherPlayer.totalCount)
    },
    {
      name: 'under',
      condition: (totalCount < 20 && !allSlotsFilled && !stand)
    },
    {
      name: 'stood',
      condition: (stand && !otherPlayer.stand)
    },
    {
      name: '20',
      condition: (totalCount === 20)
    }
  ];
  return conditions;
}