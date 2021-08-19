using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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

        public DbSet<gameSession> GameSessions { get; set; }

        public DbSet<LoginAttempt> LoginAttempts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<gameSession>().Property(p => p.participants)
     .HasConversion(
         v => JsonConvert.SerializeObject(v),
         v => JsonConvert.DeserializeObject<List<string>>(v));

        }
    }
}
