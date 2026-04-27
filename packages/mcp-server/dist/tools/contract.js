"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractGetQualityScoreHandler = exports.contractGetQualityScoreDefinition = exports.contractGetComponentHandler = exports.contractGetComponentDefinition = exports.contractListDriftedHandler = exports.contractListDriftedDefinition = exports.contractGetTokenHandler = exports.contractGetTokenDefinition = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TOKEN_DIR = "contract/tokens";
const COMP_DIR = "contract/components";
// ---------------------------------------------------------------------------
// Inline frontmatter parser (flat YAML only — no nested objects/arrays)
// ---------------------------------------------------------------------------
function parseFrontmatter(raw) {
    const match = raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*([\s\S]*)$/);
    if (!match)
        return { data: {}, content: raw };
    const data = {};
    for (const line of match[1].split(/\r?\n/)) {
        const colon = line.indexOf(":");
        if (colon === -1)
            continue;
        const key = line.slice(0, colon).trim();
        const rawVal = line.slice(colon + 1).trim();
        if (rawVal === "true") {
            data[key] = true;
            continue;
        }
        if (rawVal === "false") {
            data[key] = false;
            continue;
        }
        if (rawVal === "null" || rawVal === "~" || rawVal === "") {
            data[key] = null;
            continue;
        }
        // Quoted string
        if ((rawVal.startsWith('"') && rawVal.endsWith('"')) ||
            (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
            data[key] = rawVal.slice(1, -1);
            continue;
        }
        const num = Number(rawVal);
        data[key] = isNaN(num) ? rawVal : num;
    }
    return { data, content: match[2].trim() };
}
function readTokens(tokenDir) {
    if (!fs.existsSync(tokenDir))
        return [];
    return fs.readdirSync(tokenDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
        const raw = fs.readFileSync(path.join(tokenDir, f), "utf8");
        const { data: fm, content } = parseFrontmatter(raw);
        const slug = f.replace(/\.mdx$/, "");
        return {
            slug,
            token: String(fm.token ?? slug),
            value: fm.value != null ? String(fm.value) : null,
            figmaValue: fm["figma-value"] != null ? String(fm["figma-value"]) : null,
            status: String(fm.status ?? "unknown"),
            resolved: fm.resolved === true,
            collection: fm.collection != null ? String(fm.collection) : null,
            source: fm.source != null ? String(fm.source) : null,
            lastUpdated: fm["last-updated"] != null ? String(fm["last-updated"]) : null,
            resolveDecision: fm["resolve-decision"] != null ? String(fm["resolve-decision"]) : null,
            prose: content,
        };
    });
}
function readComponents(compDir) {
    if (!fs.existsSync(compDir))
        return [];
    return fs.readdirSync(compDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
        const raw = fs.readFileSync(path.join(compDir, f), "utf8");
        const { data: fm, content } = parseFrontmatter(raw);
        const slug = f.replace(/\.mdx$/, "");
        return {
            slug,
            component: String(fm.component ?? slug),
            parity: String(fm.parity ?? "unknown"),
            path: fm.path != null ? String(fm.path) : null,
            figmaNode: fm["figma-node"] != null ? String(fm["figma-node"]) : null,
            evidenceStorybook: fm["evidence-storybook"] != null ? String(fm["evidence-storybook"]) : null,
            lastUpdated: fm["last-updated"] != null ? String(fm["last-updated"]) : null,
            prose: content,
        };
    });
}
function computeScore(tokens, components) {
    const totalT = tokens.length;
    const cleanT = tokens.filter((t) => t.status === "clean").length;
    const driftedUnresolved = tokens.filter((t) => t.status === "drifted" && !t.resolved).length;
    const missingInFigma = tokens.filter((t) => t.status === "missing-in-figma").length;
    const totalC = components.length;
    const cleanC = components.filter((c) => c.parity === "clean").length;
    const tBase = totalT > 0 ? cleanT / totalT : 1;
    const tScore = tBase - driftedUnresolved * 0.05 - missingInFigma * 0.03;
    const cScore = totalC > 0 ? cleanC / totalC : 1;
    const combined = totalC > 0 ? (tScore + cScore) / 2 : tScore;
    return Math.max(0, Math.round(combined * 100));
}
// ---------------------------------------------------------------------------
// contract_get_token
// ---------------------------------------------------------------------------
exports.contractGetTokenDefinition = {
    name: "contract_get_token",
    description: "Retrieve a single token contract from contract/tokens/ by slug or CSS variable name. " +
        "Returns frontmatter fields (value, figma-value, status, resolved, collection, resolve-decision) " +
        "plus the Hermes prose body. Returns an error if the token is not found.",
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Token slug (e.g. 'color-primary') or CSS variable name (e.g. '--color-primary').",
            },
        },
        required: ["name"],
    },
};
const contractGetTokenHandler = async (args, projectRoot) => {
    const slug = args.name.replace(/^--/, "").replace(/\//g, "-");
    const tokens = readTokens(path.join(projectRoot, TOKEN_DIR));
    const token = tokens.find((t) => t.slug === slug || t.token === slug);
    if (!token) {
        return {
            content: [{ type: "text", text: `Token not found: ${args.name}. Run \`npm run generate-contracts\` to create contracts from tokens.bridge.json.` }],
            isError: true,
        };
    }
    return {
        content: [{ type: "text", text: JSON.stringify(token, null, 2) }],
    };
};
exports.contractGetTokenHandler = contractGetTokenHandler;
// ---------------------------------------------------------------------------
// contract_list_drifted
// ---------------------------------------------------------------------------
exports.contractListDriftedDefinition = {
    name: "contract_list_drifted",
    description: "List all token contracts that require attention: status is 'drifted' or 'missing-in-figma'. " +
        "Optionally filter to only unresolved items. Returns slug, status, value, figma-value, and resolved flag.",
    inputSchema: {
        type: "object",
        properties: {
            unresolvedOnly: {
                type: "boolean",
                description: "When true, only return tokens where resolved is false. Defaults to false (return all drifted).",
            },
        },
    },
};
const contractListDriftedHandler = async (args, projectRoot) => {
    const tokens = readTokens(path.join(projectRoot, TOKEN_DIR));
    let drifted = tokens.filter((t) => t.status === "drifted" || t.status === "missing-in-figma");
    if (args.unresolvedOnly) {
        drifted = drifted.filter((t) => !t.resolved);
    }
    const summary = drifted.map((t) => ({
        slug: t.slug,
        status: t.status,
        value: t.value,
        figmaValue: t.figmaValue,
        resolved: t.resolved,
        collection: t.collection,
    }));
    return {
        content: [{
                type: "text",
                text: drifted.length === 0
                    ? "No drifted tokens found."
                    : JSON.stringify({ count: drifted.length, tokens: summary }, null, 2),
            }],
    };
};
exports.contractListDriftedHandler = contractListDriftedHandler;
// ---------------------------------------------------------------------------
// contract_get_component
// ---------------------------------------------------------------------------
exports.contractGetComponentDefinition = {
    name: "contract_get_component",
    description: "Retrieve a single component contract from contract/components/ by slug or component name. " +
        "Returns frontmatter fields (parity, path, figma-node, evidence-storybook) plus the Hermes prose body.",
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Component slug or name (e.g. 'Button' or 'button').",
            },
        },
        required: ["name"],
    },
};
const contractGetComponentHandler = async (args, projectRoot) => {
    const slug = args.name.toLowerCase().replace(/\s+/g, "-");
    const components = readComponents(path.join(projectRoot, COMP_DIR));
    const comp = components.find((c) => c.slug === slug ||
        c.slug === args.name ||
        c.component.toLowerCase() === args.name.toLowerCase());
    if (!comp) {
        return {
            content: [{ type: "text", text: `Component not found: ${args.name}. Run \`/check-parity\` to generate component contracts.` }],
            isError: true,
        };
    }
    return {
        content: [{ type: "text", text: JSON.stringify(comp, null, 2) }],
    };
};
exports.contractGetComponentHandler = contractGetComponentHandler;
// ---------------------------------------------------------------------------
// contract_get_quality_score
// ---------------------------------------------------------------------------
exports.contractGetQualityScoreDefinition = {
    name: "contract_get_quality_score",
    description: "Compute and return the current design system quality score (0–100). " +
        "Reads all contract/tokens/ and contract/components/ MDX files. " +
        "Score formula: tokens ratio minus unresolved drift penalties, averaged with components ratio. " +
        "< 60 = critical, 60–80 = needs attention, ≥ 80 = clean.",
    inputSchema: {
        type: "object",
        properties: {},
    },
};
const contractGetQualityScoreHandler = async (_args, projectRoot) => {
    const tokens = readTokens(path.join(projectRoot, TOKEN_DIR));
    const components = readComponents(path.join(projectRoot, COMP_DIR));
    const score = computeScore(tokens, components);
    const totalT = tokens.length;
    const cleanT = tokens.filter((t) => t.status === "clean").length;
    const driftedT = tokens.filter((t) => t.status === "drifted").length;
    const missingT = tokens.filter((t) => t.status === "missing-in-figma").length;
    const unresolvedT = tokens.filter((t) => (t.status === "drifted" || t.status === "missing-in-figma") && !t.resolved).length;
    const totalC = components.length;
    const cleanC = components.filter((c) => c.parity === "clean").length;
    const driftedC = components.filter((c) => c.parity === "drifted").length;
    const state = score >= 80 ? "clean" : score >= 60 ? "needs-attention" : "critical";
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    score,
                    state,
                    tokens: { total: totalT, clean: cleanT, drifted: driftedT, missingInFigma: missingT, unresolvedOpen: unresolvedT },
                    components: { total: totalC, clean: cleanC, drifted: driftedC },
                }, null, 2),
            }],
    };
};
exports.contractGetQualityScoreHandler = contractGetQualityScoreHandler;
//# sourceMappingURL=contract.js.map