Array.prototype.chunk = function<T>(size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < this.length; i += size) {
    const slice = this.slice(i, i + size);
    output.push(slice);
  }
  return output;
}
