export interface DashboardInfo {
  count_female: number;
  count_male: number;
  total_unique_instituition: number;
  total_samples: number;
  total_participants: number;
  monthlyProgress: MonthlyProgressItem[];
  institutionDistribution: {
    labels: string[];
    series: number[];
  };
  regionalDistribution: {
    labels: string[];
    series: number[];
  };
  collectionStatus: {
    completed: number;
    pending: number;
  };
}

export interface MonthlyProgressItem {
  month: string;
  samples: number;
  participants: number;
}