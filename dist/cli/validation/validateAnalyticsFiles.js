"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalyticsFiles = validateAnalyticsFiles;
const path_1 = __importDefault(require("path"));
const logging_1 = require("./logging");
const validateAnalyticsConfig_1 = require("./validateAnalyticsConfig");
const validateAnalyticsEvents_1 = require("./validateAnalyticsEvents");
const analyticsConfigHelper_1 = require("../utils/analyticsConfigHelper");
const validateAnalyticsGroups_1 = require("./validateAnalyticsGroups");
const validateAnalyticsDimensions_1 = require("./validateAnalyticsDimensions");
function validateAnalyticsFiles() {
    var _a, _b, _c, _d;
    const config = (0, analyticsConfigHelper_1.getAnalyticsConfig)();
    const configPath = path_1.default.resolve(process.cwd(), "analytics.config.json");
    const configResult = (0, validateAnalyticsConfig_1.validateAnalyticsConfig)(configPath, { filePath: configPath });
    if (!configResult.isValid) {
        return false;
    }
    // Process each generation config
    for (const genConfig of config.generates) {
        const eventsPath = path_1.default.resolve(process.cwd(), genConfig.events);
        // Track group names to check for duplicates
        const groupNames = new Set();
        const duplicateGroups = new Set();
        let hasValidGroups = true;
        // First pass: collect all group names and check for duplicates
        if (genConfig.groups) {
            for (const groupFile of genConfig.groups) {
                const groupPath = path_1.default.resolve(process.cwd(), groupFile);
                const groupsResult = (0, validateAnalyticsGroups_1.validateGroups)(groupPath, eventsPath);
                if (!groupsResult.isValid) {
                    hasValidGroups = false;
                    continue;
                }
                // Check for duplicate group names
                (_b = (_a = groupsResult.data) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.forEach((group) => {
                    if (groupNames.has(group.name)) {
                        duplicateGroups.add(group.name);
                    }
                    else {
                        groupNames.add(group.name);
                    }
                });
            }
        }
        // If we found duplicate groups, log the error
        if (duplicateGroups.size > 0) {
            const errorMessage = `Found duplicate group names across group files: ${Array.from(duplicateGroups).join(', ')}`;
            (0, logging_1.logValidationErrors)([errorMessage]);
            hasValidGroups = false;
        }
        // Track dimension names to check for duplicates
        const dimensionNames = new Set();
        const duplicateDimensions = new Set();
        let hasValidDimensions = true;
        // Validate dimensions if present
        if (genConfig.dimensions) {
            for (const dimensionFile of genConfig.dimensions) {
                const dimensionPath = path_1.default.resolve(process.cwd(), dimensionFile);
                const dimensionsResult = (0, validateAnalyticsDimensions_1.validateDimensions)(dimensionPath, eventsPath);
                if (!dimensionsResult.isValid) {
                    hasValidDimensions = false;
                    continue;
                }
                // Check for duplicate dimension names
                (_d = (_c = dimensionsResult.data) === null || _c === void 0 ? void 0 : _c.dimensions) === null || _d === void 0 ? void 0 : _d.forEach((dim) => {
                    if (dimensionNames.has(dim.name)) {
                        duplicateDimensions.add(dim.name);
                    }
                    else {
                        dimensionNames.add(dim.name);
                    }
                });
            }
        }
        // If we found duplicate dimensions, log the error
        if (duplicateDimensions.size > 0) {
            const errorMessage = `Found duplicate dimension names across dimension files: ${Array.from(duplicateDimensions).join(', ')}`;
            (0, logging_1.logValidationErrors)([errorMessage]);
            hasValidDimensions = false;
        }
        if (!hasValidGroups || !hasValidDimensions) {
            return false;
        }
        const eventsResult = (0, validateAnalyticsEvents_1.validateEvents)(eventsPath, dimensionNames, true);
        if (!eventsResult.isValid) {
            return false;
        }
    }
    return true;
}
