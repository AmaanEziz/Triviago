using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Triviago
{
    public class User
    {
        [Key]
        public string username { get; set; }

        public string password { get; set; }

        public int highScore { get; set; }

        public int gamesWon { get; set; }

        public bool lockoutEnabled { get; set; }

        public DateTime lockoutEndTime { get; set; }
    }
}
