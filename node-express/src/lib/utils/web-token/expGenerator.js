export default function expGenerator(minutes = 10) {
  return Math.floor(Date.now() / 1000) + minutes * 60;
}
