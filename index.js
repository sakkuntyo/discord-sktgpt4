const { REST, Routes } = require('discord.js');
const commands = [
	  {
		      name: 'gpt35',
		      description: 'chatgpt 3.5 を利用します',
		    },
];

let DISCORD_TOKEN = ""
let DISCORD_CLIENT_ID = ""
let CHATGPT_TOKEN = ""

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
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
const axios = require("axios");

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
    }
  }
  if (interaction.isModalSubmit()){
    const value = interaction.fields.getTextInputValue('questionsInput');
    //await interaction.deferReply("chatgpt is thinking...aaa");
    
    let data = {
      model:"gpt-3.5-turbo",
      messages: [
        {
          role:"user",
          content:value
        }
      ],
      temperature:0.7
    }

    let headers = {
      "Content-Type":'application/json',
      "Authorization":`Bearer ${CHATGPT_TOKEN}`
    }

    var gptres = await axios.post("https://api.openai.com/v1/chat/completions", data, {headers: headers})
    var message = value + "\n" +
		  gptres.data.choices[0].message.content
    await interaction.reply(message);
  }
});

client.login(DISCORD_TOKEN);
