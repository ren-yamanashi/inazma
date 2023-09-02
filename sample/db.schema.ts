enum Status {
active,
inactive,
deleted
};

type Sample = {
id: number;
content: string;
order: number;
status: Status;
createdDate: Date;
};


type Triangle = {
sidea: number;
sideb: number;
sidec: number;
};
