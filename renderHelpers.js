NEIGHBOR_COLOR_THRESHOLD = 25;

var rainbow = new Rainbow();
rainbow.setSpectrum('black', 'f0134d');
rainbow.setNumberRange(0, 1);

const mapScalarToColor = (s) => {
    return rainbow.colorAt(normalize(s, 0, NEIGHBOR_COLOR_THRESHOLD));
}