// @flow

/* eslint-disable no-alert, react/no-unused-prop-types, react/prop-types */

import React from "react";

import { THEMES } from "palettes/user";
import { rgba, uniqueColors } from "utils";

import type { ColorRGBA } from "types";

import s from "./styles.scss";

const convertCsvToColor = (csv: string): ?ColorRGBA => {
  const tokens = csv.split(",");

  if (tokens.length !== 4) {
    return null;
  }

  const channels = tokens.map(t => parseInt(t, 10));

  if (!channels.every(val => val >= 0 && val <= 255)) {
    return null;
  }

  return rgba(channels[0], channels[1], channels[2], channels[3]);
};

type Props = {
  value: { [string]: any },
  inputCanvas: ?HTMLCanvasElement,
  onSetPaletteOption: (string, any) => {},
  onAddPaletteColor: ColorRGBA => {},
  onSaveColorPalette: (string, Array<ColorRGBA>) => {}
};

export default class ColorArray extends React.Component<*, Props, *> {
  render() {
    const currentTheme = Object.entries(THEMES).find(
      e => e[1] === this.props.value
    );
    const customThemeName = "Custom";
    const currentThemeName = currentTheme ? currentTheme[0] : customThemeName;

    const themePicker = (
      <select
        className={s.enum}
        value={currentThemeName}
        onChange={e =>
          this.props.onSetPaletteOption("colors", THEMES[e.target.value])}
      >
        {Object.entries(THEMES).map(e => {
          const [key, val] = e;
          return (
            <option key={key} name={key} data-colors={val}>
              {key}
            </option>
          );
        })}
        <option key={customThemeName} name={customThemeName} disabled>
          Custom
        </option>
      </select>
    );

    const colorSwatch = (
      <div className={s.colorArray}>
        {this.props.value.map(c => {
          const color = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;

          return (
            <div
              key={c}
              title={color}
              style={{
                minHeight: "16px",
                minWidth: "16px",
                backgroundColor: color
              }}
            />
          );
        })}
      </div>
    );

    const onAddColorButton = (
      <button
        onClick={() => {
          const colorString = prompt(
            'Add a color: "r,g,b,a" (0-255 for each, eg. 255,0,0,255 for red)'
          );
          const color = convertCsvToColor(colorString);

          if (color) {
            this.props.onAddPaletteColor(color);
          }
        }}
      >
        Add color
      </button>
    );

    const extractColorsButton = (
      <button
        onClick={() => {
          const ctx =
            this.props.inputCanvas && this.props.inputCanvas.getContext("2d");
          if (ctx) {
            const topN = parseInt(prompt("Take the top n colors", 64), 10);

            const colors = uniqueColors(
              ctx.getImageData(
                0,
                0,
                (this.props.inputCanvas && this.props.inputCanvas.width) || 0,
                (this.props.inputCanvas && this.props.inputCanvas.height) || 0
              ).data,
              topN
            );
            this.props.onSetPaletteOption("colors", colors);
          }
        }}
      >
        Extract colors from input
      </button>
    );

    const savePaletteButton = (
      <button
        onClick={() => {
          const name = prompt("Save current palette as");
          const savedName = `🎨 ${name}`;

          if (!name || THEMES[savedName]) {
            alert(
              "Could not save: name taken or invalid. Use a different name. "
            );
          } else {
            // $FlowFixMe
            this.props.onSaveColorPalette(savedName, this.props.value);
            this.forceUpdate();
          }
        }}
      >
        Save theme locally
      </button>
    );

    return (
      <div>
        <div>
          <div className={s.label}>Theme</div>
          {themePicker}
        </div>

        {colorSwatch}
        {onAddColorButton}
        {extractColorsButton}
        {!currentTheme ? savePaletteButton : null}
      </div>
    );
  }
}