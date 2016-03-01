package models.mission

import java.util.UUID

import models.utils.MyPostgresDriver.simple._
import models.region._
import play.api.Play.current
import scala.slick.lifted.ForeignKeyQuery

case class Mission(missionId: Int, regionId: Option[Int], mission: String, level: Double, deleted: Boolean)

class MissionTable(tag: Tag) extends Table[Mission](tag, Some("sidewalk"), "mission") {
  def missionId = column[Int]("mission_id", O.PrimaryKey, O.AutoInc)
  def regionId = column[Option[Int]]("region_id", O.Nullable)
  def mission = column[String]("mission", O.NotNull)
  def level = column[Double]("level", O.NotNull)
  def deleted = column[Boolean]("deleted", O.NotNull)

  def * = (missionId, regionId, mission, level, deleted) <> ((Mission.apply _).tupled, Mission.unapply)

  def region: ForeignKeyQuery[RegionTable, Region] =
    foreignKey("mission_region_id_fkey", regionId, TableQuery[RegionTable])(_.regionId)
}

object MissionTable {
  val db = play.api.db.slick.DB
  val missions = TableQuery[MissionTable]
  val missionUsers = TableQuery[MissionUserTable]

  /**
    * Returns all the missions
    *
    * @return A list of SidewalkEdge objects.
    */
  def all: List[Mission] = db.withSession { implicit session =>
    missions.filter(_.deleted === false).list
  }

  /**
    * Get a list of all the completed tasks
    * @param userId
    * @return
    */
  def completed(userId: UUID): List[Mission] = db.withSession { implicit session =>
    val _missions = for {
      (_missions, _missionUsers) <- missions.innerJoin(missionUsers).on(_.missionId === _.missionId) if !_missions.deleted && _missionUsers.userId === userId.toString
    } yield _missions
    _missions.list
  }

  /**
    * Get the list of the completed tasks in the given region for the given user
    * @param userId
    * @param regionId
    * @return
    */
  def completed(userId: UUID, regionId: Int): List[Mission] = db.withSession { implicit session =>
    val _missions = for {
      (_missions, _missionUsers) <- missions.innerJoin(missionUsers).on(_.missionId === _.missionId) if !_missions.deleted && _missionUsers.userId === userId.toString
    } yield _missions
    _missions.filter(_.regionId.getOrElse(-1) === regionId).list
  }

  /**
    * Get a list of the incomplete missions for the given user
    * @param userId
    * @return
    */
  def incomplete(userId: UUID): List[Mission] = db.withSession { implicit session =>
    val _missions = for {
      (_missions, _missionUsers) <- missions.leftJoin(missionUsers).on(_.missionId === _.missionId)
      if !_missions.deleted && _missionUsers.missionUserId.?.isEmpty
    } yield _missions
    _missions.list
  }

  /**
    * Get a list of incomplete missions in the give region for the given user
    * @param userId
    * @param regionId
    * @return
    */
  def incomplete(userId: UUID, regionId: Int): List[Mission] = db.withSession { implicit session =>
    val _missions = for {
      (_missions, _missionUsers) <- missions.leftJoin(missionUsers).on(_.missionId === _.missionId)
      if !_missions.deleted && _missionUsers.missionUserId.?.isEmpty
    } yield _missions
    _missions.filter(_.regionId.getOrElse(-1) === regionId).list
  }

  /**
    * Get a set of regions where the user has not completed all the missions.
    *
    * @param userId
    * @return
    */
  def incompleteRegions(userId: UUID): Set[Int] = db.withSession { implicit session =>
    val _missions = for {
      (_missions, _missionUsers) <- missions.leftJoin(missionUsers).on(_.missionId === _.missionId)
      if !_missions.deleted && _missionUsers.userId === userId.toString && _missions.regionId.nonEmpty
    } yield _missions

    _missions.list.map(_.regionId.get).toSet
  }

  /**
    * Save a mission. Irankunai?
    * @param mission
    * @return
    */
  def save(mission: Mission): Int = db.withTransaction { implicit session =>
    val missionId: Int =
      (missions returning missions.map(_.missionId)) += mission
    missionId
  }
}
