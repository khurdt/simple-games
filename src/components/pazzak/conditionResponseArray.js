export default function conditionResponseArray(player, player1, player2, setPlayer1, setPlayer2, setEndGame, setRefresh, refresh) {

  const filledSlots = () => {
    player.score.push(1);
    setEndGame(true);
    setRefresh(!refresh);
  }

  const twenty = () => {
    (player.player === 1) ?
      setPlayer1({ ...player1, stand: true }) :
      setPlayer2({ ...player2, stand: true });
  }

  const broke = () => {
    (player.player === 1) ? player2.score.push(1) : player1.score.push(1);
    setEndGame(true);
    setRefresh(!refresh);
  }

  const under = () => {

  }

  const tied = () => {
    setEndGame(true);
    setRefresh(!refresh);
  }

  const player1Win = () => {
    player1.score.push(1);
    setEndGame(true);
    setRefresh(!refresh);
  }

  const player2Win = () => {
    player2.score.push(1);
    setEndGame(true);
    setRefresh(!refresh);
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
      name: '20',
      action: twenty
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