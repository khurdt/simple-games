export default function conditionResponseArray(currentPlayer, otherPlayer, player1, player2, endTheGame) {
  const filledSlots = () => {
    currentPlayer.score.push(1);
    let result = (currentPlayer.score.length > 2) ? `Player ${currentPlayer.player} won by filling all slots! Player ${currentPlayer.player} won the 3 sets. Game Over.` : `Player ${currentPlayer} won the set by filling all slots!`
    endTheGame(result);
  }

  const broke = () => {
    otherPlayer.score.push(1);
    let result = (otherPlayer.score.length > 2) ? `Player ${currentPlayer.player} broke! Player ${otherPlayer.player} won the 3 sets. Game Over.` : `Player ${currentPlayer.player} broke!`
    endTheGame(result);
  }

  const under = () => {

  }

  const tied = () => {
    let result = `Player ${player1.player} and ${player2.player} tied the set`;
    endTheGame(result);
  }

  const player1Win = () => {
    player1.score.push(1);
    let result = (player1.score.length > 2) ? `Player ${player1.player} won the 3 sets. Game Over.` : `Player ${player1.player} won the set!`;
    endTheGame(result);
  }

  const player2Win = () => {
    player2.score.push(1);
    let result = (player2.score.length > 2) ? `Player ${player2.player} won the 3 sets. Game Over.` : `Player ${player2.player} won the set!`;
    endTheGame(result);
  }

  const responses = [
    {
      name: 'broke',
      action: broke
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
    {
      name: 'under',
      action: under
    },
    {
      name: 'stood',
      action: under
    },
    {
      name: '20',
      action: under
    }
  ]
  return responses;
}