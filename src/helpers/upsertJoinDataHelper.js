const { upsertJoinData } = require('../repositories/logRepository');
const serializer = require('../util/serializer');

const getUniqueEmojiIds = (tokens, type) => [
  ...new Set(tokens.filter(token => token.type === type).map(token => token.id))
];

module.exports = (message, tokens) => {
  const callbacks = [
    ...getUniqueEmojiIds(tokens, 'discordEmoji').map(emojiId => ({
      title: 'emojis',
      joinData: {
        id: emojiId,
        name: message.channel.guild.emojis.resolve(emojiId).name
      }
    })),
    ...getUniqueEmojiIds(tokens, 'defaultEmoji').map(emojiId => ({
      title: 'emojis',
      joinData: { id: emojiId, name: emojiId }
    })),
    {
      title: 'users',
      joinData: { id: message.author.id, name: message.author.tag }
    },
    {
      title: 'channels',
      joinData: { id: message.channel.id, name: message.channel.name }
    },
    {
      title: 'guilds',
      joinData: {
        id: message.channel.guild.id,
        name: message.channel.guild.name
      }
    }
  ].map(joinData => async () => upsertJoinData(joinData));

  serializer(callbacks);
};