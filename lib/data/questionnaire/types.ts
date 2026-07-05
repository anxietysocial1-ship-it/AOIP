/**
 * Types for the AOIP Applicant Intelligence Engine artifacts
 * (questions.json, rules.json, flow.json). They model the documented
 * structure of the artifacts; fields that are free-form or still
 * evolving are typed loosely on purpose.
 */

export type QuestionInputType =
  | "boolean"
  | "currency_inr"
  | "multi_select"
  | "number"
  | "single_select"
  | "text";

export interface QuestionOption {
  value: string;
  label: string;
  [extra: string]: unknown;
}

export interface Question {
  question_id: string;
  attribute_key: string;
  module: string;
  module_name: string;
  question_text: string;
  help_text?: string;
  input_type: QuestionInputType;
  visibility: string;
  cognitive_complexity: number;
  sensitivity_level: number;
  ig_metadata?: {
    scheme_coverage_tags: string[];
    expected_information_gain_tier: string;
    [extra: string]: unknown;
  };
  psychology_principles?: string[];
  options?: QuestionOption[];
  [extra: string]: unknown;
}

export interface QuestionModule {
  code: string;
  name: string;
  question_count: number;
}

export interface QuestionsArtifact {
  metadata: {
    artifact: string;
    version: string;
    generated_for: string;
    total_questions: number;
    modules: QuestionModule[];
    [extra: string]: unknown;
  };
  questions: Question[];
}

export interface RuleCondition {
  attribute?: string;
  operator?: string;
  value?: unknown;
  values?: unknown[];
  all?: RuleCondition[];
  any?: RuleCondition[];
  [extra: string]: unknown;
}

export interface RuleAction {
  action: string;
  [extra: string]: unknown;
}

export interface BranchRule {
  rule_id: string;
  name: string;
  priority: number;
  when: RuleCondition;
  actions: RuleAction[];
  rationale?: string;
  [extra: string]: unknown;
}

export interface DerivationRule {
  rule_id: string;
  derived_attribute: string;
  strategy: string;
  expression?: string;
  inputs: string[];
  output_type: string;
  rationale?: string;
  [extra: string]: unknown;
}

export interface EliminationRule {
  rule_id: string;
  name: string;
  when: RuleCondition;
  actions: RuleAction[];
  severity: string;
  rationale?: string;
  [extra: string]: unknown;
}

export interface ValidationRule {
  rule_id: string;
  name: string;
  type: string;
  check: RuleCondition;
  on_fail: {
    severity: string;
    user_message: string;
    re_ask_question_ids?: string[];
    [extra: string]: unknown;
  };
  [extra: string]: unknown;
}

export interface RulesArtifact {
  metadata: Record<string, unknown>;
  derivation_rules: DerivationRule[];
  branch_rules: BranchRule[];
  elimination_rules: EliminationRule[];
  validation_rules: ValidationRule[];
  ig_configuration: Record<string, unknown>;
  completion_rules: unknown;
  engagement_rules: unknown;
}

export interface FlowState {
  state_id: string;
  type: string;
  purpose: string;
  question_source: unknown;
  entry_actions?: RuleAction[];
  [extra: string]: unknown;
}

export interface FlowArtifact {
  metadata: Record<string, unknown>;
  initial_state: string;
  terminal_states: string[];
  states: FlowState[];
}
