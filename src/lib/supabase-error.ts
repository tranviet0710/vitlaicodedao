// Turns a thrown Supabase/Postgrest error into something an admin can act on.
// Without this the UI collapses every failure into a generic "không thể lưu",
// which hides the common ones: RLS denials, duplicate slugs, missing columns.

interface PostgrestLikeError {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}

const isPostgrestLike = (error: unknown): error is PostgrestLikeError =>
  typeof error === 'object' && error !== null && 'message' in error;

export const describeSupabaseError = (error: unknown, fallback: string): string => {
  if (!isPostgrestLike(error)) return fallback;

  const { code, message, details } = error;

  switch (code) {
    case '42501':
      return 'Tài khoản này không có quyền admin nên bị Row Level Security từ chối.';
    case '23505':
      return `Giá trị bị trùng (slug đã tồn tại).${details ? ` ${details}` : ''}`;
    case '23503':
      return `Tham chiếu không hợp lệ.${details ? ` ${details}` : ''}`;
    default:
      return message || fallback;
  }
};
