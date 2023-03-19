const { REST, Routes } = require('discord.js');
const commands = [
	  {
		      name: 'gpt35',
		      description: 'chatgpt 3.5 を利用します',
		    },
];

let TOKEN = ""
let CLIENT_ID = ""

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()){
    if (interaction.commandName === 'gpt35') {
      const modal = new ModalBuilder()
        .setCustomId('myModal')
        .setTitle('My Modal');
      const hobbiesInput = new TextInputBuilder()
        .setCustomId('questionsInput')
        .setLabel("please type your request for chatgpt")
        .setStyle(TextInputStyle.Paragraph);
      const firstActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
      //await interaction.deleteReply();
    }
  }
  if (interaction.isModalSubmit()){
    const value = interaction.fields.getTextInputValue('questionsInput');
    await interaction.reply(`Your favorite color is ${value}`);
  }
});

client.login(TOKEN);
