// @flow
/* eslint-disable react/prefer-stateless-function, react/forbid-prop-types */

import React from "react";
import PropTypes from "prop-types";

import s from "./styles.scss";

export default class App extends React.Component {
  static defaultProps: {
    className: string
  };

  constructor(props: any) {
    super(props);
    this.inputCanvas = null;
  }

  componentWillUpdate(nextProps: any) {
    const drawToCanvas = (
      canvas: HTMLCanvasElement,
      image: HTMLImageElement
    ) => {
      canvas.width = image.width; // eslint-disable-line
      canvas.height = image.height; // eslint-disable-line
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(image, 0, 0);
      }
    };

    if (
      this.inputCanvas &&
      nextProps.inputImage &&
      nextProps.inputImage !== this.props.inputImage
    ) {
      drawToCanvas(this.inputCanvas, nextProps.inputImage);
    }

    if (
      this.outputCanvas &&
      nextProps.outputImage &&
      nextProps.outputImage !== this.props.outputImage
    ) {
      drawToCanvas(this.outputCanvas, nextProps.outputImage);
    }
  }

  inputCanvas: ?HTMLCanvasElement;
  outputCanvas: ?HTMLCanvasElement;

  render() {
    const currentFilter = this.props.availableFilters.find(
      f => f.name === this.props.selectedFilter
    );

    return (
      <div>
        <input
          type="file"
          id="imageLoader"
          name="imageLoader"
          onChange={this.props.onLoadImage}
        />
        <select
          onChange={e => this.props.onSelectFilter(e.target.value)}
          value={this.props.selectedFilter}
        >
          {this.props.availableFilters.map(f =>
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          )}
        </select>
        <span>
          Options:
          {JSON.stringify(currentFilter.options)}
        </span>
        Convert to grayscale:
        <input
          name="convertGrayscale"
          type="checkbox"
          checked={this.props.convertGrayscale}
          onChange={e => this.props.onConvertGrayscale(e.target.checked)}
        />
        <button
          onClick={() => {
            this.props.onFilterImage(
              this.inputCanvas,
              currentFilter.filter,
              this.props.convertGrayscale
            );
          }}
        >
          F I L T E R - - T H I S - - I F - - Y O U - - C A N
        </button>
        <div style={{ border: "solid 1px grey" }}>
          <canvas
            style={{ border: "solid 1px green" }}
            ref={c => {
              this.inputCanvas = c;
            }}
          />

          <canvas
            style={{ border: "solid 1px red" }}
            ref={c => {
              this.outputCanvas = c;
            }}
          />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  className: PropTypes.string,
  match: PropTypes.object,
  onLoadImage: PropTypes.func,
  onFilterImage: PropTypes.func,
  inputImage: PropTypes.object,
  outputImage: PropTypes.object,
  availableFilters: PropTypes.arrayOf(PropTypes.object),
  selectedFilter: PropTypes.string,
  onSelectFilter: PropTypes.func,
  convertGrayscale: PropTypes.bool,
  onConvertGrayscale: PropTypes.func
};

App.defaultProps = {
  children: null,
  className: s.app,
  match: { url: "unknown" },
  onLoadImage: () => {},
  onFilterImage: () => {},
  inputImage: null,
  outputImage: null,
  availableFilters: [],
  selectedFilter: null,
  onSelectFilter: () => {},
  convertGrayscale: false,
  onConvertGrayscale: () => {}
};