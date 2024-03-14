const { ShardingManager, WebhookClient, EmbedBuilder } = require('discord.js');
const chalk = new require('chalk');
const { token, shard: totalShards, webhook: url } = require("./config.json");
const kullanıcıAdı = "rasim";
let wb;

if (url) {
    try {
        wb = new WebhookClient({ url });
    } catch (e) {
        console.error('Webhook oluşturulamadı:', e);
    }
}

const manager = new ShardingManager('bot.js', { token, respawn: true, totalShards });

manager.on('shardCreate', shard => {
    console.log(chalk.green(`[SHARD SYSTEM] `) + chalk.red(`#${shard.id} ID'li shard başarıyla başlatıldı`));
    if (wb) {
        shard.on("disconnect", () => {
            wb.send({ embeds: [new EmbedBuilder().setDescription(`**\`#${shard.id}\` - ID'li shardın bağlantısı koptu, yeniden başlatılmayı deniyor**`).setColor("Yellow")] });
        });
        shard.on("reconnecting", () => {
            wb.send({ embeds: [new EmbedBuilder().setDescription(`**\`#${shard.id}\` - ID'li shard yeniden başlatılıyor**`).setColor("Yellow")] });
        });
        shard.on("ready", async () => {
            wb.send({ embeds: [new EmbedBuilder().setDescription(`**\`#${shard.id}\` - ID'li shard başarıyla başlatıldı**`).setColor("Green")] });
        });
        shard.on("death", () => {
            wb.send({ embeds: [new EmbedBuilder().setDescription(`**\`#${shard.id}\` - ID'li shardın bağlantısı koptu, yeniden başlatılmayı deniyor**`).setColor("Yellow")] });
        });
        shard.on("error", (err) => {
            wb.send({ embeds: [new EmbedBuilder().setDescription(`\`#${shard.id}\` - ID'li shard'a bir hata oluştu\n\n• ${err}**`).setColor("Red")] });
        });
    }
});

manager.spawn().then(() => {
    if (wb) wb.send({ embeds: [new EmbedBuilder().setDescription(`**Bütün shard'lar başarıyla başlatıldı ve kullanıma hazır**`).setColor("White")] });
    console.log(chalk.green(`[SHARD SYSTEM] `) + chalk.red(`Bot Aktif Edildi !`));
});
