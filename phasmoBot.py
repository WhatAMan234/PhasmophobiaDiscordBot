import atexit
import discord
import re
from discord.ext import commands

TOKEN = '${{ secrets.TOKEN }}'

GHOSTS = { 
    "phantom" : ["freezing","emf","orbs"],
    "banshee" : ["freezing","emf","fingerprints"],
    "mare" : ["freezing","orbs","spiritbox"],
    "yurei" : ["freezing","orbs","writing"],
    "demon" : ["freezing","spiritbox","writing"],
    "wraith" : ["freezing","spiritbox","fingerprints"],
    "jinn" : ["emf","orbs","spiritbox"],
    "shade" : ["emf","orbs","writing"],
    "oni" : ["emf","spiritbox","writing"],
    "revenant" : ["emf","writing","fingerprints"],
    "poltergeist" : ["orbs","spiritbox","fingerprints"],
    "spirit" : ["spiritbox","writing","fingerprints"]
}

class Phasmo(commands.Cog):

    @commands.command(name='wiki')
    async def _search(self, ctx: commands.Context, *, search: str):
        if search == "highschool" or search == "hs":
            search = "brown stone highschool"
        if not search.istitle():
            search = search.title()
        search = re.sub(r"\s+", '_', search)
        msg = "https://phasmophobia.fandom.com/wiki/" + search
        await ctx.send(msg)

    @commands.command(name='options')
    async def _options(self, ctx: commands.Context, *, search: str):
        intial = []
        possible = []
        search.lower()
        if ' ' in search:
            ev1,ev2 = search.split(' ')
        else:
            ev1 = search
            ev2 = ""

        for i in GHOSTS:
            if ev1 in GHOSTS[i]:
                intial.append(i)

        for x in intial:
            if ev2 and ev2 in GHOSTS[x]:
                possible.append(x)
            elif not ev2:
                possible.append(x)

        msg = "Here are the possible ghosts:\n"
        for j in possible:
            msg += j + " : "
            iterations = 0

            for k in GHOSTS[j]:
                if not k == ev1 and not k == ev2:
                    if iterations == 1:
                        msg += ", "
                    msg += k
                    iterations ++

            msg += "\n"

        await ctx.send(msg)


bot = commands.Bot('$', description='Phasmo helper')
bot.add_cog(Phasmo(bot))

@bot.event
async def on_ready():
    print('Logged in as:\n{0.user.name}\n{0.user.id}'.format(bot))
    atexit.register(handle_exit)

@bot.listen
async def on_message(message):
    await bot.process_commands(message)

async def handle_exit():
    await bot.close()

atexit.register(handle_exit)

bot.run(TOKEN)
