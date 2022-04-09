const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
     .setName("skip")
     .setDescription("Skip the song"),
     run: async ({ client, interaction }) => {
         const queue = client.player.getQueue(interaction.guildId)
         if (!queue) return await interaction.editReply("There are no songs in the queue")

           const currentSong = queue.current

            queue.skip()
            await interaction.editReply({
                embed: [
                    new MessageEmbed().setDescription(`King Crimson is now skip ${currentSong.title}`).setThumbnail(currentSong.thumbnail)
                ]
            })
     },
}