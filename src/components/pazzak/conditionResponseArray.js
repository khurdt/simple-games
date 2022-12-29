export default function conditionResponseArray(currentPlayer, otherPlayer, player1, player2, endTheGame) {
  const filledSlots = () => {
    currentPlayer.score.push(1);
    let result = 'won the set'
    endTheGame(result, currentPlayer.player);
  }

  const broke = () => {
    otherPlayer.score.push(1);
    let result = 'won the set'
    endTheGame(result, otherPlayer.player);
  }

  const under = () => {

  }

  const tied = () => {
    let result = 'tied the set';
    endTheGame(result);
  }

  const player1Win = () => {
    player1.score.push(1);
    let result = 'won the set';
    endTheGame(result, player1.player);
  }

  const player2Win = () => {
    player2.score.push(1);
    let result = 'won the set';
    endTheGame(result, player2.player);
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