export const addOrMinus = (c, boardCount) => {
    let number = parseInt(c);
    boardCount.push(number);
    return boardCount;
}

export const double = (c, boardCount) => {
    let lastCard = boardCount.slice(-1);
    boardCount.push(lastCard[0]);
    return boardCount;
}

export const twoAndFour = (c, boardCount) => {
    let condition = [2, 4, -2, -4];
    let twoAndFourReversed = boardCount.map(n => {
        if (condition.includes(n)) { return n * -1 }
        return n
    });
    return twoAndFourReversed;
}


export const threeAndSix = (c, boardCount) => {
    let condition = [3, 6, -3, -6];
    let threeAndSixReversed = boardCount.map(n => {
        if (condition.includes(n)) { return n * -1 }
        return n
    });
    return threeAndSixReversed;
}

export const removeCard = (c, boardCount) => {
    boardCount.pop();
    return boardCount;
}

