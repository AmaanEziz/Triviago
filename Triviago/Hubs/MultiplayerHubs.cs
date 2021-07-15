using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
//using Ninject.Activation;
using System.Net.Http;
using RestSharp.Authenticators;
using RestSharp;
using System.Net;

namespace Triviago.Hubs
{
    public class MultiplayerHubs : Hub
    {

        private readonly dbContext _db;

        public MultiplayerHubs(dbContext db)
        {
            _db = db;
        }
        public async Task addPlayer(string gameSID, string username)
        {
           
           
                gameSession currentGameSession = _db.GameSessions.SingleOrDefault(u => u.id == Int32.Parse(gameSID));
                if (!currentGameSession.participants.Contains(username))
                {
                    int originalLength = currentGameSession.participants.Count();
                    string[] newParticipants = new string[originalLength + 1];
                    currentGameSession.participants.CopyTo(newParticipants,0);
                    newParticipants[originalLength] = username;
                    currentGameSession.participants = newParticipants.ToList<String>();
                }
                _db.SaveChanges();
                await Groups.AddToGroupAsync(Context.ConnectionId, gameSID);
                string[] usernamesAdded = { username };
                await Clients.Group(gameSID).SendAsync("playerAdded", currentGameSession.participants);
           
        }
        public async Task gameSessionActive()
        {
            await Clients.All.SendAsync("gameSessionOn", true);
        }

        public async Task updateQuestion(string gameSID)

        {
            var client = new System.Net.WebClient();
            var response = client.DownloadString("https://opentdb.com/api.php?amount=1&type=multiple");
            await Clients.Group(gameSID).SendAsync("newQuestion",response);
        }

        async public Task startGame(string gameSID)
        {
            try
            {
                gameSession currentSession = _db.GameSessions.SingleOrDefault(u => u.id == Int32.Parse(gameSID));
                currentSession.inSession = true;
                _db.SaveChanges();
                await Clients.Group(gameSID).SendAsync("gameStarted",currentSession.host);
            }
            catch( Exception e)
            {
                await Clients.Group(gameSID).SendAsync("gameStarted","ERROR");
            }
        }

        async public Task removePlayer(string gameSID, string username)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameSID);
            gameSession currentSession = _db.GameSessions.SingleOrDefault(u => u.id == Int32.Parse(gameSID));
            List<string> newParticipantsList = currentSession.participants;
            newParticipantsList.Remove(username);
                currentSession.participants = new List<String>(newParticipantsList);
                _db.SaveChanges();
          
            await Clients.Group(gameSID).SendAsync("playerRemoved", username, newParticipantsList);
        }
        async public Task hostMigration(string gameSID)
        {
            try
            {
                gameSession session = _db.GameSessions.SingleOrDefault(u => u.id == Int32.Parse(gameSID));
                string newHost = session.participants.ElementAt(0);
                session.host = newHost;
                _db.SaveChanges();
                await Clients.Group(gameSID).SendAsync("newHost", newHost);
            }
            catch (Exception e)
            {
                await Clients.Group(gameSID).SendAsync("newHost", 0);
            }
        }


    }

    
}
