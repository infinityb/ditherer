import * as utils from "utils";

describe("utils", () => {
  it("quantize a value", () => {
    expect(utils.quantizeValue(127.4, 2)).to.equal(0);
    expect(utils.quantizeValue(127.5, 2)).to.equal(255);
    expect(utils.quantizeValue(127.4, 3)).to.equal(128);
    expect(utils.quantizeValue(127.4, 4)).to.equal(85);
  });

  it("scales a 2d array, ignoring null values", () => {
    const input = [[1, 2], [null, 4]];
    const expected = [[2, 4], [null, 8]];
    const actual = utils.scaleMatrix(input, 2);

    expect(actual).to.eql(expected);
  });

  it("adds two 4-tuples together", () => {
    const actual = utils.add([1, 2, 3, 4], [2, 3, 4, 5]);
    const expected = [3, 5, 7, 9];
    expect(actual).to.eql(expected);
  });

  it("subtracts a 4-tuple from another", () => {
    const actual = utils.sub([5, 6, 7, 8], [4, 3, 2, 1]);
    const expected = [1, 3, 5, 7];
    expect(actual).to.eql(expected);
  });

  it("scales a 4-tuple by a number, ignoring alpha channel by default", () => {
    const actual = utils.scale([1, 2, 3, 4], 2);
    const expected = [2, 4, 6, 4];
    expect(actual).to.eql(expected);
  });

  it("gets the buffer index for a pixel", () => {
    const actual = utils.getBufferIndex(5, 2, 10);
    expect(actual).to.equal(100);
  });

  it("fills a buffer with a 4-tuple at an index", () => {
    const buf = new Uint8ClampedArray(5);
    utils.fillBufferPixel(buf, 1, 2, 3, 4, 5);
    expect(buf[0]).to.equal(0);
    expect(buf[1]).to.equal(2);
    expect(buf[2]).to.equal(3);
    expect(buf[3]).to.equal(4);
    expect(buf[4]).to.equal(5);
  });

  it("adds a buffer with a 4-tuple at an index", () => {
    const buf = new Uint8ClampedArray(5);
    buf[0] = 2;
    buf[1] = 3;
    buf[2] = 4;
    buf[3] = 5;
    buf[4] = 6;

    utils.addBufferPixel(buf, 1, [2, 3, 4, 5]);
    expect(buf[0]).to.equal(2);
    expect(buf[1]).to.equal(5);
    expect(buf[2]).to.equal(7);
    expect(buf[3]).to.equal(9);
    expect(buf[4]).to.equal(11);
  });
});
