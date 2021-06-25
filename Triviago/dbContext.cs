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
        
        public DbSet<GameSession> GameSessions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        { 
            modelBuilder.Entity<GameSession>()
             .Property(e => e.participants)
             .HasConversion(
                 v => string.Join(',', v),
                 v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));

        }
    }
}
