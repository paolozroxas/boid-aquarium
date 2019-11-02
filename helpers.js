const vAdd = (...vAddends) => {
  const sum = { x: 0, y: 0 };
  vAddends.forEach((vAddend) => {
    sum.x += vAddend.x;
    sum.y += vAddend.y;
  });
  return sum;
}

const vSubtract = (vMinuend, vSubtrahend) => {
  return {
    x: vMinuend.x - vSubtrahend.x,
    y: vMinuend.y - vSubtrahend.y,
  };
}

const vMultiplyScalar = (scalar, v) => {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
  };
}

const vMagnitude = (v) => {
  return Math.sqrt(
    Math.pow(v.x, 2) +
    Math.pow(v.y, 2)
  );
}

const distance = (coord1, coord2) => {
  return Math.sqrt(
    Math.pow(coord1.x - coord2.x, 2) +
    Math.pow(coord1.y - coord2.y, 2)
  );
}