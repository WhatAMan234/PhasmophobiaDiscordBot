const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const TOKEN = config.token;
const PREFIX = config.prefix;
const WIKI_CMD = PREFIX + 'wiki';
const OPTIONS_CMD = PREFIX + 'options';

const GHOSTS = '{ '+
  '"phantom" : ["freezing temps","emf","orbs"],'+
  '"banshee" : ["freezing temps","emf","fingerprints"],'+
  '"mare" : ["freezing temps","orbs","spirit box"],'+
  '"yurei" : ["freezing temps","orbs","ghost writing"],'+
  '"demon" : ["freezing temps","spirit box","ghost writing"],'+
  '"wraith" : ["freezing temps","spirit box","fingerprints"],'+
  '"jinn" : ["emf","orbs","spirit box"],'+
  '"shade" : ["emf","orbs","ghost writing"],'+
  '"oni" : ["emf","spirit box","ghost writing"],'+
  '"revenant" : ["emf","ghost writing","fingerprints"],'+
  '"poltergeist" : ["orbs","spirit box","fingerprints"],'+
  '"spirit" : ["spirit box","ghost writing","fingerprints"]}';

const ghostList = JSON.parse(GHOSTS);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(PREFIX)){
    if (msg.content.startsWith(WIKI_CMD)) {
      search = msg.content.substr(WIKI_CMD.length+1);
      if (search == 'highschool' || search == 'hs'){
            search = 'brown stone highschool';
      }
      if (!search.istitle()){
            search = search.title()
        search = re.sub(' ', '_', search)
        response = 'https://phasmophobia.fandom.com/wiki/' + search;
        msg.channel.send(response);
      }
    } else if (msg.content.startsWith(OPTIONS_CMD)){
      let response = 'Current Ghost options are: \n'
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          response += ghost + ' : ';
          const element = ghostList[ghost];
          element.forEach(evidence => {
            response += evidence + ', '
          });
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      response += '`Evidence options: freezing temps temps, emf, orbs, spirit box, ghost ghost writing, fingerprints`';
      msg.channel.send(response).then(function (msg){
        msg.react('🥶');
        msg.react('💫');
        msg.react('🗣️');
        msg.react('✍');
        msg.react('5️⃣');
        msg.react('🖐️')
      }).catch(function(err){
        console.log(err);
      });
    }
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  if(reaction.count > 1 && reaction.message.content.startsWith('Current Ghost options are:')){
    initial = [];
    switch(reaction.emoji.name){
      case '🥶':
        reaction.message.edit('test');
        break;
      case '💫':
      
        break;
      case '🗣️':

        break;
      case '✍':

        break;
      case '5️⃣':

        break;
      case '🖐️':

        break;
      default:
        console.log('Not an acceptable emoji');
    }
  }
});

client.login(TOKEN);