package models.mission

import models.daos.slick.DBTableDefinitions.{DBUser, UserTable}
import models.utils.MyPostgresDriver.simple._
import play.api.Play.current

import scala.slick.lifted.ForeignKeyQuery

case class NextMission(nextMissionId: Int, userId: String, missionTypeId: Int, missionsRemaining: Int)


class NextMissionTable(tag: slick.lifted.Tag) extends Table[NextMission](tag, Some("sidewalk"), "next_mission") {
  def nextMissionId: Column[Int] = column[Int]("next_mission_id", O.PrimaryKey, O.AutoInc)
  def userId: Column[String] = column[String]("user_id", O.NotNull)
  def missionTypeId: Column[Int] = column[Int]("mission_type_id", O.NotNull)
  def missionsRemaining: Column[Int] = column[Int]("missions_remaining", O.NotNull)

  def * = (nextMissionId, userId, missionTypeId, missionsRemaining) <> ((NextMission.apply _).tupled, NextMission.unapply)

  def user: ForeignKeyQuery[UserTable, DBUser] =
    foreignKey("next_mission_user_id_fkey", userId, TableQuery[UserTable])(_.userId)

  def missionType: ForeignKeyQuery[MissionTypeTable, MissionType] =
    foreignKey("next_mission_mission_type_id_fkey", missionTypeId, TableQuery[MissionTypeTable])(_.missionTypeId)
}

/**
  * Data access object for the next_mission table
  */
object NextMissionTable {
  val db = play.api.db.slick.DB
  val nextMissions = TableQuery[NextMissionTable]

  /**
    * Saves a new next_mission entry in the table.
    * @param nextMission
    * @return
    */
  def save(nextMission: NextMission): Int = db.withTransaction { implicit session =>
    val nextMissionId: Int = (nextMissions returning nextMissions.map(_.nextMissionId)) += nextMission
    nextMissionId
  }
}
