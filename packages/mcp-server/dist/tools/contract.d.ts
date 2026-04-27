/**
 * contract.ts — SYSTMIX-210
 *
 * MDX contract indexer: reads contract/tokens/ and contract/components/,
 * parses frontmatter, and answers 4 queries:
 *   contract_get_token(name)
 *   contract_list_drifted()
 *   contract_get_component(name)
 *   contract_get_quality_score()
 *
 * Intentionally no gray-matter dep — a small inline parser handles the
 * flat YAML frontmatter used by generate-contracts.ts.
 */
import type { ToolDefinition, ToolHandler } from "../types.js";
export declare const contractGetTokenDefinition: ToolDefinition;
export declare const contractGetTokenHandler: ToolHandler<{
    name: string;
}>;
export declare const contractListDriftedDefinition: ToolDefinition;
export declare const contractListDriftedHandler: ToolHandler<{
    unresolvedOnly?: boolean;
}>;
export declare const contractGetComponentDefinition: ToolDefinition;
export declare const contractGetComponentHandler: ToolHandler<{
    name: string;
}>;
export declare const contractGetQualityScoreDefinition: ToolDefinition;
export declare const contractGetQualityScoreHandler: ToolHandler;
//# sourceMappingURL=contract.d.ts.map