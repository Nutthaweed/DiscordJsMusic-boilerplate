const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed} = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play the song!")
    .addSubcommand((subcommand) => 
    subcommand
      .setName("song")
      .setDescription("Loads a song from an url")
      .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
       )
    .addSubcommand((subcommand) =>
    subcommand
    .setName("playlist")
    .setDescription("Loads a playlist from an url")
    .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
    )
    .addSubcommand((subcommand) =>  
       subcommand
       .setName("search")
       .setDescription("searches for a song" )
       .addStringOption((option) => option.setName("searchterms").setDescription("the search keywords").setRequired(true))
    ),
    run: async ({client, interaction})=> {
        if (!interaction.member.voice.channel)
        return interaction.reply("😡You need to be in a voice channel!")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
            return interaction.editReply("No result")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
            .setDescription(`🎵 Star Platinum had been chosen **[${song.title}](${song.url})**  to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
        } else if (interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0)
            return interaction.editReply("❌No result")

            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
            .setDescription(`**${result.tracks.length} songs from[${playlist.title}](${playlist.url})** has been added to the Queue`)
            .setThumbnail(playlist.thumbnail)
            .setFooter({ text: `Duration: ${playlist.duration}` })
        } else if (interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
            return interaction.editReply("No result")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
            .setDescription(`🎶**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}
