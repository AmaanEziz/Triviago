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

     

        public userSessions(string username, int SID)
        {
            this.username = username;
            this.SID = SID;
         
            
        }
    }

}
