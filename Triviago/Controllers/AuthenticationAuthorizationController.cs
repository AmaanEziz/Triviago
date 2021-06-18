using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
                if (foundSession.IPAddress!= Request.HttpContext.Connection.RemoteIpAddress)
                {
                    return null;// This protects session hijacking because whoever is using the session
                                //must have the IP Address the session was created with or else, null is returned
                }
                return new JsonResult(userWithSID);//Return user associated with SID
            }
            catch (Exception e)
            {
                return new JsonResult(null);// Return null if SID is invalid
            }
        }

/*
        [HttpGet]
        [Route("[action]")]
        public JsonResult getUserInformation()
        {
           int SID = int.Parse(Request.Cookies["SID"]);
            string username = _db.UserSessions.SingleOrDefault(u => u.SID==SID).username;
            User userWithSID = _db.Users.SingleOrDefault(u => u.username == username);
            Console.WriteLine(userWithSID);
            return new JsonResult("Hello");
           
            
        } */
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

                userSessions newSession = new userSessions(user.username, foundUser.GetHashCode(), Request.HttpContext.Connection.RemoteIpAddress);
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

        // PUT api/<AuthenticationAuthorizationController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AuthenticationAuthorizationController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
