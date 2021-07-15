using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Triviago.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class gameSessionsController : ControllerBase
    {
        private readonly dbContext _db;

        public gameSessionsController(dbContext db)
        {
            _db = db;
        }
        // GET: api/<gameSessionsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<gameSession>>> GetGameSessions()
        {
            return await _db.GameSessions.ToListAsync();
        }

        [HttpGet("{gameSID}")]
        public gameSession GetGameSession(int gameSID)
        {
            gameSession session = _db.GameSessions.SingleOrDefault(u => u.id == gameSID);
            return session;
        }



        // GET api/<gameSessionsController>/5

        // POST api/<gameSessionsController>
        [HttpPost]
        public JsonResult Post(gameSession session)
        {
            _db.GameSessions.Add(session);
            _db.SaveChanges();
            return new JsonResult(session);
        }

        // PUT api/<gameSessionsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<gameSessionsController>/5
        [HttpDelete("{gameSID}")]
        public int Delete(string gameSID)
        {
            _db.GameSessions.Remove(_db.GameSessions.SingleOrDefault(u => u.id == Int32.Parse(gameSID)));
            return _db.SaveChanges();
          
        }


         

    }
}
