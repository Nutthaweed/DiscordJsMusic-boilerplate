const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
     .setName("info")
     .setDescription("information about the bot"),
     run: async ({ client, interaction }) => {
         const queue = client.player.getQueue(interaction.guildId)
         if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the queue")

            let bar = queue.createProgressBar({
               queue: false,
               length: 19
            })
            await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Currently Playing [${song.duration}](${song.title})\n\n` + bar)],
            })
     }
}