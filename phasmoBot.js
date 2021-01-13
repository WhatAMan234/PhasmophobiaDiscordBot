const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json'); // Separate file to store the prefix and token
const TOKEN = config.token;
const PREFIX = config.prefix;
const WIKI_CMD = PREFIX + 'wiki';
const OPTIONS_CMD = PREFIX + 'options';

// All ghost options
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

/*  All used reactions for options command
    freezing temps = 🥶
    orbs           = 💫
    spirit box     = 🗣️
    ghost writing  = ✍
    emf level 5    = 5️⃣
    fingerprints   = 🖐️
    restart        = 🔄
*/
const EMOJIS = ['🥶','💫','🗣️','✍','5️⃣','🖐️','🔄'];

// list of all evidence names (used in the options check method)
const EVIDENCE = ['freezing temps','orbs','spirit box','ghost writing','emf','fingerprints'];

// converts the ghost list to a json map
const ghostList = JSON.parse(GHOSTS);

// message that is displayed when an invalid third evidence is selected
const INVALID_EVIDENCE_MSG = '\nInvalid 3rd evidence! Please select one of the options listed above.'

// used for holding the bot id for message filtering
let ID = '';

// Returns the string in title case (first letter of each word is capitalized)
// used in wiki command
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

// Returns the default message that is printed at the start of the options command
function getDefaultMessage(){
  let response = 'Current Ghost options are: \n';
  response += 'All ghosts are available as options. Try to find a piece of evidence listed below.\n';
  response += '`Evidence options: ';
  EVIDENCE.forEach(element => {
    response += element + ', ';
  });
  response = response.substring(0,response.length-2) + '`';
  return response;
};

// Used to find what other reaction, if any, has been selected
function findOtherEvidence(message, currReaction){
  let reactions = message.reactions.cache;
  let ev2 = ''
  reactions.forEach( (reaction, name) => {
    if(name === EMOJIS[0] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[0];
    } else if (name === EMOJIS[1] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[1];
    } else if (name === EMOJIS[2] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[2];
    } else if (name === EMOJIS[3] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[3];
    } else if (name === EMOJIS[4] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[4];
    } else if (name === EMOJIS[5] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[5];
    }
  });
  return ev2;
}

// Contains the logic to find the remaining options based on input emoji
function findEvidenceOptions(message, emoji, ev1){
  let response = 'Current Ghost options are: \n';
  let evList = [];
  ev2 = findOtherEvidence(message,emoji);
  for (const ghost in ghostList) {
    if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
      const element = ghostList[ghost];
      if(ev2 !== ''){
        if (element.includes(ev1) && element.includes(ev2)) {
          response += ghost + ' : ';
          element.forEach(evidence => {
            if (evidence !== ev1 && evidence !== ev2){
              response += evidence + ', ';
              if(!evList.includes(evidence)){
                evList.push(evidence);
              }
            }
          });
          response = response + '\n';
        }
      } else {
        if (element.includes(ev1)) {
          response += ghost + ' : ';
          element.forEach(evidence => {
            if (evidence !== ev1){
              response += evidence + ', ';
              if(!evList.includes(evidence)){
                evList.push(evidence);
              }
            }
          });
          response = response + '\n';
        }
      }
    }
  }
  response += '`Evidence options : ';
  evList.forEach(element => {
    response += element + ', ';
  });
  return response;
}

// Checks the remaining evidence options once a reaction is selected
function optionsCheck(reaction){
  let response = 'Current Ghost options are: \n';
  let evList = [];
  switch(reaction.emoji.name){
    case EMOJIS[0]: //FREEZING TEMPS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[0],EVIDENCE[0]);
      break;
    case EMOJIS[1]: //GHOST ORBS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[1],EVIDENCE[1]);
      break;
    case EMOJIS[2]: //SPIRIT BOX WAS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[2],EVIDENCE[2]);
      break;
    case EMOJIS[3]: //GHOST WRITING WAS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[3],EVIDENCE[3]);
      break;
    case EMOJIS[4]: //EMF WAS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[4],EVIDENCE[4]);
      break;
    case EMOJIS[5]: //FINGERPRINTS WAS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[5],EVIDENCE[5]);
      break;
    default:
      console.log('Not an acceptable emoji');
  }
  
  response = response.substring(0,response.length-2) + '`';
  response = response.replaceAll(', \n','\n');
  if(reaction.message.content.endsWith(INVALID_EVIDENCE_MSG)){
    reaction.message.edit(response+INVALID_EVIDENCE_MSG);
  } else {
    reaction.message.edit(response);
  }
}

