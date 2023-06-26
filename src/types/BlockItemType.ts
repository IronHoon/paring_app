export type BlockItemType = {
  id: number;
  user_id: number;
  target_table: 'users' | 'posts' | 'comments';
  target_id: number;
  created_at: string;
  updated_at: string;
};
