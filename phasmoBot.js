const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json'); // Separate file to store the prefix and token
const ghost_list_file = require('./ghosts.json'); // Separate file to store the ghosts and their options
const TOKEN = config.token;
const PREFIX = config.prefix;
const WIKI_CMD = PREFIX + 'wiki';
const OPTIONS_CMD = PREFIX + 'options';

// All ghost options retrieved as a string from the ghost_list_file
const GHOSTS = JSON.stringify(ghost_list_file.ghost_list);

/*  All used reactions for options command
    freezing temps = 🥶
    orbs           = 💫
    spirit box     = 🗣️
    ghost writing  = ✍
    emf level 5    = 5️⃣
    fingerprints   = 🖐️
    D.O.T.S.       = 🎇
    restart        = 🔄
*/
const EMOJIS = ['🥶','💫','🗣️','✍','5️⃣','🖐️','🎇','🔄'];

// list of all evidence names (used in the options check method)
const EVIDENCE = ['freezing temps','orbs','spirit box','ghost writing','emf','fingerprints','D.O.T.S.'];

// converts the ghost list to a json map
const ghostList = JSON.parse(GHOSTS);

// maps evidence to emoji for clarity
const evidenceEmoji = JSON.parse(JSON.stringify(ghost_list_file.evidence_emoji));

// length of longest gohost name for padding. Finds the longest ghost name from the ghostList object
const longestName = Array.from(Object.keys(ghostList)).reduce(
  function(a, b) {
    return a.length > b.length ? a : b;
  }
).length;

// message that is displayed when an invalid third evidence is selected
const INVALID_EVIDENCE_MSG = '```\nInvalid 3rd evidence! Please select one of the options listed above.\nIf trying to add mimin evidence, please unselect orbs.```'

// used for holding the bot id for message filtering
let ID = '';

let mimicMsgNeeded = false

let mimicEvNeeded = ''

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
  EVIDENCE.forEach( ev => {
    response += ev + ' : ' + EMOJIS[EVIDENCE.indexOf(ev)] + '\n';
  });
  response += '```Evidence options: ';
  EVIDENCE.forEach(element => {
    response += element + ', ';
  });
  response = response.substring(0,response.length-2) + '```';
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
    } else if (name === EMOJIS[6] && reaction.count > 1 && name !== currReaction){
      ev2 = EVIDENCE[6];
    }
  });
  return ev2;
}

