import { flow, questionnaire, rules } from "@/lib/data/questionnaire";
import type { Question } from "@/lib/data/questionnaire/types";
import {
  evaluateCondition,
  type AnswerValue,
  type AttributeMap,
} from "@/lib/engine/conditions";
import { deriveAttribute } from "@/lib/engine/derivations";

export type { AnswerValue, AttributeMap };

const QUESTIONS_BY_ID = new Map<string, Question>(
  questionnaire.questions.map((q) => [q.question_id, q]),
);
const QUESTIONS_BY_ATTRIBUTE = new Map<string, Question>(
  questionnaire.questions.map((q) => [q.attribute_key, q]),
);

export function questionById(id: string): Question | undefined {
  return QUESTIONS_BY_ID.get(id);
}

export function questionByAttribute(key: string): Question | undefined {
  return QUESTIONS_BY_ATTRIBUTE.get(key);
}

/** Modules that never need a branch rule to unlock. */
const BASE_MODULES = new Set(["OBJ", "APP", "LOC", "DEM"]);

/** Snapshot of everything the rules imply about the session so far. */
export interface RuleOutcome {
  /** answers + branch-rule defaults + derived attributes */
  attributes: AttributeMap;
  unlockedModules: Set<string>;
  suppressedModules: Set<string>;
  unlockedQuestions: Set<string>;
  suppressedQuestions: Set<string>;
  /** user_message strings from fired elimination rules */
  flagMessages: string[];
}

export function computeOutcome(
  answers: Record<string, AnswerValue>,
): RuleOutcome {
  const attributes: AttributeMap = { ...answers };
  const unlockedModules = new Set(BASE_MODULES);
  const suppressedModules = new Set<string>();
  const unlockedQuestions = new Set<string>();
  const suppressedQuestions = new Set<string>();
  const flagMessages: string[] = [];

  // Two passes so branch-rule defaults and derived attributes can feed
  // rules that depend on them.
  for (let pass = 0; pass < 2; pass++) {
    for (const rule of rules.derivation_rules) {
      if (attributes[rule.derived_attribute] !== undefined) continue;
      const derived = deriveAttribute(rule, attributes);
      if (derived !== undefined) attributes[rule.derived_attribute] = derived;
    }

    const branchRules = [...rules.branch_rules].sort(
      (a, b) => a.priority - b.priority,
    );
    for (const rule of branchRules) {
      if (!evaluateCondition(rule.when, attributes)) continue;
      for (const action of rule.actions) {
        switch (action.action) {
          case "unlock_module":
            unlockedModules.add(String(action.module));
            break;
          case "suppress_module":
            suppressedModules.add(String(action.module));
            break;
          case "unlock_questions":
            for (const id of (action.question_ids as string[]) ?? []) {
              unlockedQuestions.add(id);
            }
            break;
          case "suppress_questions":
            for (const id of (action.question_ids as string[]) ?? []) {
              suppressedQuestions.add(id);
            }
            break;
          case "set_attribute_default": {
            const key = String(action.attribute);
            if (attributes[key] === undefined && action.value !== undefined) {
              attributes[key] = action.value as AnswerValue;
            }
            break;
          }
          default:
            break;
        }
      }
    }
  }

  for (const rule of rules.elimination_rules) {
    if (!evaluateCondition(rule.when, attributes)) continue;
    for (const action of rule.actions) {
      if (action.action === "flag_profile" && action.user_message) {
        flagMessages.push(String(action.user_message));
      }
    }
  }

  return {
    attributes,
    unlockedModules,
    suppressedModules,
    unlockedQuestions,
    suppressedQuestions,
    flagMessages,
  };
}

function isSuppressed(question: Question, outcome: RuleOutcome): boolean {
  return (
    outcome.suppressedQuestions.has(question.question_id) ||
    (outcome.suppressedModules.has(question.module) &&
      !outcome.unlockedQuestions.has(question.question_id))
  );
}

