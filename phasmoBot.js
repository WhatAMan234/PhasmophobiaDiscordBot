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

const EMOJIS = ['🥶','💫','🗣️','✍','5️⃣','🖐️'];

const ghostList = JSON.parse(GHOSTS);

const INVALID_EVIDENCE_MSG = '\nInvalid 3rd evidence! Please select one of the options listed above.'

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

function getDefaultMessage(){
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
  return response;
};

function findOtherEvidence(message, currReaction){
  let reactions = message.reactions.cache;
  let ev2 = ''
  reactions.forEach( (reaction, name) => {
    if(name === EMOJIS[0] && reaction.count > 1 && name !== currReaction){
      ev2 = 'freezing temps';
    } else if (name === EMOJIS[1] && reaction.count > 1 && name !== currReaction){
      ev2 = 'orbs';
    } else if (name === EMOJIS[2] && reaction.count > 1 && name !== currReaction){
      ev2 = 'spirit box';
    } else if (name === EMOJIS[3] && reaction.count > 1 && name !== currReaction){
      ev2 = 'ghost writing';
    } else if (name === EMOJIS[4] && reaction.count > 1 && name !== currReaction){
      ev2 = 'emf';
    } else if (name === EMOJIS[5] && reaction.count > 1 && name !== currReaction){
      ev2 = 'fingerprints';
    }
  });
  return ev2;
}

function optionsCheck(reaction){
  let response = 'Current Ghost options are: \n';
  let evList = [];
  switch(reaction.emoji.name){
    case EMOJIS[0]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[0]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('freezing temps') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'freezing temps' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('freezing temps')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'freezing temps'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case EMOJIS[1]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[1]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('orbs') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'orbs' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('orbs')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'orbs'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case EMOJIS[2]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[2]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('spirit box') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'spirit box' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('spirit box')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'spirit box'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case EMOJIS[3]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[3]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('ghost writing') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'ghost writing' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('ghost writing')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'ghost writing'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case EMOJIS[4]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[4]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('emf') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'emf' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('emf')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'emf'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          }
          response = response.substr(0,response.length-1) + '\n';
        }
      }
      break;
    case EMOJIS[5]:
      ev2 = findOtherEvidence(reaction.message,EMOJIS[5]);
      for (const ghost in ghostList) {
        if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
          const element = ghostList[ghost];
          if(ev2 !== ''){
            if (element.includes('fingerprints') && element.includes(ev2)) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'fingerprints' && evidence !== ev2){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
            }
          } else {
            if (element.includes('fingerprints')) {
              response += ghost + ' : ';
              element.forEach(evidence => {
                if (evidence !== 'fingerprints'){
                  response += evidence + ','
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
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
  if(reaction.message.content.endsWith(INVALID_EVIDENCE_MSG)){
    reaction.message.edit(response+INVALID_EVIDENCE_MSG);
  } else {
    reaction.message.edit(response);
  }
}

function checkComplete(reaction){
  let reactions = reaction.message.reactions.cache;
  let evidence = [];
  let result = '';
  reactions.forEach((reaction, name) => {
    if(reaction.count === 2){
      switch(name){
        case EMOJIS[0]:
          evidence.push('freezing temps');
          break;
        case EMOJIS[1]:
          evidence.push('orbs');
          break;
        case EMOJIS[2]:
          evidence.push('spirit box');
          break;
        case EMOJIS[3]:
          evidence.push('ghost writing');
          break;
        case EMOJIS[4]:
          evidence.push('emf');
          break;
        case EMOJIS[5]:
          evidence.push('fingerprints');
          break;
        default:
          evidence.push('');
          console.log('Evidence is not in emojis');
          break;
      }
    }
  });
  for (ghost in ghostList) {
    if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
      const element = ghostList[ghost];
      if(element.includes(evidence[0]) && element.includes(evidence[1]) && element.includes(evidence[2])){
        result = ghost;
      }
    }
  }
  return result;
}

function printCompete(reaction, ghost){
  let reactions = reaction.message.reactions.cache;
  reaction.message.edit('The Ghost was a ' + ghost + '!');
  reactions.forEach((react, name)=>{
    react.remove(react.user);
  });
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
      response = getDefaultMessage();
      msg.channel.send(response).then(function (msg){
        msg.react(EMOJIS[0]);
        msg.react(EMOJIS[1]);
        msg.react(EMOJIS[2]);
        msg.react(EMOJIS[3]);
        msg.react(EMOJIS[4]);
        msg.react(EMOJIS[5])
      }).catch(function(err){
        console.log(err);
      });
    }
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  let reactions = reaction.message.reactions.cache;
  let evidenceCount = 0;
  let ghost = '';
  if(reaction.count > 1 && reaction.message.content.startsWith('Current Ghost options are:')){
    if(reaction.count > 2){
      reaction.users.remove(user);
    } else {
      reactions.forEach((react, name)=>{
        if(react.count >1){
          evidenceCount += 1;
        }
      });
      if(evidenceCount < 3){
        optionsCheck(reaction);
      } else {
        ghost = checkComplete(reaction);
        if(ghost !== ''){
          printCompete(reaction, ghost);
        } else {
          reaction.users.remove(user);
          if(!reaction.message.content.endsWith(INVALID_EVIDENCE_MSG)){
            reaction.message.edit(reaction.message.content+INVALID_EVIDENCE_MSG);
          }
        }
      }
    }
  } else if(!EMOJIS.includes(reaction.emoji.name) && reaction.message.content.startsWith('Current Ghost options are:')){
    reaction.remove();
  }
});

client.on('messageReactionRemove', (reaction, user) => {
  if(reaction.count == 1 && reaction.message.content.startsWith('Current Ghost options are:')){
    let reactions = reaction.message.reactions.cache;
    let remaining = reaction;
    reactions.forEach((react, name)=>{
      if(react.count > 1){
        remaining = react;
      }
    });
    if(remaining !== reaction){
      optionsCheck(remaining);
    } else {
      reaction.message.edit(getDefaultMessage());
    }
  }
});

client.login(TOKEN);