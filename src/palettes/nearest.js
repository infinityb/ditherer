// @flow

import { RANGE } from "constants/controlTypes";

import type { ColorRGBA } from "types";

const optionTypes = {
  levels: { type: RANGE, range: [1, 256], default: 2 }
};

const defaults = {
  levels: optionTypes.levels.default
};

// Gets nearest color
const getColor = (
  color: ColorRGBA,
  options: { levels: number } = defaults
): ColorRGBA => {
  const step = 255 / (options.levels - 1);

  // $FlowFixMe
  return color.map(c => {
    const bucket = Math.round(c / step);
    return Math.round(bucket * step);
  });
};

export default {
  name: "nearest",
  getColor,
  options: defaults,
  optionTypes,
  defaults
};
