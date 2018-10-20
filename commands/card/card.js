const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const apijimp = require('../../helpers/apijimp')

module.exports = new Command('idcard',{
  category : 'Account', help : 'Muestra tu tarjeta de jugador', args : '', cooldown : 10,
  cooldownMessage : function(msg,args,command,cooldown){return this.locale.getUserString('warningInCooldown',msg)}},
  function(msg, args, command){
    let self = this
    let user = msg.mentions.length ? msg.mentions[0] : msg.author
    const profile = this.cache.profiles.get(user.id)
    if(!profile){if(user.id === msg.author.id){return basic.needRegister(msg,user.id)};}
    const lang = this.locale.getUserStrings(msg)
    // const lang = this.locale.getU
    // if(profile.card.heroes.split('').length < 1){return msg.reply(this.replace.do(lang.errorCardNoHeroes,{username : user.username, cmd : 'r!cardhelp'},true))}
    msg.channel.sendTyping();
    if(profile.card.heroes.split('').length < 1){
      return opendota.request('card_heroes',profile.profile.dota).then(results => {
        profile.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
        profile.card.pos = 'all'
        return apijimp.card([results[0],profile.card])})
      .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
      .then(m => msg.reply({embed : {
          description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${basic.socialLinks(profile.profile,'vertical',this.config.links.profile)}`,
          image : { url : m.attachments[0].url},
          color : this.config.color}
        }))
      // .then(buffer => msg.reply(lang.playerCardCanConfig.replaceKey({username : user.username}),{file : buffer, name : user.username + '_roshan_card.png'}))
      .catch(err => {
        // msg.reply()
        this.discordLog.send("error",this.locale.getDevString('IE_CardCreate',msg),lang.errorCardCreate,err,msg.channel)
        return command.error()
      })
    }else{
      return opendota.request('card',profile.profile.dota)
        .then(results => apijimp.card([...results,profile.card]))
        // .then(buffer => msg.reply({
        //     embed : {description : `${this.replace.do(lang.playerCard,{username : user.username},true)}\n${basic.socialLinks(profile.profile,'inline',this.config.links.profile)}`, color : this.config.color}
        //   },
        //   {file : buffer, name : user.username + '_roshan_card.png'}))
        .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
        .then(m => msg.reply({embed : {
            description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${basic.socialLinks(profile.profile,'vertical',this.config.links.profile)}`,
            image : { url : m.attachments[0].url},
            color : this.config.color}
          }))
        // .then(buffer => msg.reply(this.replace.do(lang.playerCard,{username : user.username},true),{file : buffer, name : user.username + '_roshan_card.png'}))
        .catch(err => {
          this.discordLog.send("error",this.locale.replacer(lang.IE_CardCreate,{username : user.username}),this.locale.get('errorCardCreateerr',msg),err,msg.channel)
          // this.logger.add("error",lang.IE_CardCreate.replaceKey({username : user.username}),true)
          return command.error()
        })
    }
  })