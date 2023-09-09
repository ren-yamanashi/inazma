export const stringSchemaDummy = `enum Status {
active,
inactive,
deleted
};

@Index("id_contents_idx", ["id", "content"], {
unique: false
})
@Entity("sample", {database: "sample"})
class Sample {
@AutoIncrementColumn({
type: "bigint",
default: null,
unsigned: true,
unique: true,
primary: true
})
id: number;

@Column({
type: "varchar(255)",
default: null,
unsigned: false,
unique: false,
primary: false
})
content: string | null;

@Column({
type: "int",
default: 0,
unsigned: true,
unique: false,
primary: false
})
order: number;

@Column({
type: "enum('active','inactive','deleted')",
default: Status.active,
unsigned: false,
unique: false,
primary: false
})
status: Status;

@DefaultGeneratedColumn({
type: "datetime",
default: NOW(),
unsigned: false,
unique: false,
primary: false
})
createdDate: Date;
};




@Entity("triangle", {database: "sample"})
class Triangle {
@Column({
type: "double",
default: null,
unsigned: false,
unique: false,
primary: false
})
sidea: number | null;

@Column({
type: "double",
default: null,
unsigned: false,
unique: false,
primary: false
})
sideb: number | null;

@Column({
type: "double",
default: null,
unsigned: false,
unique: false,
primary: false
})
sidec: number | null;
};`;
