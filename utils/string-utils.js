export function genRandomID() {
  let idArray = [];
  const A_CODE = 97;

  for (let i = 0; i < 4; i++) {
    var randomChar = Math.floor(Math.random() * 25);
    idArray.push(A_CODE + randomChar);
  }

  return String.fromCharCode(...idArray);
}
