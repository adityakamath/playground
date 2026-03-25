/**
 * kinematics/omni3.js — 3-wheel omnidirectional drive
 *
 * Wheel layout (angles from robot X-axis):
 *   left_wheel_joint  — 150°  (cos = −0.866, sin =  0.5)
 *   back_wheel_joint  — 270°  (cos =    0.0, sin = −1.0)
 *   right_wheel_joint —  30°  (cos =  0.866, sin =  0.5)
 *
 * Used by: LeKiwi
 */

/**
 * Robot-specific geometry is passed in via `params` (defined in each robot's
 * config.kinematics) so this file stays free of hardcoded numbers.
 *
 * @param {object} robot     URDFRobot instance
 * @param {object} commands  velocity commands from the active input profile:
 *   @param {number} commands.velX        forward  velocity in robot frame (m/s)
 *   @param {number} commands.velY        lateral  velocity in robot frame (m/s)
 *   @param {number} commands.velAngular  yaw rate (rad/s), positive = CCW
 * @param {number} dt        time step (s)
 * @param {object} params    robot geometry from config.kinematics:
 *   @param {number} params.wheelRadius  wheel radius (metres)
 *   @param {number} params.robotRadius  centre → wheel contact point (metres)
 *   @param {number} params.maxWheelVel  motor velocity limit (rad/s)
 */
export function updateJoints(robot, commands, dt, params) {
  if (!robot?.joints) return;

  const { velX, velY, velAngular }          = commands;
  const { wheelRadius, robotRadius, maxWheelVel } = params;
  const clamp = v => Math.max(-maxWheelVel, Math.min(maxWheelVel, v));

  const setWheel = (name, ωRaw) => {
    const j = robot.joints[name];
    if (j) j.setJointValue((j.angle || 0) + clamp(ωRaw) * dt);
  };

  setWheel('left_wheel_joint',  ( 0.866 * velX - 0.5 * velY - robotRadius * velAngular) / wheelRadius);
  setWheel('back_wheel_joint',  ( 0.0   * velX + 1.0 * velY - robotRadius * velAngular) / wheelRadius);
  setWheel('right_wheel_joint', (-0.866 * velX - 0.5 * velY - robotRadius * velAngular) / wheelRadius);
}
