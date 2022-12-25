export default function conditionsArray(isplayer1Turn, player1, player2) {
  let player = (isplayer1Turn) ? player1 : player2;
  let otherPlayer = (isplayer1Turn) ? player2 : player1;
  const { totalCount, board, stand, garauntee } = player;
  let allSlotsFilled = board.indexOf('a') === -1;
  console.log(stand, player1.stand, player2.stand);
  const conditions = [
    {
      name: 'filledSlots',
      condition: (totalCount < 20 && allSlotsFilled)
    },
    {
      name: (isplayer1Turn) ? 'player1' : 'player2',
      condition: (totalCount <= 20 && stand && otherPlayer.stand && totalCount > otherPlayer.totalCount)
    },
    {
      name: (isplayer1Turn) ? 'player2' : 'player1',
      condition: (totalCount <= 20 && stand && otherPlayer.stand && totalCount < otherPlayer.totalCount)
    },
    {
      name: 'broke',
      condition: (totalCount > 20)
    },
    {
      name: (isplayer1Turn) ? 'player1' : 'player2',
      condition: (garauntee && stand && otherPlayer.stand && totalCount === otherPlayer.totalCount)
    },
    {
      name: 'tied',
      condition: (!garauntee && stand && otherPlayer.stand && totalCount === otherPlayer.totalCount)
    },
    {
      name: 'under',
      condition: (totalCount < 20 && !allSlotsFilled && !player.stand)
    },
    {
      name: '20',
      condition: (totalCount === 20 && !otherPlayer.stand)
    },
  ];
  return conditions;
}