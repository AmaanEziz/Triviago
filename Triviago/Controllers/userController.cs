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
        Hashing hash = new Hashing();

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

        public void addLoginAttempt(string username,bool success)
        {
            LoginAttempt attempt = new LoginAttempt(username, DateTime.Now, success);
            _db.LoginAttempts.Add(attempt);
            _db.SaveChanges();
        }
       

        public bool shouldLockout(string username)
        {
            List<LoginAttempt> attempts= _db.LoginAttempts.Where(attempt => attempt.username==username && DateTime.Compare(attempt.loginTime, DateTime.Now.AddMinutes(-5)) > 0).ToList();
            if (attempts.Count >= 3)
            {
                return true;
            }
            return false;
        }

        public void lockoutUser(User currentUser)
        {
            currentUser.lockoutEndTime = DateTime.Now.AddMinutes(5);
            _db.SaveChanges();
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
                User currentUser = newUser;
                currentUser.password = hash.HashPassword(currentUser.password);
    
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
        public StatusCodeResult LoginRequest(User user)
        {
            string username = user.username;
            try
            {
                User foundUser = _db.Users.SingleOrDefault(u => u.username == username);
             
                if (DateTime.Compare(DateTime.Now, foundUser.lockoutEndTime) < 0)
                {
                    return new ConflictResult();
                }


                if (!hash.ValidatePassword(user.password, foundUser.password))
                {
                    addLoginAttempt(username, false);
                    if (shouldLockout(username))
                    {
                        lockoutUser(foundUser);
                    }
                    //make a function to Check if 2 or more failed login attempts occured in the
                    //last 5 minutes. If so, set lockoutEndTime to 15 minutes
                    return new BadRequestResult();
                }

                userSessions newSession = new userSessions(user.username, foundUser.GetHashCode());
                _db.UserSessions.Add(newSession);
                _db.SaveChanges();
                CookieOptions option = new CookieOptions(); //Set up the session cookie
                option.Expires = DateTime.Now.AddHours(1);
                option.HttpOnly = true;
                Response.Cookies.Append("SID", newSession.SID.ToString(), option);
                return Ok();
            }
            catch (Exception e)
            {
                return new NotFoundResult();
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
