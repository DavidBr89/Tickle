import generate from 'firebase-auto-ids';

export default function idGenerate() {
  const gen = new generate.Generator();
  return gen.generate(Date.now());
}
