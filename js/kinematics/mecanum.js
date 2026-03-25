/**
 * kinematics/mecanum.js — 4-wheel mecanum drive
 *
 * Wheel layout (standard X-configuration, rollers at 45°):
 *   joint_lf  — left  front
 *   joint_rf  — right front
 *   joint_lb  — left  back
 *   joint_rb  — right back
 *
 * Robot-specific geometry is passed in via `params` (defined in each robot's
 * config.kinematics) so this file stays free of hardcoded numbers.
 *
 * Used by: KR003, AKROS
 */

/**
 * @param {object} robot     URDFRobot instance
 * @param {object} commands  velocity commands from the active input profile:
 *   @param {number} commands.velX        forward  velocity in robot frame (m/s)
 *   @param {number} commands.velY        lateral  velocity in robot frame (m/s)
 *   @param {number} commands.velAngular  yaw rate (rad/s), positive = CCW
 * @param {number} dt        time step (s)
 * @param {object} params    robot geometry from config.kinematics:
 *   @param {number} params.lx          half-wheelbase   (centre → wheel, X axis, metres)
 *   @param {number} params.ly          half-track-width (centre → wheel, Y axis, metres)
 *   @param {number} params.wheelRadius wheel radius (metres)
 */
export function updateJoints(robot, commands, dt, params) {
  if (!robot?.joints) return;

  const { velX, velY, velAngular } = commands;
  const { lx, ly, wheelRadius }    = params;
  const wb = lx + ly;  // combined rotation term

  const setWheel = (name, ω) => {
    const j = robot.joints[name];
    if (j) j.setJointValue((j.angle || 0) + ω * dt);
  };

  setWheel('joint_lf', (velX - velY - velAngular * wb) / wheelRadius);
  setWheel('joint_rf', (velX + velY + velAngular * wb) / wheelRadius);
  setWheel('joint_lb', (velX + velY - velAngular * wb) / wheelRadius);
  setWheel('joint_rb', (velX - velY + velAngular * wb) / wheelRadius);
}
