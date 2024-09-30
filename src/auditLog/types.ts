export type LibraryAction = {
  type: "loan" | "return";
  bookId: string;
  userEmail: string;
  date: Date;
};
