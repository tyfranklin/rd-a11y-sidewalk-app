package models.region

import java.util.UUID

import com.vividsolutions.jts.geom.Polygon
import math._
import models.street.{StreetEdgeAssignmentCountTable, StreetEdgeTable}
import models.user.UserCurrentRegionTable
import models.utils.MyPostgresDriver
import models.utils.MyPostgresDriver.simple._
import play.api.Play.current

import scala.slick.jdbc.{GetResult, StaticQuery => Q}
import scala.slick.lifted.ForeignKeyQuery

case class RegionLabelCounts(regionId: Int, curbRampCount: Int, noCurbRampCount: Int, obstacleCount: Int, surfaceProblemCount: Int, otherCount: Int, occlusionCount: Int, noSidewalkCount: Int)

class RegionLabelCountsTable(tag: Tag) extends Table[RegionLabelCounts](tag, Some("sidewalk"), "region") {
  def regionId = column[Int]("region_id", O.PrimaryKey, O.AutoInc)
  def curbRampCount = column[Int]("curb_ramp_count", O.NotNull)
  def noCurbRampCount = column[Int]("no_curb_ramp_count", O.NotNull)
  def obstacleCount = column[Int]("obstacle_count", O.NotNull)
  def surfaceProblemCount = column[Int]("surface_problem_count", O.NotNull)
  def otherCount = column[Int]("other_count", O.NotNull)
  def occlusionCount = column[Int]("occlusion_count", O.NotNull)
  def noSidewalkCount = column[Int]("no_sidewalk_count", O.NotNull)

  def * = (regionId, curbRampCount, noCurbRampCount, obstacleCount, surfaceProblemCount, otherCount, occlusionCount, noSidewalkCount) <> ((RegionLabelCounts.apply _).tupled, RegionLabelCounts.unapply)
}

object RegionLabelCountsTable {

  import MyPostgresDriver.plainImplicits._

  implicit val regionLabelCountsConverter = GetResult[RegionLabelCounts](r => {
    RegionLabelCounts(r.nextInt, r.nextInt, r.nextInt, r.nextInt, r.nextInt, r.nextInt, r.nextInt, r.nextInt)
  })

  val db = play.api.db.slick.DB
  val regions = TableQuery[RegionTable]
  val regionTypes = TableQuery[RegionTypeTable]
  val regionProperties = TableQuery[RegionPropertyTable]
  val userCurrentRegions = TableQuery[UserCurrentRegionTable]
  val regionLabels = TableQuery[RegionLabelCountsTable]

  val regionsWithoutDeleted = regions.filter(_.deleted === false)
  val neighborhoods = regionsWithoutDeleted.filter(_.regionTypeId === 2)

  /**
    * Get label counts of a region specified by the region id
    *
    * @param regionId region id
    * @return
    */
  def getRegionLabelCounts(regionId: Int): Option[RegionLabelCounts] = db.withSession { implicit session =>
    try {
      val l = regionLabels.filter(_.regionId === regionId).list
      l.headOption
    } catch {
      case e: NoSuchElementException => None
      case _: Throwable => None  // Shouldn't reach here
    }
  }

  /*
   * Update a row's label counts by region id
   * @param regionId region id
   *
   */
}
