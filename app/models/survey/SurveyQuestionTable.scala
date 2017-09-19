package models.survey

import models.utils.MyPostgresDriver.simple._
import models.user.RoleTable
import play.api.Play.current

import scala.slick.lifted.ForeignKeyQuery

case class SurveyQuestion(surveyQuestionId: Int, surveyQuestionText: String, surveyInputType: String, surveyCategoryOptionId: Option[Int], surveyDisplayRank: Option[Int], deleted: Boolean, surveyUserRoleId: Seq[String], required: Boolean)

class SurveyQuestionTable(tag: Tag) extends Table[SurveyQuestion](tag, Some("sidewalk"), "survey_question") {
  def surveyQuestionId = column[Int]("survey_question_id", O.PrimaryKey, O.AutoInc)
  def surveyQuestionText = column[String]("survey_question_text", O.NotNull)
  def surveyInputType = column[String]("survey_input_type", O.NotNull)
  def surveyCategoryOptionId = column[Option[Int]]("survey_category_option_id", O.Nullable)
  def surveyDisplayRank = column[Option[Int]]("survey_display_rank", O.Nullable)
  def deleted = column[Boolean]("deleted", O.NotNull)
  def surveyUserRoles = column[Seq[String]]("survey_user_roles",O.NotNull)
  def required = column[Boolean]("required", O.NotNull)

  def * = (surveyQuestionId, surveyQuestionText, surveyInputType, surveyCategoryOptionId, surveyDisplayRank, deleted, surveyUserRoles, required) <> ((SurveyQuestion.apply _).tupled, SurveyQuestion.unapply)
  def survey_category_option: ForeignKeyQuery[SurveyCategoryOptionTable, SurveyCategoryOption] =
    foreignKey("survey_question_survey_category_option_id_fkey", surveyCategoryOptionId, TableQuery[SurveyCategoryOptionTable])(_.surveyCategoryOptionId)

}

object SurveyQuestionTable{
  val db = play.api.db.slick.DB
  val surveyQuestions = TableQuery[SurveyQuestionTable]
  val surveyOptions = TableQuery[SurveyOptionTable]
  val roles = TableQuery[RoleTable]

  def getQuestionById(surveyQuestionId: Int): Option[SurveyQuestion] = db.withTransaction { implicit session =>
    surveyQuestions.filter(_.surveyQuestionId === surveyQuestionId).list.headOption
  }

  def listOptionsByQuestion(surveyQuestionId: Int): Option[List[SurveyOption]] = db.withTransaction { implicit session =>
    val question = getQuestionById(surveyQuestionId)
    question match{
      case Some(q) =>
        val categoryOptionId = q.surveyCategoryOptionId
        SurveyCategoryOptionTable.listOptionsByCategory(categoryOptionId)
      case None =>
        None
    }
  }

  def listAll: List[SurveyQuestion] = db.withTransaction { implicit session =>
    surveyQuestions.filter(_.deleted === false).list
  }

  def listAllByUserRoleId(userRoleId: Int): List[SurveyQuestion] = db.withTransaction { implicit session =>
    val sURole: Option[Int] = roles.filter(_.roleId === userRoleId).map(_.role).head
    sURole match{
      case Some(surveyUserRole) =>
        surveyQuestions.filter(x => x.deleted === false && x.surveyUserRoles.contains(surveyUserRole)).list
      case None =>
        val empty: List[SurveyQuestion] = List()
        empty
    }
  }

  def listAllByUserRoles(userRoles: Seq[String]): List[SurveyQuestion] = db.withTransaction { implicit session =>
    surveyQuestions.filter(x => x.deleted === false).filter{ x =>
      val relevantRoles: Seq[String] = x.surveyUserRoles.intersect(userRoles)
      relevantRoles.size > 0
    }.list
  }

  def save(surveyQuestion: SurveyQuestion): Int = db.withTransaction { implicit session =>
    val surveyQuestionId: Int =
      (surveyQuestions returning surveyQuestions.map(_.surveyQuestionId)) += surveyQuestion
    surveyQuestionId
  }
}