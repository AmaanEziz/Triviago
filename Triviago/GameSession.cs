using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using System.Linq;
using System.Threading.Tasks;

namespace Triviago
{
    public class GameSession
    {
        [Key]
        public int id { get; set; }

        public string creator { get; set; }

        public string name { get; set; }

       public string[] participants { get; set; }
       

    }
}
