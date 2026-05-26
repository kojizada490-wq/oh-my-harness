import { formatText } from "../core/text.js";
import type { InitOptions, Locale } from "../core/types.js";
import type { WizardStep } from "./init-wizard-state.js";

export const DEFAULT_OPTION_VALUE = "default";
export const BACK_OPTION_VALUE = "back";
export const EXIT_OPTION_VALUE = "exit";
export const RUN_OPTION_VALUE = "run";

export type WizardChoiceOption = {
  label: string;
  value: string;
};

type BaseOption = {
  label: string;
  value: string;
};

function defaultOptionLabel(locale: Locale, currentValueLabel: string): string {
  return `${formatText(locale, "tuiUseDefault")} (${currentValueLabel})`;
}

function buildChoiceOptions(
  locale: Locale,
  currentValue: string,
  currentValueLabel: string,
  options: BaseOption[],
  tail: BaseOption,
): WizardChoiceOption[] {
  return [
    {
      label: defaultOptionLabel(locale, currentValueLabel),
      value: DEFAULT_OPTION_VALUE,
    },
    ...options.filter((option) => option.value !== currentValue),
    tail,
  ];
}

export function isChoiceScreen(step: WizardStep): boolean {
  return (
    step === "locale"
    || step === "scope"
    || step === "force"
    || step === "dryRun"
    || step === "confirm"
  );
}

export function buildStepOptions(
  step: WizardStep,
  options: InitOptions,
): WizardChoiceOption[] {
  if (step === "locale") {
    return buildChoiceOptions(
      options.locale,
      options.locale,
      options.locale,
      [
        { label: "zh", value: "zh" },
        { label: "en", value: "en" },
      ],
      {
        label: formatText(options.locale, "tuiMenuExit"),
        value: EXIT_OPTION_VALUE,
      },
    );
  }

  if (step === "scope") {
    const currentValue = options.global ? "global" : "project";
    const currentLabel = options.global
      ? formatText(options.locale, "tuiScopeGlobal")
      : formatText(options.locale, "tuiScopeProject");

    return buildChoiceOptions(
      options.locale,
      currentValue,
      currentLabel,
      [
        {
          label: formatText(options.locale, "tuiScopeProject"),
          value: "project",
        },
        {
          label: formatText(options.locale, "tuiScopeGlobal"),
          value: "global",
        },
      ],
      {
        label: formatText(options.locale, "tuiBack"),
        value: BACK_OPTION_VALUE,
      },
    );
  }

  if (step === "force") {
    const currentValue = options.force ? "on" : "off";
    const currentLabel = options.force
      ? formatText(options.locale, "tuiForceOn")
      : formatText(options.locale, "tuiForceOff");

    return buildChoiceOptions(
      options.locale,
      currentValue,
      currentLabel,
      [
        { label: formatText(options.locale, "tuiForceOn"), value: "on" },
        { label: formatText(options.locale, "tuiForceOff"), value: "off" },
      ],
      {
        label: formatText(options.locale, "tuiBack"),
        value: BACK_OPTION_VALUE,
      },
    );
  }

  if (step === "dryRun") {
    const currentValue = options.dryRun ? "on" : "off";
    const currentLabel = options.dryRun
      ? formatText(options.locale, "tuiDryRunOn")
      : formatText(options.locale, "tuiDryRunOff");

    return buildChoiceOptions(
      options.locale,
      currentValue,
      currentLabel,
      [
        { label: formatText(options.locale, "tuiDryRunOn"), value: "on" },
        { label: formatText(options.locale, "tuiDryRunOff"), value: "off" },
      ],
      {
        label: formatText(options.locale, "tuiBack"),
        value: BACK_OPTION_VALUE,
      },
    );
  }

  if (step === "confirm") {
    return [
      { label: formatText(options.locale, "tuiConfirmRun"), value: RUN_OPTION_VALUE },
      { label: formatText(options.locale, "tuiBack"), value: BACK_OPTION_VALUE },
      { label: formatText(options.locale, "tuiMenuExit"), value: EXIT_OPTION_VALUE },
    ];
  }

  return [];
}
