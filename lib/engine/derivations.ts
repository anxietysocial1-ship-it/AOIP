import type { DerivationRule } from "@/lib/data/questionnaire/types";
import type { AnswerValue, AttributeMap } from "@/lib/engine/conditions";

interface Band {
  max?: number | null;
  max_inr?: number | null;
  value: string;
}

interface MatrixRow {
  class: string;
  investment_max_inr: number;
  turnover_max_inr: number;
}

function num(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/**
 * Compute one derived attribute from rules.json derivation_rules.
 * Strategies with machine-readable specs (matrix, bands, mapping,
 * member_values) are evaluated generically; the three boolean_logic
 * rules are transcribed from their documented `evaluation` strings.
 */
export function deriveAttribute(
  rule: DerivationRule,
  attributes: AttributeMap,
): AnswerValue | undefined {
  switch (rule.strategy) {
    case "arithmetic": {
      // DR-001: current_year - incorporation_year
      if (rule.derived_attribute === "business_vintage_years") {
        const year = num(attributes["incorporation_year"]);
        if (year === null) return undefined;
        return new Date().getFullYear() - year;
      }
      return undefined;
    }
    case "threshold_matrix": {
      // DR-002: lowest class whose BOTH thresholds are satisfied.
      const investment = num(attributes["plant_machinery_investment_inr"]);
      const turnover = num(attributes["annual_turnover_inr"]);
      if (investment === null || turnover === null) return undefined;
      const matrix = (rule as { matrix?: MatrixRow[] }).matrix ?? [];
      for (const row of matrix) {
        if (
          investment <= row.investment_max_inr &&
          turnover <= row.turnover_max_inr
        ) {
          return row.class;
        }
      }
      return "not_msme";
    }
    case "membership": {
      // DR-003 / DR-004: project_state falls back to state.
      const members =
        (rule as { member_values?: string[] }).member_values ?? [];
      const value =
        attributes[rule.inputs[0]] ?? attributes[rule.inputs[1] ?? ""];
      if (value === undefined) return undefined;
      return members.includes(String(value));
    }
    case "mapping": {
      const map =
        (rule as { mapping?: Record<string, string> }).mapping ?? {};
      const value = attributes[rule.inputs[0]];
      if (value === undefined) return undefined;
      return map[String(value)];
    }
    case "banding": {
      const bands = (rule as { bands?: Band[] }).bands ?? [];
      const value = num(attributes[rule.inputs[0]]);
      if (value === null) return undefined;
      for (const band of bands) {
        const max = band.max ?? band.max_inr;
        if (max === null || max === undefined || value <= max) {
          return band.value;
        }
      }
      return undefined;
    }
    case "boolean_logic": {
      switch (rule.derived_attribute) {
        case "is_women_led":
          return (
            attributes["gender"] === "female" ||
            ["100_women", "51_99_women"].includes(
              String(attributes["women_ownership_percent"]),
            ) ||
            attributes["women_in_management"] === true
          );
        case "is_startup_age_eligible": {
          const vintage = num(attributes["business_vintage_years"]);
          if (vintage === null) return undefined;
          return vintage <= 10;
        }
        case "is_special_category_applicant":
          return (
            ["sc", "st", "obc", "minority"].includes(
              String(attributes["social_category"]),
            ) ||
            attributes["differently_abled"] === true ||
            attributes["ex_serviceman"] === true ||
            attributes["is_women_led"] === true ||
            attributes["minority_status"] === true
          );
        default:
          return undefined;
      }
    }
    default:
      return undefined;
  }
}
