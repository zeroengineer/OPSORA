/** Fields every persisted OPSORA record carries. */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface Entity extends Timestamps {
  id: string;
}

/** Narrow a type to the fields accepted when creating a record. */
export type CreateInput<T extends Entity> = Omit<T, keyof Entity>;

/** Narrow a type to the fields accepted when updating a record. */
export type UpdateInput<T extends Entity> = Partial<CreateInput<T>>;

export type Nullable<T> = T | null;
