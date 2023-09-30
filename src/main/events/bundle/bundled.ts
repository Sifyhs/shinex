// This file is auto-generated by dtscommands.
// Do not edit this file manually.
import { GuildMember, ButtonInteraction } from 'discord.js'
import { Event } from 'dtscommands'
import { UpdateProfile } from '../../../cache/profile.js'
import client from '../../../index.js'
import chalk from 'chalk'
import prisma from '../../../prisma.js'
import { OnApprove, OnAskProof, OnDeny } from '../../../utils/vouch.js'

// Content From D:\Devloper project\DISCORD TS\shinex\src\main\events/Client/onMember.ts

export class NewMember extends Event<'guildMemberAdd'> {
  constructor () {
    super({
      name: 'guildMemberAdd',
      nick: 'New Member'
    })
  }

  async run (member: GuildMember) {
    const guild = member.guild
    if (guild.id !== '1157258354821971998') return

    await member.roles.add('1157693300074086423')

    await UpdateProfile(member.id, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      badges: {
        push: 'MEMBER'
      }
    }).catch(console.error)
  }
}

// Content From D:\Devloper project\DISCORD TS\shinex\src\main\events/Client/ready.ts

export class ReadyEvent extends Event<'ready'> {
  constructor () {
    super({
      name: 'ready',
      once: true
    })
  }

  run () {
    console.info(`Client logged in as "${client.user?.tag}"`, chalk.bold('cli'))
    // bot.application?.commands.set(bot.commands.array)

    client.config.managers.push({
      guildId: '1157365694950809692',
      roleId: '1157579034562150482'
    })
  }
}

// Content From D:\Devloper project\DISCORD TS\shinex\src\main\events/vouch/handler.ts

export class VouchManager extends Event<'interactionCreate'> {
  constructor () {
    super({
      name: 'interactionCreate',
      nick: 'VouchManager'
    })
  }

  async run (interaction: ButtonInteraction) {
    if (!interaction.isButton()) return

    if (!interaction.customId.startsWith('vouch:')) return

    await interaction.deferUpdate()

    const vouch = await prisma.vouch.findUnique({
      where: {
        id: parseInt(interaction.customId.split(':')[1])
      }
    })

    if (!vouch) return

    switch (interaction.customId.split(':')[2]) {
      case 'accept':
        await OnApprove(vouch, interaction.user)
        break
      case 'deny':
        await OnDeny(vouch, interaction.user)
        break
      case 'proofreceiver':
        await OnAskProof(vouch, interaction.user, 'RECEIVER')
        break
      case 'proofvoucher':
        await OnAskProof(vouch, interaction.user, 'VOUCHER')
        break
    }
  }
}
