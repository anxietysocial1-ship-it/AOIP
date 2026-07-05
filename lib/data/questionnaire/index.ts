/**
 * Server-side accessors for the AOIP Applicant Intelligence Engine
 * artifacts. Keep these imports out of client components — the raw
 * artifacts total ~370 KB and belong on the server (or behind an API
 * route) once the questionnaire flow ships.
 */

import flowJson from "@/lib/data/questionnaire/flow.json";
import questionsJson from "@/lib/data/questionnaire/questions.json";
import rulesJson from "@/lib/data/questionnaire/rules.json";
import type {
  FlowArtifact,
  Question,
  QuestionsArtifact,
  RulesArtifact,
} from "@/lib/data/questionnaire/types";

export const questionnaire = questionsJson as unknown as QuestionsArtifact;
export const rules = rulesJson as unknown as RulesArtifact;
export const flow = flowJson as unknown as FlowArtifact;

const QUESTIONS_BY_ID = new Map<string, Question>(
  questionnaire.questions.map((question) => [question.question_id, question]),
);

export function getQuestion(questionId: string): Question | undefined {
  return QUESTIONS_BY_ID.get(questionId);
}

export function getModuleQuestions(moduleCode: string): Question[] {
  return questionnaire.questions.filter(
    (question) => question.module === moduleCode,
  );
}

/** The engine's answer vocabulary for Q-OBJ-001 (primary_objective). */
export function getPrimaryObjectiveValues(): string[] {
  return (getQuestion("Q-OBJ-001")?.options ?? []).map(
    (option) => option.value,
  );
}

export * from "@/lib/data/questionnaire/types";
