import type { PendingOperation, OperatorType } from '@/types/vim';

export function createIdlePending(): PendingOperation {
  return { parserState: 'IDLE' };
}

const OPERATORS = new Set<string>(['d', 'c', 'y']);
const MOTIONS = new Set<string>([
  'h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$',
  'g', 'G', 'f', 't',
]);
const SIMPLE_COMMANDS = new Set<string>([
  'x', 'X', 'p', 'P', 'u', 'J', '.', 'r',
  'i', 'I', 'a', 'A', 'o', 'O',
  'v', 'V', ':', '/', 'n', 'N',
]);

export interface ParseResult {
  type: 'INCOMPLETE' | 'MOTION' | 'OPERATOR_MOTION' | 'OPERATOR_LINE' | 'SIMPLE_COMMAND' | 'UNKNOWN';
  count?: number;
  operator?: OperatorType;
  motion?: string;
  motionArg?: string;
  pending: PendingOperation;
}

function isDigit(key: string): boolean {
  return key >= '1' && key <= '9';
}

function isDigitOrZero(key: string): boolean {
  return key >= '0' && key <= '9';
}

function isOperator(key: string): boolean {
  return OPERATORS.has(key);
}

function isMotion(key: string): boolean {
  return MOTIONS.has(key);
}

function isSimpleCommand(key: string): boolean {
  return SIMPLE_COMMANDS.has(key);
}

export function parseKey(key: string, pending: PendingOperation): ParseResult {
  const idle = createIdlePending();

  switch (pending.parserState) {
    case 'IDLE': {
      // Count prefix (1-9 starts count, 0 is a motion)
      if (isDigit(key)) {
        return {
          type: 'INCOMPLETE',
          pending: {
            parserState: 'COUNT_PENDING',
            count: parseInt(key, 10),
          },
        };
      }

      // Operator (d, c, y)
      if (isOperator(key)) {
        return {
          type: 'INCOMPLETE',
          pending: {
            parserState: 'OPERATOR_PENDING',
            operator: key as OperatorType,
          },
        };
      }

      // Motion (standalone)
      if (isMotion(key)) {
        return {
          type: 'MOTION',
          motion: key,
          count: 1,
          pending: idle,
        };
      }

      // Simple commands (x, p, i, etc.)
      if (isSimpleCommand(key)) {
        return {
          type: 'SIMPLE_COMMAND',
          motion: key,
          count: 1,
          pending: idle,
        };
      }

      // Special: <Esc>, <C-r>, etc are handled at higher level
      if (key.startsWith('<')) {
        return {
          type: 'SIMPLE_COMMAND',
          motion: key,
          count: 1,
          pending: idle,
        };
      }

      return { type: 'UNKNOWN', pending: idle };
    }

    case 'COUNT_PENDING': {
      const currentCount = pending.count || 0;

      // More digits
      if (isDigitOrZero(key)) {
        return {
          type: 'INCOMPLETE',
          pending: {
            parserState: 'COUNT_PENDING',
            count: currentCount * 10 + parseInt(key, 10),
          },
        };
      }

      // Operator after count
      if (isOperator(key)) {
        return {
          type: 'INCOMPLETE',
          pending: {
            parserState: 'OPERATOR_PENDING',
            count: currentCount,
            operator: key as OperatorType,
          },
        };
      }

      // Motion after count
      if (isMotion(key)) {
        return {
          type: 'MOTION',
          motion: key,
          count: currentCount,
          pending: idle,
        };
      }

      // Simple command after count (e.g., 3x, 5p)
      if (isSimpleCommand(key)) {
        return {
          type: 'SIMPLE_COMMAND',
          motion: key,
          count: currentCount,
          pending: idle,
        };
      }

      // Unknown - reset
      return { type: 'UNKNOWN', pending: idle };
    }

    case 'OPERATOR_PENDING': {
      const op = pending.operator!;

      // Count after operator (e.g., d2w)
      if (isDigit(key)) {
        return {
          type: 'INCOMPLETE',
          pending: {
            ...pending,
            operatorCount: parseInt(key, 10),
          },
        };
      }

      // More digits for operator count
      if (isDigitOrZero(key) && pending.operatorCount) {
        return {
          type: 'INCOMPLETE',
          pending: {
            ...pending,
            operatorCount: (pending.operatorCount) * 10 + parseInt(key, 10),
          },
        };
      }

      // Same operator doubled (dd, cc, yy) → line-wise
      if (key === op) {
        const totalCount = (pending.count || 1) * (pending.operatorCount || 1);
        return {
          type: 'OPERATOR_LINE',
          operator: op,
          count: totalCount,
          pending: idle,
        };
      }

      // Motion after operator
      if (isMotion(key)) {
        const totalCount = (pending.count || 1) * (pending.operatorCount || 1);
        return {
          type: 'OPERATOR_MOTION',
          operator: op,
          motion: key,
          count: totalCount,
          pending: idle,
        };
      }

      // Unknown - reset
      return { type: 'UNKNOWN', pending: idle };
    }

    default:
      return { type: 'UNKNOWN', pending: idle };
  }
}

/**
 * Second-pass parse for motions that require an argument character (f, t).
 * Called when the first parse returns a motion of 'f' or 't'.
 */
export function needsMotionArg(motion: string): boolean {
  return motion === 'f' || motion === 't';
}