/** Cross-field validation: returns the failure message, if any. */
export function validateAnswer(
  attributeKey: string,
  answers: Record<string, AnswerValue>,
): string | null {
  for (const rule of rules.validation_rules) {
    const check = rule.check;
    const involved =
      check.attribute === attributeKey ||
      check.compare_to_attribute === attributeKey;
    if (!involved) continue;
    const target = answers[String(check.attribute)];
    const compareTo = answers[String(check.compare_to_attribute)];
    if (target === undefined || compareTo === undefined) continue;
    const passes = evaluateCondition(
      {
        attribute: String(check.attribute),
        operator: String(check.operator),
        value: compareTo,
      },
      answers,
    );
    if (!passes) return rule.on_fail.user_message;
  }
  return null;
}

const TIER_WEIGHT: Record<string, number> = { high: 3, medium: 2, low: 1 };

/**
 * S-060 information-gain stand-in: rank the unlocked, unanswered pool
 * by expected IG tier, then by the documented tiebreakers (lower
 * cognitive complexity, lower sensitivity, broader scheme coverage).
 */
export function selectAdaptiveQuestion(
  answers: Record<string, AnswerValue>,
  outcome: RuleOutcome,
  excludeModules: Set<string>,
): Question | undefined {
  const candidates = questionnaire.questions.filter((question) => {
    if (answers[question.attribute_key] !== undefined) return false;
    if (excludeModules.has(question.module)) return false;
    if (isSuppressed(question, outcome)) return false;
    return (
      outcome.unlockedModules.has(question.module) ||
      outcome.unlockedQuestions.has(question.question_id) ||
      question.visibility === "root"
    );
  });

  candidates.sort((a, b) => {
    const tier =
      (TIER_WEIGHT[b.ig_metadata?.expected_information_gain_tier ?? "low"] ??
        1) -
      (TIER_WEIGHT[a.ig_metadata?.expected_information_gain_tier ?? "low"] ??
        1);
    if (tier !== 0) return tier;
    if (a.cognitive_complexity !== b.cognitive_complexity) {
      return a.cognitive_complexity - b.cognitive_complexity;
    }
    if (a.sensitivity_level !== b.sensitivity_level) {
      return a.sensitivity_level - b.sensitivity_level;
    }
    return (
      (b.ig_metadata?.scheme_coverage_tags?.length ?? 0) -
      (a.ig_metadata?.scheme_coverage_tags?.length ?? 0)
    );
  });

  return candidates[0];
}

/** Foundation track routing, mirroring S-040-PROFILE-ROUTER. */
const ROUTER_STATE = flow.states.find(
  (s) => s.state_id === "S-040-PROFILE-ROUTER",
);

interface FlowTransition {
  to_state: string;
  priority: number;
  condition?: Parameters<typeof evaluateCondition>[0];
}

export function routeFoundationState(attributes: AttributeMap): string {
  const transitions = (
    (ROUTER_STATE?.transitions as FlowTransition[] | undefined) ?? []
  ).slice();
  transitions.sort((a, b) => a.priority - b.priority);
  for (const transition of transitions) {
    if (evaluateCondition(transition.condition, attributes)) {
      return transition.to_state;
    }
  }
  return transitions[transitions.length - 1]?.to_state ?? "S-060-ADAPTIVE";
}

export function mandatoryQuestionsForState(
  stateId: string,
  answers: Record<string, AnswerValue>,
  outcome: RuleOutcome,
): Question[] {
  const state = flow.states.find((s) => s.state_id === stateId);
  const source = state?.question_source as
    | { mandatory_question_ids?: string[] }
    | null
    | undefined;
  const ids = source?.mandatory_question_ids ?? [];
  return ids
    .map((id) => QUESTIONS_BY_ID.get(id))
    .filter((question): question is Question => {
      if (!question) return false;
      if (answers[question.attribute_key] !== undefined) return false;
      return !isSuppressed(question, outcome);
    });
}

/** EN-001 milestone acknowledgements, keyed by questions answered. */
export function milestoneMessage(questionsAnswered: number): string | null {
  const engagement = rules.engagement_rules as
    | {
        rule_id: string;
        trigger?: { at_values?: number[] };
        messages?: string[];
      }[]
    | undefined;
  const en001 = engagement?.find((rule) => rule.rule_id === "EN-001");
  const index = en001?.trigger?.at_values?.indexOf(questionsAnswered) ?? -1;
  if (index === -1) return null;
  return en001?.messages?.[index] ?? null;
}
