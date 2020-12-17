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

function toTitleCase(str) {
  let search = ''
  words = str.split('_');
  for (const word in words) {
    if (Object.hasOwnProperty.call(words, word)) {
      const element = words[word];
      words[word] = element.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }
  }
  for (const word in words) {
    if (Object.hasOwnProperty.call(words, word)) {
      const element = words[word];
      search += element + ' ';
    }
  }
  return search.substr(0,search.length-1);
};

function findOtherEvidence(message, currReaction){
  let reactions = message.reactions.cache;
  let ev2 = ''
  reactions.forEach( (reaction, name) => {
    if(name === '🥶' && reaction.count > 1 && name !== currReaction){
      ev2 = 'freezing temps';
    } else if (name === '💫' && reaction.count > 1 && name !== currReaction){
      ev2 = 'orbs';
    } else if (name === '🗣️' && reaction.count > 1 && name !== currReaction){
      ev2 = 'spirit box';
    } else if (name === '✍' && reaction.count > 1 && name !== currReaction){
      ev2 = 'ghost writing';
    } else if (name === '5️⃣' && reaction.count > 1 && name !== currReaction){
      ev2 = 'emf';
    } else if (name === '🖐️' && reaction.count > 1 && name !== currReaction){
      ev2 = 'fingerprints';
    }
  });
  return ev2;
}

function optionsCheck(reaction){
  let response = 'Current Ghost options are: \n';
  let evList = [];
  switch(reaction.emoji.name){
    case '🥶':
      ev2 = findOtherEvidence(reaction.message,'🥶');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('freezing temps') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'freezing temps' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('freezing temps')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'freezing temps'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case '💫':
      ev2 = findOtherEvidence(reaction.message,'💫');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('orbs') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'orbs' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('orbs')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'orbs'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case '🗣️':
      ev2 = findOtherEvidence(reaction.message,'🗣️');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('spirit box') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'spirit box' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('spirit box')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'spirit box'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case '✍':
      ev2 = findOtherEvidence(reaction.message,'✍');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('ghost writing') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'ghost writing' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('ghost writing')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'ghost writing'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case '5️⃣':
      ev2 = findOtherEvidence(reaction.message,'5️⃣');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('emf') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'emf' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('emf')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'emf'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case '🖐️':
      ev2 = findOtherEvidence(reaction.message,'🖐️');
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('fingerprints') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'fingerprints' && evidence !== ev2){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          } else {
            if (element.includes('fingerprints')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'fingerprints'){
                  response += evidence + ','
                  evList.push(evidence);
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    default:
      console.log('Not an acceptable emoji');
  }
  response += '`Evidence options : ' + evList + '`';
  reaction.message.edit(response);
}

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
      search = toTitleCase(search);
      search = search.replace(' ','_');
      response = 'https://phasmophobia.fandom.com/wiki/' + search;
      msg.channel.send(response);
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
    if(reaction.count > 2){
      reaction.remove(user);
    } else {
      optionsCheck(reaction);
    }
  }
});

client.login(TOKEN);