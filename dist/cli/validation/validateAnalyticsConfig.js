"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsConfig = getAnalyticsConfig;
exports.validateAnalyticsConfig = validateAnalyticsConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
// Load config schema
const configSchemaPath = path_1.default.resolve(__dirname, "../../schemas/analytics.config.schema.json");
const configSchema = JSON.parse(fs_1.default.readFileSync(configSchemaPath, "utf8"));
const validateConfigSchema = ajv.compile(configSchema);
function validateFileExtension(filePath, allowedExtensions) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return false;
    }
    return true;
}
function getAnalyticsConfig() {
    const configPath = path_1.default.resolve(process.cwd(), "analytics.config.json");
    if (!fs_1.default.existsSync(configPath)) {
        console.error("❌ analytics.config.json file is missing in project root.");
        process.exit(1);
    }
    try {
        return JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
    }
    catch (error) {
        console.error("❌ Failed to parse analytics.config.json:", error);
        process.exit(1);
    }
}
function validateAnalyticsConfig(config) {
    if (!validateConfigSchema(config)) {
        console.error("❌ Config schema validation failed:", validateConfigSchema.errors);
        return false;
    }
    let isValid = true;
    // Validate each generation config
    config.generates.forEach((genConfig, index) => {
        console.log(`\n🔍 Validating generation config #${index + 1}:`);
        // Validate events file
        if (!genConfig.events) {
            console.error(`❌ Missing required "events" field in generation config #${index + 1}`);
            isValid = false;
        }
        else if (!validateFileExtension(genConfig.events, [".json"])) {
            console.error(`❌ Invalid file extension for events file "${genConfig.events}". Expected: .json`);
            isValid = false;
        }
        // Validate globals file if provided
        if (genConfig.globals) {
            if (!validateFileExtension(genConfig.globals, [".json"])) {
                console.error(`❌ Invalid file extension for globals file "${genConfig.globals}". Expected: .json`);
                isValid = false;
            }
        }
        // Validate output file
        if (!genConfig.output) {
            console.error(`❌ Missing required "output" field in generation config #${index + 1}`);
            isValid = false;
        }
        else if (!validateFileExtension(genConfig.output, [".js", ".ts", ".tsx"])) {
            console.error(`❌ Invalid file extension for output file "${genConfig.output}". Expected one of: .js, .ts, .tsx`);
            isValid = false;
        }
    });
    if (isValid) {
        console.log("\n✅ All generation configs are valid");
    }
    return isValid;
}
