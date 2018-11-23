const { Command } = require('aghanim')

module.exports = new Command('web',{
  category : 'General', help : 'RoshanApp', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('web',msg),{link : this.config.links.web}))
  })
