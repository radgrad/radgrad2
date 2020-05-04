export enum PlanChoiceType {
  SINGLE = 'single',
  SIMPLE = 'simple',
  COMPLEX = 'complex',
  XPLUS = 'xPlus',
}

export type IPlanChoiceType = PlanChoiceType.SINGLE | PlanChoiceType.SIMPLE | PlanChoiceType.COMPLEX | PlanChoiceType.XPLUS;
