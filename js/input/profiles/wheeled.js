/**
 * input/profiles/wheeled.js — Input profile for wheeled mobile robots
 *
 * Handles all wheeled drive types (mecanum, omni, differential, etc.).
 *   Slider 1 → linear velocity  (m/s)
 *   Slider 2 → angular velocity (rad/s)
 *   Keys     → W/A/S/D (translate) + Q/E (rotate)
 */

export const wheeledProfile = {

  /** Keys watched by this profile (used for highlighting) */
  keys: ['w', 'a', 's', 'd', 'q', 'e'],

  /**
   * Slider configuration consumed by input.js to configure and reset the DOM.
   * slider1 maps to linearVelocitySlider, slider2 to angularVelocitySlider.
   */
  sliders: {
    slider1: {
      id:       'linearVelocitySlider',
      valueId:  'linearVelocityValue',
      label:    'Linear Vel',
      unit:     'm/s',
      min:      0,
      max:      0.2,
      step:     0.01,
      default:  0.1,
      decimals: 2,
    },
    slider2: {
      id:       'angularVelocitySlider',
      valueId:  'angularVelocityValue',
      label:    'Angular Vel',
      unit:     'rad/s',
      min:      0,
      max:      1.57,
      step:     0.01,
      default:  Math.PI / 4,
      decimals: 2,
    },
  },

  /**
   * Convert raw input → velocity commands.
   *
   * @param {{ keys: object, slider1: number, slider2: number }} rawInput
   * @returns {{ velX: number, velY: number, velAngular: number }}
   */
  processInput({ keys, slider1, slider2 }) {
    return {
      velX:       (keys['w'] ? slider1 : 0) - (keys['s'] ? slider1 : 0),
      velY:       (keys['a'] ? slider1 : 0) - (keys['d'] ? slider1 : 0),
      velAngular: (keys['q'] ? slider2 : 0) - (keys['e'] ? slider2 : 0),
    };
  },
};
