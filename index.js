const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const hastebin = require('hastebin.js');
const prefix = "!!";
const interval = 120000;
const haste = new hastebin({});
const token = "";
const yourid = "";
var stuff = {
    servers:[
        {
            channel: "550838205495115777",
            message: "550849043425787914",
            url: "217.11.249.93:27206"
        },
        {
            channel: "550838171634761729",
            message: "550849054939152406",
            url: "217.11.249.93:27539"
         },
        {
            channel: "550838152512667668",
            message: "550849061809553419",
            url: "217.11.249.93:27580"
         },
        {
            channel: "550838188697190410",
            message: "550849071405858817",
            url: "217.11.249.93:27719"
         },

    ]
};


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    stuff.servers.forEach(async (e, i)=>{
        stuff.servers[i].obj = await client.channels.get(e.channel).fetchMessage(e.message);
        return makeInterval(e.url, stuff.servers[i].obj);
    })

});

async function makeInterval(url, msg){
    setInterval(()=>{
        return request(`https://query.fakaheda.eu/${url}.feed`, async (err,res,body)=>{
            if(err) return msg.edit("ERROR: "+err);
            let data = JSON.parse(body);
            let plrString = "";
            data.players_list.forEach(e=>{
                plrString += `${e.name}\n`
            });
            var link = "No players on the server!";
            if(plrString !== ""){
                link = await haste.post(plrString);
            }

            const embed = {
                "title": "Status",
                "description": url,
                "color": 1498995,
                "timestamp": new Date(),
                "thumbnail": {
                    "url": "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F48%2FTeam_Fortress_2_style_logo.svg%2F1200px-Team_Fortress_2_style_logo.svg.png&f=1"
                },
                "fields": [
                    {
                        "name": "Players",
                        "value": `${data.players}/${data.slots}`
                    },
                    {
                        "name": "Map",
                        "value": `${data.map}`
                    },
                    {
                        "name": "Player List",
                        "value": link
                    }
                ]
            };
            return msg.edit({embed});
        })
    },interval)
}

const clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
};

client.on('message', message => {
    const args = message.content.split(" ").slice(1);

    if (message.content.startsWith(prefix + "eval")) {
        if(message.author.id !== yourid) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});

client.login(token);
