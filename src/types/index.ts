export interface Program {
  id: string;
  title: string;
  university: string;
  location: string;
  deadline: string;
  seats: number;
  timeRemaining: string;
  status: 'Open' | 'Closed';
}

export interface SummaryCard {
  title: string;
  count: number;
  growth?: string;
  color: 'orange' | 'green' | 'red';
}