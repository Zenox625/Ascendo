export type Subcategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  ascent_category: string | null;
};

export type Tracker = {
  id: string;
  subcategory_id: string;
  name: string;
  unit: string;
  daily_goal: number;
  long_term_goal: number | null;
  image: string | null;
  ascent_points: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  event_date: string;
  title: string;
  event_time: string | null;
};
