export const stringIndexDecoratorDummy = `@Index("id_contents_idx", ["id", "content"], {
  unique: false
})

@Index("unique_name_idx", ["name"], {
  unique: true
})`;
