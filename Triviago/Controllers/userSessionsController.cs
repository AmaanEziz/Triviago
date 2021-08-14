using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Project2;
using Triviago;

namespace Triviago.Controllers
{
    public class userSessionsController : Controller
    {
        private readonly dbContext _db;

        public userSessionsController(dbContext context)
        {
            _db = context;
        }

 
        // DELETE api/<userSessionsController>/5
        [HttpDelete]
        [Route("/DeleteUser")]
        public StatusCodeResult Delete()
        {
            try
            {
                int SID = int.Parse(Request.Cookies["SID"]);
                _db.Remove(_db.UserSessions.SingleOrDefault(u => u.SID == SID));
                _db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return new BadRequestResult();
            }
        }
    }
}
