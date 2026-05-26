import assert from "node:assert/strict";
import test from "node:test";

import type { InitOptions } from "../core/types.js";
import {
  BACK_OPTION_VALUE,
  buildStepOptions,
  DEFAULT_OPTION_VALUE,
  EXIT_OPTION_VALUE,
  RUN_OPTION_VALUE,
} from "./init-wizard-options.js";

function createOptions(overrides: Partial<InitOptions> = {}): InitOptions {
  return {
    targetRoot: "/tmp/demo",
    force: false,
    global: false,
    dryRun: false,
    locale: "zh",
    ...overrides,
  };
}

test("locale step keeps only the alternate locale plus exit", () => {
  const stepOptions = buildStepOptions("locale", createOptions({ locale: "zh" }));

  assert.deepEqual(
    stepOptions.map((option) => option.value),
    [DEFAULT_OPTION_VALUE, "en", EXIT_OPTION_VALUE],
  );
});

test("scope step keeps only the alternate scope plus back", () => {
  const stepOptions = buildStepOptions("scope", createOptions({ global: false }));

  assert.deepEqual(
    stepOptions.map((option) => option.value),
    [DEFAULT_OPTION_VALUE, "global", BACK_OPTION_VALUE],
  );
});

test("force step keeps only the alternate toggle plus back", () => {
  const stepOptions = buildStepOptions("force", createOptions({ force: true }));

  assert.deepEqual(
    stepOptions.map((option) => option.value),
    [DEFAULT_OPTION_VALUE, "off", BACK_OPTION_VALUE],
  );
});

test("confirm step keeps explicit run, back, and exit choices", () => {
  const stepOptions = buildStepOptions("confirm", createOptions());

  assert.deepEqual(
    stepOptions.map((option) => option.value),
    [RUN_OPTION_VALUE, BACK_OPTION_VALUE, EXIT_OPTION_VALUE],
  );
});
