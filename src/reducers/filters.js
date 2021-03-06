// @flow

import {
  LOAD_IMAGE,
  FILTER_IMAGE,
  SELECT_FILTER,
  SET_GRAYSCALE,
  SET_SCALE,
  SET_FILTER_OPTION,
  SET_FILTER_PALETTE_OPTION,
  ADD_PALETTE_COLOR
} from "constants/actionTypes";

import { floydSteinberg } from "filters/errorDiffusing";

import type { Action, AppState } from "types";

export const initialState = {
  selected: { displayName: "Floyd-Steinberg", filter: floydSteinberg },
  convertGrayscale: false,
  scale: 1,
  inputImage: null,
  outputImage: null
};

export default (state: AppState = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_IMAGE:
      return {
        ...state,
        inputImage: action.image
      };
    case SET_GRAYSCALE:
      return {
        ...state,
        convertGrayscale: action.value
      };
    case SET_SCALE:
      return {
        ...state,
        scale: action.scale
      };
    case SELECT_FILTER:
      return {
        ...state,
        selected: {
          name: action.name,
          filter: action.filter.filter
        }
      };
    case SET_FILTER_OPTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          filter: {
            ...state.selected.filter,
            options: {
              ...state.selected.filter.options,
              [action.optionName]: action.value
            }
          }
        }
      };
    case SET_FILTER_PALETTE_OPTION:
      if (
        !state.selected.filter.options ||
        !state.selected.filter.options.palette
      ) {
        console.warn("Tried to set option on null palette", state); // eslint-disable-line
        return state;
      }

      return {
        ...state,
        selected: {
          ...state.selected,
          filter: {
            ...state.selected.filter,
            options: {
              ...state.selected.filter.options,
              palette: {
                ...state.selected.filter.options.palette,
                options: {
                  ...state.selected.filter.options.palette.options,
                  [action.optionName]: action.value
                }
              }
            }
          }
        }
      };
    case ADD_PALETTE_COLOR:
      if (
        !state.selected.filter.options ||
        !state.selected.filter.options.palette
      ) {
        console.warn("Tried to add color to null palette", state); // eslint-disable-line
        return state;
      }

      return {
        ...state,
        selected: {
          ...state.selected,
          filter: {
            ...state.selected.filter,
            options: {
              ...state.selected.filter.options,
              palette: {
                ...state.selected.filter.options.palette,
                options: {
                  ...state.selected.filter.options.palette.options,
                  colors: [
                    ...state.selected.filter.options.palette.options.colors,
                    action.color
                  ]
                }
              }
            }
          }
        }
      };
    case FILTER_IMAGE:
      return {
        ...state,
        outputImage: action.image
      };
    default:
      return state;
  }
};
