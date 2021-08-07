using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Triviago.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationAuthorizationController : ControllerBase
    {
        private readonly dbContext _db;

        public AuthenticationAuthorizationController(dbContext db)
        {
            _db = db;
        }
       
        // GET api/<AuthenticationAuthorizationController>/5
        [HttpGet]
        public JsonResult Get() // Get a given user by using the SID stored in cookies to locate the session and user
        {
            try
            {
                int SID = int.Parse(Request.Cookies["SID"]); //Find SID
                userSessions foundSession = _db.UserSessions.SingleOrDefault(u => u.SID == SID); //Find session associated with SID
                string username = foundSession.username; //find username associated with SID
                User userWithSID = _db.Users.SingleOrDefault(u => u.username == username);// find User associated with username
                return new JsonResult(userWithSID);//Return user associated with SID
            }
            catch (Exception e)
            {
                return new JsonResult(null);
            }
        }


        // POST api/<AuthenticationAuthorizationController>
        [HttpPost]
        public StatusCodeResult Post([FromBody] User newUser)//Register a new user
        {
            try
            {

                _db.Users.Add(newUser);
                _db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return new BadRequestResult();//In case a user tries to register with a username already taken,
                                              //return bad request since the username field is the primary key
                                              //in the table and therefore throws an exception if an existing username
                                              //is entered
            }
        }
        [HttpPost]
        [Route("[action]")]
        public JsonResult LoginRequest(User user)//Locate user with given credentials and create a new session for them
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            try
            {
                var foundUser = _db.Users.SingleOrDefault(u => u.username == user.username && u.password == user.password);

                if (foundUser == null)
                {
                    return new JsonResult(null);//If credentials don't match a user, return null
                }

                userSessions newSession = new userSessions(user.username, foundUser.GetHashCode());
               _db.UserSessions.Add(newSession);
               _db.SaveChanges();
                CookieOptions option = new CookieOptions(); //Set up the session cookie
                option.Expires = DateTime.Now.AddHours(1);
                option.HttpOnly = true;
                Response.Cookies.Append("SID",newSession.SID.ToString() , option);
                return new JsonResult("Success");
            }
            catch (Exception e)
            {
                return new JsonResult(null);
            }
        }


        [HttpPut]
        [Route("/{username}/[action]")]
        public int addGameWon(string username)//Locate user with given credentials and create a new session for them
        {
            User user = _db.Users.SingleOrDefault(u => u.username == username);
            user.gamesWon = user.gamesWon + 1;
           return _db.SaveChanges();
           
        }









        // PUT api/<AuthenticationAuthorizationController>/5
        [HttpPut]
        public JsonResult Put(User body)
        {
           
          try
            {
                User user = _db.Users.SingleOrDefault(u => u.username == body.username);
                user.highScore = body.highScore;
                _db.SaveChanges();
                return new JsonResult("success");
           }
            catch (Exception e)
            {
                return new JsonResult("unsuccessful");
            }
        }

        // DELETE api/<AuthenticationAuthorizationController>/5
        [HttpDelete]
        public StatusCodeResult Delete(int id)
        {
            try
            {
                int SID = int.Parse(Request.Cookies["SID"]);
                _db.Remove(_db.UserSessions.SingleOrDefault(u => u.SID == SID));
                _db.SaveChanges();
                return Ok();
            }
            catch(Exception e)
            {
                return new BadRequestResult();
            }
        }
    }
}
