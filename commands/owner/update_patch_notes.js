const { Command } = require('aghanim')

module.exports = new Command('updatepatchnotes',{
  category : 'Owner', help : 'Recarga el mensaje de r!new', args : ''},
  function(msg, args, command){
    return this.components.Bot.loadLastPatchNotes()
  })
