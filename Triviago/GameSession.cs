using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Triviago
{
    public class gameSession
    {
        [Key]
        public int id { get; set; }

        public string host { get; set; }

        public string name { get; set; }
        public List<string> participants { get; set; }

        public Boolean inSession { get; set; }




    }
}
