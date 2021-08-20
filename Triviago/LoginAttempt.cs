using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Triviago
{
    public class LoginAttempt
    {
        public int id { get; set; }
        public string username { get; set; }

        public DateTime loginTime { get; set; }

        public bool success { get; set; }

        public LoginAttempt(string username, DateTime loginTime, bool success)
        {
            this.username = username;
            this.loginTime = loginTime;
            this.success = success;
        }
    }
}
