const { SlashCommandBuilder } = require("@discordjs/builders")


module.exports = {
    data: new SlashCommandBuilder()
     .setName("pause")
     .setDescription("pause the song"),
     run: async ({ client, interaction }) => {
         const queue = client.player.getQueue(interaction.guildId)
         if (!queue) return await interaction.editReply("There are no songs in the queue")

            queue.setPaused(true)
            await interaction.editReply("🌎 THE WORLD, NOW THE TIME IS STOP")
     }
}