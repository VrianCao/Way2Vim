import type { RegisterState, RegisterEntry } from '@/types/vim';

const EMPTY_REGISTER: RegisterEntry = { content: '', type: 'CHAR' };

export function createInitialRegisters(): RegisterState {
  return {
    unnamed: { ...EMPTY_REGISTER },
    yank: { ...EMPTY_REGISTER },
    named: {},
  };
}

export function updateRegistersForYank(
  registers: RegisterState,
  content: string,
  type: 'CHAR' | 'LINE',
): RegisterState {
  const entry: RegisterEntry = { content, type };
  return {
    ...registers,
    unnamed: entry,
    yank: entry,
  };
}

export function updateRegistersForDelete(
  registers: RegisterState,
  content: string,
  type: 'CHAR' | 'LINE',
): RegisterState {
  const entry: RegisterEntry = { content, type };
  return {
    ...registers,
    unnamed: entry,
    // yank register (0) is NOT updated on delete
  };
}

export function updateRegistersForChange(
  registers: RegisterState,
  content: string,
  type: 'CHAR' | 'LINE',
): RegisterState {
  // change is similar to delete for register purposes
  return updateRegistersForDelete(registers, content, type);
}

export function getRegisterContent(
  registers: RegisterState,
  register?: string,
): RegisterEntry {
  if (!register || register === '"') {
    return registers.unnamed;
  }
  if (register === '0') {
    return registers.yank;
  }
  if (/^[a-z]$/.test(register)) {
    return registers.named[register] || EMPTY_REGISTER;
  }
  return registers.unnamed;
}
