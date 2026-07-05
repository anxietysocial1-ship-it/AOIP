import type { RuleCondition } from "@/lib/data/questionnaire/types";

export type AnswerValue = string | number | boolean | string[];
export type AttributeMap = Record<string, AnswerValue | undefined>;

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function equals(a: unknown, b: unknown): boolean {
  if (typeof a === "boolean" || typeof b === "boolean") {
    return a === b;
  }
  const na = toNumber(a);
  const nb = toNumber(b);
  if (na !== null && nb !== null) return na === nb;
  return a === b;
}

function contains(answer: AnswerValue | undefined, value: unknown): boolean {
  if (Array.isArray(answer)) return answer.some((item) => equals(item, value));
  if (typeof answer === "string" && typeof value === "string") {
    return answer.includes(value);
  }
  return false;
}

/**
 * Evaluate a rule condition (rules.json / flow.json shape) against the
 * current attribute map. Unanswered attributes fail every operator
 * except IS_NOT_ANSWERED. `CONSISTENT_WITH_BAND` needs server-side band
 * data, so it is treated as satisfied here.
 */
export function evaluateCondition(
  condition: RuleCondition | undefined,
  attributes: AttributeMap,
): boolean {
  if (!condition) return true;
  if (condition.all) {
    return condition.all.every((c) => evaluateCondition(c, attributes));
  }
  if (condition.any) {
    return condition.any.some((c) => evaluateCondition(c, attributes));
  }
  const { attribute, operator } = condition;
  if (!attribute || !operator) return true;
  const answer = attributes[attribute];

  switch (operator) {
    case "IS_ANSWERED":
      return answer !== undefined && answer !== "";
    case "IS_NOT_ANSWERED":
      return answer === undefined || answer === "";
    case "CONSISTENT_WITH_BAND":
      return true;
    default:
      break;
  }

  if (answer === undefined) return false;

  switch (operator) {
    case "EQ":
      return equals(answer, condition.value);
    case "NEQ":
      return !equals(answer, condition.value);
    case "GT": {
      const [a, b] = [toNumber(answer), toNumber(condition.value)];
      return a !== null && b !== null && a > b;
    }
    case "GTE": {
      const [a, b] = [toNumber(answer), toNumber(condition.value)];
      return a !== null && b !== null && a >= b;
    }
    case "LT": {
      const [a, b] = [toNumber(answer), toNumber(condition.value)];
      return a !== null && b !== null && a < b;
    }
    case "LTE": {
      const [a, b] = [toNumber(answer), toNumber(condition.value)];
      return a !== null && b !== null && a <= b;
    }
    case "IN":
      return (condition.values ?? []).some((v) => equals(answer, v));
    case "NOT_IN":
      return !(condition.values ?? []).some((v) => equals(answer, v));
    case "BETWEEN": {
      const bounds = (condition.values ?? []) as unknown[];
      const a = toNumber(answer);
      const min = toNumber(bounds[0]);
      const max = toNumber(bounds[1]);
      return a !== null && min !== null && max !== null && a >= min && a <= max;
    }
    case "CONTAINS":
      return contains(answer, condition.value);
    case "NOT_CONTAINS":
      return !contains(answer, condition.value);
    default:
      return false;
  }
}
