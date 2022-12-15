const cells = document.querySelectorAll('.cell');

for (let i = 0; i < cells.length; i++) {
  cells[i].innerText = '';
  cells[i].style.removeProperty('background-color');
  cells[i].addEventListener('click', turnClick, false);
}

function turnClick(cell) {
  let card = document.createElement('div');
  card.classList.add('cardNumber');
  card.innerText = cell.target.id;
  card.style.backgroundColor = 'blue';
  document.getElementById(cell.target.id).append(card);

}