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
    name: "Format 48 drużyn",
    description: "48 drużyn, 12 grup po 4, 1/16 finału.",
    groupCount: 12,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "1/16 finału", teamCount: 32, isKnockout: true },
      { name: "1/8 finału", teamCount: 16, isKnockout: true },
      { name: "Ćwierćfinały", teamCount: 8, isKnockout: true },
      { name: "Półfinały", teamCount: 4, isKnockout: true },
      { name: "Finał", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "t32",
    name: "Format 32 drużyn",
    description: "32 drużyny, 8 grup po 4, 1/8 finału.",
    groupCount: 8,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "1/8 finału", teamCount: 16, isKnockout: true },
      { name: "Ćwierćfinały", teamCount: 8, isKnockout: true },
      { name: "Półfinały", teamCount: 4, isKnockout: true },
      { name: "Finał", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "t16",
    name: "Format 16 drużyn",
    description: "16 drużyn, 4 grupy po 4, Ćwierćfinały.",
    groupCount: 4,
    teamsPerGroup: 4,
    knockoutPhases: [
      { name: "Ćwierćfinały", teamCount: 8, isKnockout: true },
      { name: "Półfinały", teamCount: 4, isKnockout: true },
      { name: "Finał", teamCount: 2, isKnockout: true },
    ],
  },
  {
    id: "league",
    name: "System ligowy",
    description: "Jedna grupa, każdy gra z każdym.",
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
