using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Triviago
{
    public class userSessions
    {
        [Key]
    public int id { get; set; }

        public string username { get; set; }
        public int SID{ get; set; }

        public System.Net.IPAddress IPAddress { get; set; }

        public userSessions(string username, int SID, System.Net.IPAddress IPAddress)
        {
            this.username = username;
            this.SID = SID;
            this.IPAddress = IPAddress;
            
        }
    }

}
