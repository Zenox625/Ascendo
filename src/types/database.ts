type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profile: Table<
        { id: number; name: string; avatar: string | null; language: string; theme: string },
        { id: number; name?: string; avatar?: string | null; language?: string; theme?: string }
      >;
      spotify_connection: Table<
        {
          id: number;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scope: string | null;
          updated_at: string;
        },
        {
          id: number;
          access_token: string;
          refresh_token?: string;
          expires_at: string;
          scope?: string | null;
          updated_at?: string;
        }
      >;
      subcategories: Table<
        { id: string; name: string; icon: string; color: string; sort_order: number; created_at: string; ascent_category: string | null },
        { id: string; name: string; icon?: string; color?: string; sort_order?: number; created_at?: string; ascent_category?: string | null }
      >;
      trackers: Table<
        {
          id: string;
          subcategory_id: string;
          name: string;
          unit: string;
          daily_goal: number;
          long_term_goal: number | null;
          image: string | null;
          created_at: string;
          ascent_points: number;
        },
        {
          id: string;
          subcategory_id: string;
          name: string;
          unit?: string;
          daily_goal?: number;
          long_term_goal?: number | null;
          image?: string | null;
          created_at?: string;
          ascent_points?: number;
        }
      >;
      tracker_entries: Table<
        { tracker_id: string; entry_date: string; value: number },
        { tracker_id: string; entry_date: string; value?: number }
      >;
      notes: Table<
        { id: string; title: string; content: string; created_at: string; updated_at: string },
        { id: string; title?: string; content?: string; created_at?: string; updated_at?: string }
      >;
      events: Table<
        { id: string; event_date: string; title: string; event_time: string | null; created_at: string },
        { id: string; event_date: string; title: string; event_time?: string | null; created_at?: string }
      >;
      ascent_log: Table<
        { id: string; tracker_id: string; entry_date: string; category: string; points: number; created_at: string },
        { id: string; tracker_id: string; entry_date: string; category: string; points: number; created_at?: string }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
