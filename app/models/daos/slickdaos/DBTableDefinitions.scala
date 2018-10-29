package models.daos.slickdaos

//import models.utils.MyPostgresDriver.api._
import java.util.UUID

import play.api.Play

object DBTableDefinitions {

  case class DBUser (userId: String, username: String, email: String )

  class UserTable(tag: Tag) extends Table[DBUser](tag, Some("sidewalk"), "sidewalk_user") {
    def userId = column[String]("user_id", O.PrimaryKey)
    def username = column[String]("username")
    def email = column[String]("email")
    def * = (userId, username, email) <> (DBUser.tupled, DBUser.unapply)
  }

  case class DBLoginInfo (id: Option[Long], providerID: String, providerKey: String )

  class LoginInfos(tag: Tag) extends Table[DBLoginInfo](tag, Some("sidewalk"), "login_info") {
    def loginInfoId = column[Long]("login_info_id", O.PrimaryKey, O.AutoInc)
    def providerID = column[String]("provider_id")
    def providerKey = column[String]("provider_key")
    def * = (loginInfoId.?, providerID, providerKey) <> (DBLoginInfo.tupled, DBLoginInfo.unapply)
  }

  case class DBUserLoginInfo (userID: String, loginInfoId: Long)

  class UserLoginInfoTable(tag: Tag) extends Table[DBUserLoginInfo](tag, Some("sidewalk"), "user_login_info") {
    def userID = column[String]("user_id")
    def loginInfoId = column[Long]("login_info_id")
    def * = (userID, loginInfoId) <> (DBUserLoginInfo.tupled, DBUserLoginInfo.unapply)
  }

  case class DBPasswordInfo (hasher: String, password: String, salt: Option[String], loginInfoId: Long)

  class PasswordInfoTable(tag: Tag) extends Table[DBPasswordInfo](tag, Some("sidewalk"), "user_password_info") {
    def hasher = column[String]("hasher")
    def password = column[String]("password")
    def salt = column[Option[String]]("salt")
    def loginInfoId = column[Long]("login_info_id")
    def * = (hasher, password, salt, loginInfoId) <> (DBPasswordInfo.tupled, DBPasswordInfo.unapply)
  }


  val slickUsers = TableQuery[UserTable]
  val slickLoginInfos = TableQuery[LoginInfos]
  val slickUserLoginInfos = TableQuery[UserLoginInfoTable]
  val slickPasswordInfos = TableQuery[PasswordInfoTable]

  object UserTable {
    import play.api.Play.current

    val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)
    val db = dbConfig.db
    def find(username: String): Option[DBUser] = db.withTransaction { implicit session =>
      slickUsers.filter(_.username === username).headOption match {
        case Some(user) => Some(user)
        case None => None
      }
    }
    def findEmail(email: String): Option[DBUser] = db.withTransaction { implicit session =>
      slickUsers.filter(_.email === email).headOption match {
        case Some(user) => Some(user)
        case None => None
      }
    }
    def findById(userId: UUID): Option[DBUser] = db.withTransaction { implicit session =>
      slickUsers.filter(_.userId === userId.toString).headOption match {
        case Some(user) => Some(user)
        case None => None
      }
    }

    def count: Int = db.withTransaction { implicit session =>
      val users = slickUsers.list
      users.length
    }
  }
}