using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Triviago;

namespace Project2
{
    public class dbContext : DbContext
    {
        public dbContext(DbContextOptions<dbContext> options) : base(options)
        {
                
        }
        public DbSet<userSessions> UserSessions { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
