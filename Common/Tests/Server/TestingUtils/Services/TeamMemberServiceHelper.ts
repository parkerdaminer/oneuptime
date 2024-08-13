import { JSONObject } from "Common/Types/JSON";
import ObjectID from "Common/Types/ObjectID";
import TeamMember from "Common/Models/DatabaseModels/TeamMember";

export default class TeamMemberTestService {
  public static generateRandomTeamMember(data: {
    projectId: ObjectID,
    userId: ObjectID,
    teamId: ObjectID,
    miscDataProps?: JSONObject,
  }
  ): TeamMember {
    const teamMember: TeamMember = new TeamMember();

    // required fields
    teamMember.userId = data.userId;
    teamMember.projectId = data.projectId;
    teamMember.teamId = data.teamId;

    return teamMember;
  }
}
