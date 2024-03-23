export type Command = {
  name: string;
  description: string;
  options: CommandOption[];
  execute: (interaction: CommandInteraction) => Promise<void>;
  help?: string;
};

export type CommandOptionType = "STRING" | "INTEGER" | "BOOLEAN";

export type CommandOptionChoice = {
  name: string;
  value: string | number;
};

export type CommandOption = {
  type: CommandOptionType;
  name: string;
  description: string;
  required: boolean;
  choices?: CommandOptionChoice[];
};

export type CommandInteraction = {
  id: string;
  type: InteractionType;
  data: CommandInteractionData[];
};

export type InteractionType = "APPLICATION_COMMAND";

export type CommandInteractionData = {
  optionName: string;
  optionValue: string | number | boolean;
};
