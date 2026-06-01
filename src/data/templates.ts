import { TournamentPhase } from "../types";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  groupCount: number;
  teamsPerGroup: number;
  knockoutPhases: {
    name: string;
    teamCount: number;
    isKnockout: boolean;
  }[];
}

export const TOURNAMENT_TEMPLATES: TemplateDefinition[] = [
  {
    id: "t48",
    name: "World Cup 2026",
    description: "48 teams, 12 groups of 4, Round of 32.",
    groupCount: 12,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "Round of 32", teamCount: 32, isKnockout: true },
      { name: "Round of 16", teamCount: 16, isKnockout: true },
      { name: "Quarter-finals", teamCount: 8, isKnockout: true },
      { name: "Semi-finals", teamCount: 4, isKnockout: true },
      { name: "Final", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "t32",
    name: "World Cup 32",
    description: "32 teams, 8 groups of 4, Round of 16.",
    groupCount: 8,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "Round of 16", teamCount: 16, isKnockout: true },
      { name: "Quarter-finals", teamCount: 8, isKnockout: true },
      { name: "Semi-finals", teamCount: 4, isKnockout: true },
      { name: "Final", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "t16",
    name: "Euro Format (16)",
    description: "16 teams, 4 groups of 4, Quarter-finals.",
    groupCount: 4,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "Quarter-finals", teamCount: 8, isKnockout: true },
      { name: "Semi-finals", teamCount: 4, isKnockout: true },
      { name: "Final", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "league",
    name: "League",
    description: "Single group, everyone plays everyone.",
    groupCount: 1,
    teamsPerGroup: 10,
    knockoutPhases: [],
  },
];

export function generatePhasesFromTemplate(template: TemplateDefinition, teams: string[]): TournamentPhase[] {
  const phases: TournamentPhase[] = [];
  let order = 1;

  // Group Phase
  for (let i = 0; i < template.groupCount; i++) {
    const groupLabel = String.fromCharCode(65 + i);
    const startIdx = i * template.teamsPerGroup;
    const groupTeams = teams.slice(startIdx, startIdx + template.teamsPerGroup);
    
    const matches = [];
    // Simple round robin for the group
    for (let j = 0; j < groupTeams.length; j++) {
      for (let k = j + 1; k < groupTeams.length; k++) {
        matches.push({
          id: `m_${groupLabel}_${j}_${k}`,
          phaseId: `group-${groupLabel}`,
          groupLabel,
          homeTeam: groupTeams[j],
          awayTeam: groupTeams[k],
        });
      }
    }

    phases.push({
      id: `group-${groupLabel}`,
      name: `Group ${groupLabel}`,
      label: "Group Stage",
      isKnockout: false,
      allowDraw: true,
      order: order++,
      matches,
    });
  }

  // Knockout Phases
  template.knockoutPhases.forEach((ko) => {
    const matches = [];
    for (let i = 0; i < ko.teamCount / 2; i++) {
      matches.push({
        id: `m_${ko.name.replace(/\s/g, '_').toLowerCase()}_${i}`,
        phaseId: ko.name.toLowerCase().replace(/\s/g, '-'),
        homeTeam: "TBD",
        awayTeam: "TBD",
      });
    }
    phases.push({
      id: ko.name.toLowerCase().replace(/\s/g, '-'),
      name: ko.name,
      label: "Knockout Stage",
      isKnockout: ko.isKnockout,
      allowDraw: false,
      order: order++,
      matches,
    });
  });

  return phases;
}
