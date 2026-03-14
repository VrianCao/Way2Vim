export { processKey, createInitialState, resetEngineState } from './VimEngine';
export { clampCursor, executeMotion } from './normalMode';
export { createInitialRegisters, getRegisterContent } from './registers';
export { parseKey, createIdlePending, needsMotionArg } from './motionParser';