// Checks if the correct third evidence has been found
function checkComplete(reaction){
  let reactions = reaction.message.reactions.cache;
  let evidence = [];
  let result = '';
  reactions.forEach((reaction, name) => {
    if(reaction.count === 2){
      switch(name){
        case EMOJIS[0]:
          evidence.push(EVIDENCE[0]);
          break;
        case EMOJIS[1]:
          evidence.push(EVIDENCE[1]);
          break;
        case EMOJIS[2]:
          evidence.push(EVIDENCE[2]);
          break;
        case EMOJIS[3]:
          evidence.push(EVIDENCE[3]);
          break;
        case EMOJIS[4]:
          evidence.push(EVIDENCE[4]);
          break;
        case EMOJIS[5]:
          evidence.push(EVIDENCE[5]);
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

// Edits the message with the ghost name based on the 3 evidences found
function printCompete(reaction, ghost){
  let reactions = reaction.message.reactions.cache;
  reaction.message.edit('The Ghost was a ' + ghost + '!');
  reactions.forEach((react, name)=>{
    if(react.count !== 2){
      react.remove(react.user);
    }
  });
  reaction.message.react(EMOJIS[6]);
}

// Removes all of the reactions from the message (used when clicking the restart reaction)
function removeAllReactions(reaction){
  let reactions = reaction.message.reactions.cache;
  reactions.forEach((react, name) =>{
    react.remove();
  });
}

// Adds the starting reactions for the options command
function addStartingReactions(message){
  message.react(EMOJIS[0]);
  message.react(EMOJIS[1]);
  message.react(EMOJIS[2]);
  message.react(EMOJIS[3]);
  message.react(EMOJIS[4]);
  message.react(EMOJIS[5]);
}

// Signs into discord and stores the bot id
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  ID = client.user.id;
});

// Handles a message
client.on('message', msg => {
  content = msg.content.toLowerCase();
  if (content.startsWith(PREFIX)){
    if (content.startsWith(WIKI_CMD)) {
      search = content.substr(WIKI_CMD.length+1);
      if (search == 'highschool' || search == 'hs'){ //corrects highschool search
            search = 'brown stone highschool';
      }
      search = toTitleCase(search);
      search = search.replace(' ','_');
      response = 'https://phasmophobia.fandom.com/wiki/' + search;
      msg.channel.send(response);
    } else if (content.startsWith(OPTIONS_CMD)){
      response = getDefaultMessage();
      msg.channel.send(response).then( function (msg) {
        addStartingReactions(msg);
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
  let reponse = '';
  if(ID !== user.id){
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
            if(!reaction.message.content.endsWith(INVALID_EVIDENCE_MSG)){
              reaction.message.edit(reaction.message.content+INVALID_EVIDENCE_MSG);
            }
            reaction.users.remove(user);
          }
        }
      }
    } else if(!EMOJIS.includes(reaction.emoji.name) && reaction.message.content.startsWith('Current Ghost options are:')){
      reaction.remove();
    } else if(reaction.emoji.name === EMOJIS[6] && reaction.count > 1 && reaction.message.content.startsWith('The Ghost was a')){
      if(reaction.count > 2){
        reaction.users.remove(user);
      } else {
        removeAllReactions(reaction);
        response = getDefaultMessage();
        reaction.message.edit(response).then( function (msg) {
          addStartingReactions(msg);
        }).catch(function(err){
          console.log(err);
        });
      }
    }
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