// Contains the logic to find the remaining options based on input emoji
function findEvidenceOptions(message, emoji, ev1){
  let response = 'Current Ghost options are: \n```';
  let evList = [];
  ev2 = findOtherEvidence(message,emoji);
  for (const ghost in ghostList) {
    if (ghostList.hasOwnProperty.call(ghostList, ghost)) {
      let element = ghostList[ghost];
      element = sortEvidence(element, EVIDENCE);
      if(ev2 !== ''){ // if second evidence
        if (ghost != 'The Mimic' && (element.includes(ev1) && element.includes(ev2))) {
          response += ghost.padStart(longestName) + ' : '; // name is left padded to match longes ghost name
          element.forEach(evidence => {
            if (evidence !== ev1 && evidence !== ev2){
              response += evidence + ', ';
              if(!evList.includes(evidence)){
                evList.push(evidence);
              }
            }
          });
          response = response + '\n';
        } else if(ghost == 'The Mimic') {
          if((ev1 == 'orbs' || ev2 == 'orbs') && (element.includes(ev1) || element.includes(ev2))){
            response += ghost.padStart(longestName) + ' : '; // name is left padded to match longes ghost name
            if(ev1 == 'orbs'){
              element.forEach(evidence => {
                if (evidence !== ev2){
                  response += evidence + ', ';
                  if(!evList.includes(evidence)){
                    evList.push(evidence);
                  }
                }
              });
              response = response + '\n';
            } else {
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
          } else {
            if(element.includes(ev1) && element.includes(ev2)) {
              response += ghost.padStart(longestName) + ' : '; // name is left padded to match longes ghost name
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
          }
        }
      } else { // if no second evidence
        if (element.includes(ev1)) {
          response += ghost.padStart(longestName) + ' : '; // name is left padded to match longes ghost name
          element.forEach(evidence => {
            if (evidence !== ev1){
              response += evidence + ', ';
              if(!evList.includes(evidence)){
                evList.push(evidence);
              }
            }
          });
          response = response + '\n';
        } else if(ghost == 'The Mimic' && ev1 == 'orbs') {
          response += ghost.padStart(longestName) + ' : '; // name is left padded to match longes ghost name
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
  response += '```\n```Evidence options : ';
  EVIDENCE.forEach(element => {
    if(evList.includes(element)){
      response += element + ', ';
    }
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
    case EMOJIS[6]: //D.O.T.S. WAS SELECTED
      response = findEvidenceOptions(reaction.message,EMOJIS[6],EVIDENCE[6]);
      break;
    default:
      console.log('Not an acceptable emoji');
  }
  
  response = response.substring(0,response.length-2) + '```';
  response = response.replace(/(, \n)/g,'\n');
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
        case EMOJIS[6]:
          evidence.push(EVIDENCE[6]);
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
      if(ghost == 'The Mimic' && evidence.includes('orbs')){
        mimicMsgNeeded = true;
        evidence.forEach(ev => {
          if(!element.includes(ev) && ev!=='orbs'){
            mimicMsgNeeded = false;
          }
        });
        element.forEach(ev => {
          if(ev !== 'orbs' && !evidence.includes(ev)){
            mimicEvNeeded = ev;
          }
        });
      }
    }
  }
  return result;
}

// Edits the message with the ghost name based on the 3 evidences found
function printCompete(reaction, ghost){
  let reactions = reaction.message.reactions.cache;
  if(!mimicMsgNeeded){
    reaction.message.edit('The Ghost was a ' + ghost + '!');
  } else {
    reaction.message.edit('The Ghost was a ' + ghost + '!\n```The Ghost could also be a Mimic! Check for ' + mimicEvNeeded + '!```\n')
    mimicEvNeeded = ''
    mimicMsgNeeded = false
  }
  reactions.forEach((react, name)=>{
    if(react.count !== 2){
      react.remove(react.user);
    }
  });
  reaction.message.react(EMOJIS[7]);
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
  message.react(EMOJIS[6]);
}

// Sorts the evidence of the ghosts to match the reaction list
function sortEvidence(ghostArr, evArr){
  tempArr = ghostArr.slice();
  tempArr.sort((prev, next) => {
    return evArr.indexOf(prev) - evArr.indexOf(next);
  })
  return tempArr;
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

// Handles an added reaction
client.on('messageReactionAdd', (reaction, user) => {
  let reactions = reaction.message.reactions.cache;
  let evidenceCount = 0;
  let ghost = '';
  let reponse = '';
  if(ID !== user.id){ // Makes sure that the reaction wasn't added by the bot
    if(reaction.count > 1 && reaction.message.content.startsWith('Current Ghost options are:')){
      if(reaction.count > 2){
        reaction.users.cache.forEach((snowflake, reactor)=>{
          if(reactor !== reaction.message.author.id){
            reaction.users.remove(reactor);
          }
        });
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
    } else if(reaction.emoji.name === EMOJIS[7] && reaction.count > 1 && reaction.message.content.startsWith('The Ghost was a')){
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

// Handles removing a reaction (for when you remove an incorrect evidence)
client.on('messageReactionRemove', (reaction, user) => {
  if(reaction.count == 1 && reaction.message.content.startsWith('Current Ghost options are:')){
    let reactions = reaction.message.reactions.cache;
    let remaining = reaction;
    let evidenceCount = 0;
    reactions.forEach((react, name)=>{
      if(react.count > 1){
        remaining = react;
        evidenceCount += 1;
      }
    });
    if(remaining !== reaction){
      optionsCheck(remaining);
      if(reaction.message.content.endsWith(INVALID_EVIDENCE_MSG) && evidenceCount == 1){
        reaction.message.edit(reaction.message.content.replace(INVALID_EVIDENCE_MSG,''));
      }
    } else {
      reaction.message.edit(getDefaultMessage());
    }
  }
});

client.login(TOKEN);
