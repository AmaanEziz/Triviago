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
    public class userController : ControllerBase
    {
        private readonly dbContext _db;

        public userController(dbContext db)
        {
            _db = db;
        }

        public User getUser()
        {
            try
            {
                int SID = int.Parse(Request.Cookies["SID"]);
                userSessions foundSession = _db.UserSessions.SingleOrDefault(u => u.SID == SID);
                string username = foundSession.username;
                User currentUser = _db.Users.SingleOrDefault(u => u.username == username);
                return currentUser;
            }
            catch (Exception e)
            {
                return null;
            }
        }
       
        // GET api/<userController>/5
        [HttpGet]
        public JsonResult Get() // Get a given user by using the SID stored in cookies to locate the session and user
        {
            return new JsonResult(getUser());
        }


        // POST api/<userController>
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
                Response.Cookies.Append("SID", newSession.SID.ToString(), option);
                return new JsonResult("Success");
            }
            catch (Exception e)
            {
                return new JsonResult(null);
            }
        }

        [HttpPut]
        [Route("/[action]")]
        public JsonResult updateGamesWon()//Locate user with given credentials and create a new session for them
        {
            try
            {
                User currentUser = getUser();
                currentUser.gamesWon = currentUser.gamesWon + 1;
                _db.SaveChanges();
                return new JsonResult(currentUser);
            }
            catch (Exception e)
            {
                return new JsonResult(null);
            }
           
        }




        // PUT api/<userController>/5
        [HttpPut]
        [Route("/[action]/{newHighScore}")]
        public JsonResult updateHighScore(int newHighScore)
        {
            try
            {
                User currentUser = getUser();
                currentUser.highScore = newHighScore;
                _db.SaveChanges();
                return new JsonResult(currentUser);
            }
            catch (Exception e)
            {
                return new JsonResult(null);
            }

        }


    }
}
