import { Command, CommandInteraction } from "types/commands";

const editProfileCommand: Command = {
  name: "edit-profile",
  description: "Edit your profile",
  options: [
    {
      type: "STRING",
      name: "field",
      description: "The field you want to edit",
      required: true,
      choices: [
        {
          name: "Name",
          value: "name",
        },
        {
          name: "Age",
          value: "age",
        },
        {
          name: "Location",
          value: "location",
        },
      ],
    },
    {
      type: "STRING",
      name: "value",
      description: "The new value for the field",
      required: true,
    },
  ],
  execute,
  help: "Edit your profile",
};

async function execute(interaction: CommandInteraction) {}

export default editProfileCommand;
