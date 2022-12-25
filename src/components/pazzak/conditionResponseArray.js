export default function conditionResponseArray(currentPlayer, otherPlayer, player1, player2, endTheGame) {
  const filledSlots = () => {
    currentPlayer.score.push(1);
    endTheGame();
  }

  const broke = () => {
    otherPlayer.score.push(1);
    endTheGame();
  }

  const under = () => {

  }

  const tied = () => {
    endTheGame();
  }

  const player1Win = () => {
    player1.score.push(1);
    endTheGame();
  }

  const player2Win = () => {
    player2.score.push(1);
    endTheGame();
  }

  const responses = [
    {
      name: 'broke',
      action: broke
    },
    {
      name: 'under',
      action: under
    },
    {
      name: 'filledSlots',
      action: filledSlots
    },
    {
      name: 'tied',
      action: tied
    },
    {
      name: 'player1',
      action: player1Win
    },
    {
      name: 'player2',
      action: player2Win
    },
  ]
  return responses;
}